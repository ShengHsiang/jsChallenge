import React, { Component } from 'react'
import classNames from 'classnames'

class MissionListModal extends Component {
  state = {
    selectNav: '1'
  }
  render() {
    const { missionList, show, countdown, selectMission, play } = this.props
    return (
      show
        ?
        <div className="tomato-missionList--wrap">
          <div className="tomato-missionList__left">
            <nav className="tomato-missionList__left--nav">
              {menuData.map(item => (
                <div
                  className={classNames("tomato-missionList__left--navItem", { "active": this.state.selectNav === item.key })}
                  key={item.key}
                >
                  <div className="icon">
                    <i className="material-icons">
                      {item.icon}
                    </i>
                  </div>
                  <div className="text">{item.name}</div>
                </div>
              ))}
            </nav>
            <div className="tomato-missionList__left--mission">
              <div className={classNames("playBtn--wrap", { "active": play })}>
                <div className="playBtn" onClick={this.props.handlePlayBtn}>
                  <i className="material-icons">
                    {play ? "pause" : "play_arrow"}
                  </i>
                </div>
              </div>
              <div className="time">{countdown}</div>
              <div className="content">{selectMission.mission_content}</div>
            </div>
          </div>
          <div className="tomato-missionList__middle">
            <div className="tomato-missionList__middle__input--wrap">
              <input
                type="text"
                className="tomato-missionList__middle__input"
                placeholder="ADD A NEW MISSION..."
                onChange={(e) => this.props.handleInputChange(e)}
                value={this.state.currentInput}
              />
              <button onClick={() => this.props.handleAddBtnClick()} type="button" className="addMissionBtn">＋</button>
            </div>
          </div>
          <div className="tomato-missionList__right">
            <div
              onClick={() => this.props.handleShow()}
              className="tomato-missionList__right--close"
            >
              <i className="material-icons">
                close
              </i>
            </div>
            <div className="tomato-missionList__right--text">
              POMODORO
            </div>
          </div>
        </div>
        :
        ''
    )
  }
}


const menuData = [
  {
    key: '1',
    name: 'TO-DO LIST',
    icon: 'list'
  },
  {
    key: '2',
    name: 'ANALYTICS',
    icon: 'insert_chart'
  },
  {
    key: '3',
    name: 'RINGTONES',
    icon: 'library_music'
  },
]
export default MissionListModal