import React, { Component } from 'react'
import classNames from 'classnames'
import IndexListComponent from './Components/IndexListComponent'
import { createRandomId, formatSeconds } from '../../Utils/functions'
import './tomatoClock.scss'
let interval; // 宣告一個全域變數，給定時器使用
const totalTime = (25 * 60 * 1000); // 番茄鐘一次任務的時間

class TomatoClockPage extends Component {
  state = {
    play: false,
    countdown: '25:00',
    EndTime: '',
    selectRow: dataList[0].mission_id,
    selectMission: dataList[0],
    currentInput: '',
    missionList: dataList,
    progress: 305.5, // 進度條 0% 為 305.5
  }

  componentWillUnmount() {
    // 如果有定時器，再組件卸載的時候清除它
    if (interval) {
      clearInterval(interval)
    }
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
        pauseTime: '',
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
    const currentMissoin = missionList.find(item => item.mission_id === selectRow); // 拿到當前選擇的對象
    const nowTimeStamp = new Date().getTime(); // 任務開始時間
    const endTimeStamp = nowTimeStamp + totalTime; // 預計任務結束時間

    if (!play && !currentMissoin.isCompelete) { // 正在進行或是已經完成的任務不能再次開始
      currentMissoin.beginTime = nowTimeStamp;
      currentMissoin.endTime = endTimeStamp;
      interval = setInterval(this.countdownTime, 1000); // 設定一個定時器，必須保存再全域變量裡，方便清除

      this.setState({
        play: !this.state.play,
        EndTime: endTimeStamp
      }, () => interval)

    }
    // console.log("currentMissoin", currentMissoin);
  }

  countdownTime = () => {
    const { selectRow, missionList } = this.state;
    const endTimeStamp = this.state.EndTime;
    const nowTimeStamp = new Date().getTime();
    const time = parseInt(endTimeStamp - nowTimeStamp) // 進行中的時間

    if (time > 0) {
      const formatMinutes = ("0" + (new Date(time).getMinutes())).slice(-2); // 計算＆格式化時間，例如 24:59這樣顯示
      const formatSec = ("0" + (new Date(time).getSeconds())).slice(-2);
      const newProgress = parseInt(time / parseInt(totalTime / 305.5))
      this.setState({ countdown: `${formatMinutes}:${formatSec}`, progress: newProgress })
    } else { // 時間到

      // 找到完成的任務，更新任務狀態
      const updateMissionList = missionList.map(item => {
        if (item.mission_id === selectRow) {
          item.compeleteTime = new Date().getTime();
          item.isCompelete = true;
        }
        return item
      })
      this.setState({
        play: false,
        countdown: '00:00',
        missionList: updateMissionList,
        progress: 0
      })
      clearInterval(interval) // 清除定時事件
    }
  }

  onRowClick = (id) => {
    const { missionList, play } = this.state
    if (!play) {
      const selectMission = missionList.find(item => item.mission_id === id)
      if (selectMission.isCompelete) {
        this.setState({ countdown: '00:00', progress: 0 })
      } else {
        this.setState({ countdown: '25:00', progress: 305.5 })
      }
      this.setState({
        selectRow: id,
        selectMission: selectMission
      })
    }
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
              <circle cx="50%" cy="50%" r="48.6%" strokeWidth="3%" strokeLinecap="round" strokeDashoffset={`${this.state.progress}%`} />
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
    pauseTime: '',
    isCompelete: false,
    isPause: false,
    compeleteTime: '',
  },
  {
    mission_id: createRandomId(),
    mission_content: 'The second thing to do today',
    beginTime: '',
    endTime: '',
    pauseTime: '',
    isCompelete: false,
    isPause: false,
    compeleteTime: '',
  },
  {
    mission_id: createRandomId(),
    mission_content: 'The third thing to do today',
    beginTime: '',
    endTime: '',
    pauseTime: '',
    isCompelete: false,
    isPause: false,
    compeleteTime: '',
  },
  {
    mission_id: createRandomId(),
    mission_content: 'The forth thing to do today',
    beginTime: '',
    endTime: '',
    pauseTime: '',
    isCompelete: false,
    isPause: false,
    compeleteTime: '',
  },
]



export default TomatoClockPage