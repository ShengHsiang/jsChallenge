import Loadable from '@loadable/component'
import LandingPage from '../Pages/Landing/index'

const basic_routes = [
  {
    path: "/index", // 跳转路由
    component: Loadable(()=>import('../Pages/Landing/index.jsx')), // 异步加载组件
    title: '首頁' // 跳转页面的标题
  },
  {
    path: "/tomatoClock",
    component: Loadable(() => import('../Pages/TomatoClock/index.jsx')),
    title: '番茄鐘'
  }
]

export default basic_routes