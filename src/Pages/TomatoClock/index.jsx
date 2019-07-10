import React, { Component } from 'react'
import classNames from 'classnames'
import IndexListComponent from './Components/IndexListComponent'
import { createRandomId } from '../../Utils/functions'
import './tomatoClock.scss'

class TomatoClockPage extends Component {
  state = {
    play: false,
    countdown: '25:00',
    EndTime: '',
    selectRow: dataList[0].mission_id,
    currentInput: '',
    missionList: dataList,
  }

  handleInputChange(e) {
    this.setState({ currentInput: e.target.value })
  }

  handleAddBtnClick() {
    const { currentInput, missionList } = this.state;
    const newId = createRandomId(); // 生成一個隨機數 ID

    if (currentInput || currentInput !== '') { // input 不為空
      missionList.push({  // push 一個自定義物件
        mission_id: newId,
        mission_content: currentInput,
        beginTime: '',
        endTime: '',
        isCompelete: false,
        isPause: false,
        compeleteTime: '',
      })
    }
    this.setState({
      currentInput: '', // 重置 input 為空 
      missionList: missionList,
      selectRow: newId, // 選中新增的 mission
    })
  }

  onPlayBtnClick() {
    const { play, selectRow, missionList } = this.state;
    // 拿到當前選擇的對象
    const currentMissoin = missionList.find(item => item.mission_id === selectRow);
    const nowTimeStamp = new Date().getTime(); // 任務開始時間
    const endTimeStamp = nowTimeStamp + (25 * 60 * 1000); // 預計任務結束時間

    if (!play) {
      currentMissoin.beginTime = nowTimeStamp; 
      currentMissoin.endTime = endTimeStamp;
      this.setState({ 
        play: !this.state.play,
        EndTime: endTimeStamp
      })
      setInterval(this.countdownTime(endTimeStamp), 1000);
    }
    console.log("currentMissoin", currentMissoin);
  }

  countdownTime(end) {
    
  }

  onRowClick = (id) => {
    this.setState({ selectRow: id })
  }

  render() {
    const circleActive = classNames('tomato-main__middle__circle', { "active": this.state.play })
    const btnActive = classNames('tomato-main__middle__circle--playBtn', { "active": this.state.play })

    return (
      <div className="tomato--wrap">
        <div className="tomato-main--wrap">
          <section className="tomato-main__left">
            <div className="tomato-main__left__input--wrap">
              <input
                type="text"
                className="tomato-main__left__input"
                placeholder="ADD A NEW MISSION..."
                onChange={(e) => this.handleInputChange(e)}
                value={this.state.currentInput}
              />
              <button onClick={() => this.handleAddBtnClick()} type="button" className="addMissionBtn">＋</button>
            </div>
            <div className="tomato-main__left__list--wrap">
              <IndexListComponent
                // dataSource={dataList}
                dataSource={this.state.missionList}
                selectRow={this.state.selectRow}
                countdown={this.state.countdown}
                onClick={this.onRowClick}
              />
            </div>
          </section>
          <section className="tomato-main__middle">
            <svg xmlns="http://www.w3.org/200/svg" id="circleProcess">
              <circle cx="50%" cy="50%" r="48.6%" strokeWidth="3%" strokeLinecap="round" />
            </svg>
            <div className={circleActive}>
              <div className={btnActive} onClick={() => this.onPlayBtnClick()}>
                <i className="material-icons">
                  {this.state.play ? "pause" : "play_arrow"}
                </i>
              </div>
              <div className="tomato-main__middle__circle--square">
                <span className={classNames("white", { "active": this.state.play })}></span>
              </div>
            </div>
          </section>
          <section className="tomato-main__right">
            <div className="tomato-main__right__toolBar">
              <div className="tomato-main__right__toolBar--icon"></div>
              <div className="tomato-main__right__toolBar--text"></div>
            </div>
          </section>
        </div>
      </div>
    )
  }
}

const dataList = [
  {
    mission_id: createRandomId(),
    mission_content: 'The first thing to do today',
    beginTime: '',
    endTime: '',
    isCompelete: false,
    isPause: false,
    compeleteTime: '',
  },
  {
    mission_id: createRandomId(),
    mission_content: 'The second thing to do today',
    beginTime: '',
    endTime: '',
    isCompelete: false,
    isPause: false,
    compeleteTime: '',
  },
  {
    mission_id: createRandomId(),
    mission_content: 'The third thing to do today',
    beginTime: '',
    endTime: '',
    isCompelete: false,
    isPause: false,
    compeleteTime: '',
  },
  {
    mission_id: createRandomId(),
    mission_content: 'The forth thing to do today',
    beginTime: '',
    endTime: '',
    isCompelete: false,
    isPause: false,
    compeleteTime: '',
  },
]



export default TomatoClockPage