import React, { Component } from 'react';
import {
  HashRouter as Router, Switch, Route, Redirect,
} from 'react-router-dom';
import RenderRoute from '../Routes/RenderRoutes'
import basic_routes from '../Routes/basic_routes'

export default class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          {RenderRoute(basic_routes)}
          <Redirect exact from="/" to="/index" />
        </Switch>
      </Router>
    )
  }
}