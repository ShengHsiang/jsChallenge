import axios from 'axios';
import uriConfig from './uri_config';
import { throwErr } from '../utils/throwErr' //utils 捕捉服务端http状态码的方法

// 添加预设 axios 预设值
axios.defaults.baseURL = `${uriConfig.base_url}${uriConfig.base_service_code}`
axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'

// 请求拦截器 --> 添加签名验验证
axios.interceptors.request.use(
  config => {
    config.headers = addHeadersAndSign(config.url, config.data); // 请求 headers 加入签名验证
    config.timeout = 30 * 1000 //请求响应时间
    return config // 拦截器必须返回
  },
  error => {
    return Promise.reject(error); //抛出异常
  }
)

// 响应拦截器 --> 统一处理错误异常
axios.interceptors.response.use(
  response => {
    if (response.data.code === "0") { //服务端定义的响应 code 码为 0 时请求成功
      return Promise.resolve(response.data.data) //使用 Promise.resolve 正常响应
    } else {
      return Promise.reject(response.data) //使用 Promise.reject 抛出错误和异常
    }
  },
  error => {
    if (error && error.response) {
      let res = {}
      res.code = error.response.status
      res.msg = throwErr(error.response.status, error.response) //throwErr 捕捉服务端的 http状态码 定义在 utils工具类的方法
      return Promise.reject(res)
    }
    return Promise.reject(error)
  }
)
/**
 * 服务器的签名方法
 * @param {string} actionName 
 * @param {object} data 
 */
function addHeadersAndSign(actionName, data) {
  try {
    const LoginInfo = JSON.parse(sessionStorage.getItem("LoginInfo"))
    if (LoginInfo) {
      const userName = LoginInfo.userName;
      const pwd = LoginInfo.password;
      const reqBody = JSON.stringify(data);
      const slDomainUrl = uriConfig.base_slDomainUrl
      const ts = new Date().getTime();
      const actionNameToSign = `${uriConfig.base_service_code}${actionName}`
      const signInfo = SHA1(actionNameToSign + reqBody + pwd + ts);
      const headers = {
        "apiVer": "1.0",
        "encryptVer": "0",
        "serviceId": userName,
        "userInfo": userName,
        "slDomainUrl": slDomainUrl,
        "userSign": signInfo,
        "signInfo": signInfo,
        "ts": ts,
      }
      return headers
    } else {
      return Promise.reject("请先登入")
    }
  } catch (err) {
    console.error(err)
  }
}

/**
 * 对外暴露请求封装方法
 * @param {string} method //请求类型
 * @param {string} actionName //请求 url action
 * @param {object} data //请求数据
 */
export default function request(method, actionName, data) {
  method = method.toLocaleLowerCase() //封装 RESTful API的各种请求方式 以 post get delete为例
  switch (method) {
    case "post":
      return axios.post(actionName, data); break;
    case "get":
      return axios.get(actionName, {
        params: data
      }); break;
    case "delete":
      return axios.delete(actionName, {
        params: data
      }); break;
    case "put":
      return axios.put(actionName, {
        params: data
      }); break;
    default: return null;
  }
}