import Loadable from '@components/common/Loadable'

const client_routes = [
  {
    path: "/home/dashboard", // 跳转路由
    component: Loadable(() => import('../pages/client/home/dashboard/index')), // 异步加载组件
    title: '数据分析' // 跳转页面的标题
  },
  {
    path: "/home/info_profile", // 跳转路由
    component: Loadable(() => import('../pages/client/home/infoProfile/index')), // 异步加载组件
    title: '信息概况' // 跳转页面的标题
  },
]

export default client_routes