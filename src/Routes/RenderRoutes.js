import React from 'react'
import { Route, Redirect } from 'react-router-dom'

/**
 * 
 * @param {object} route // 传入路由配置物件
 */
const RouteWithSubRoutes = route => {
  //加入 权限效验 与 动态标题配置
  const isLogged = true
  return (
    isLogged
      ? <Route
        exact
        path={route.path}
        render={props => {
          document.title = route.title || "默认title"; //标题配置
          return <route.component {...props} routes={route.routes}></route.component>
        }}
      />
      : <Redirect to="/login" />
  );
};

/**
 * @param {Array} routes_config //动态渲染路由数组
 */
const renderRoute = (routes_config) => {
  return routes_config.map((route, i) => {
    return <RouteWithSubRoutes key={i} {...route} />
  })
}

export default renderRoute