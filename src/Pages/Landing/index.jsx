import React, { Component } from 'react';
import './landing.scss';

class LandingPage extends Component {
  render() {
    return (
      <div className="landing--wrap">
        <div className="landing-list--wrap">
          <div className="landing-list__title">
            <h1>Hex school challenge (2nd)</h1>
            <span className="landing-list__title_underline"></span>
          </div>
          <CardGroup
            datasource={CardData}
            style={''}
          />
        </div>
      </div>
    )
  }
}

export default LandingPage

// 卡片组件
const CardGroup = ({ datasource, style }) => (
  datasource.map((item, index) => (
    <div className="landing-card--wrap" style={{ ...style }} key={index}>
      <div className="landing-card__line">
        <div className="landing-card__line__title">第{item.time}週：</div>
        <a href={item.link}>{item.title}</a>
      </div>
    </div>
  ))
)

const CardData = [
  {
    time: '一',
    title: '番茄鐘 --> 一次專注做好一件事情',
    link: '#/tomatoClock',
  },
]