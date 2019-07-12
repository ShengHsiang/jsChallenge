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
          <footer style={{marginTop: 'auto', alignSelf: 'flex-end'}}>
            Bug回饋：qzwxsa1234@gmail.com
          </footer>
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
        <div className="landing-card__line__title--wrap">
          <div className="landing-card__line__title">第{item.time}週：</div>
          <a href={item.link}>{item.title}</a>
        </div>
        {item.compeleted !== ''
          ?
          <div className="landing-card__line__content--wrap">
            <div className="landing-card__line__content--title">已完成：</div>
            <div>{item.compeleted}</div>
          </div>
          :
          ''
        }
        {item.unCompeleted !== ''
          ?
          <div className="landing-card__line__content--wrap">
            <div className="landing-card__line__content--title">未完成：</div>
            <div>{item.unCompeleted}</div>
          </div>
          :
          ''
        }
      </div>
    </div>
  ))
)

const CardData = [
  {
    time: '一',
    title: '番茄鐘 --> 一次專注做好一件事情',
    compeleted: '番茄任務的新增&刪除、任務進行中的進度條、刷新頁面任務仍然保留、操作提示',
    unCompeleted: '數據分析頁面、任務列表頁面、休息五分鐘狀態',
    link: '#/tomatoClock',
  },
]