import React, { Component } from 'react'
import classNames from 'classnames'
import IndexListComponent from './Components/IndexListComponent'
import { createRandomId, formatSeconds } from '../../Utils/functions'
import './tomatoClock.scss'
let interval; // 宣告一個全域變數，給定時器使用
const totalTime = (25 * 60); // 番茄鐘一次任務的時間（單位 秒）

class TomatoClockPage extends Component {
  state = {
    play: false,
    selectRow: dataList[0].mission_id,
    selectMission: dataList[0], // 當前選擇的物件
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
        remainingTime: totalTime, // 剩餘時間（時間戳）
        formatTime: formatSeconds(totalTime), // 剩餘時間（顯示用）
        isCompelete: false,
        isProgress: false,
        beginTime: '',
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
    if (!play && !currentMissoin.isCompelete && !currentMissoin.isProgress) { //未完成，且沒有進行過 --> 新開始
      interval = setInterval(this.countdownTime, 1000); // 設定一個定時器，必須保存再全域變量裡，方便清除
      this.setState({ play: !this.state.play }, () => interval)
    } else if (play && !currentMissoin.isCompelete && currentMissoin.isProgress) { //未完成，但進行過 --> 暫停 
      clearInterval(interval)
      this.setState({ play: !this.state.play })
    } else if (!play && !currentMissoin.isCompelete && currentMissoin.isProgress) {
      interval = setInterval(this.countdownTime, 1000);
      this.setState({ play: !this.state.play }, () => interval)
    }
  }

  countdownTime = () => {
    const { selectRow, missionList } = this.state;
    const currentMissoin = missionList.find(item => item.mission_id === selectRow)
    console.log(currentMissoin.remainingTime)

    if (currentMissoin.remainingTime > 0) {
      let obj = {
        remainingTime: currentMissoin.remainingTime - 1,
        formatTime: formatSeconds(currentMissoin.remainingTime),
        isProgress: true,
      }
      const newMissionStates = Object.assign({}, currentMissoin, obj)
      const newProgress = parseInt(currentMissoin.remainingTime / (totalTime / 305.5))
      this.setState({
        progress: newProgress,
        missionList: this.updateMissionList(selectRow, obj),
        selectMission: newMissionStates,
      })
    } else { // 時間到
      const obj = { // 更新狀態，完成時間
        formatTime: formatSeconds(currentMissoin.remainingTime),
        isCompelete: true,
        compeleteTime: new Date().getTime()
      }
      const newMissionStates = Object.assign({}, currentMissoin, obj)
      this.setState({
        play: false,
        missionList: this.updateMissionList(selectRow, obj),
        selectMission: newMissionStates,
        progress: 0
      })
      console.log("clear");
      clearInterval(interval) // 清除定時事件
    }
  }

  updateMissionList(id, updateObj) {
    const { missionList } = this.state;
    return missionList.map(item => {
      if (item.mission_id === id) {
        item = Object.assign({}, item, updateObj)
      }
      return item
    })
  }

  onRowClick = (id) => {
    const { missionList, play } = this.state
    const currentMissoin = missionList.find(item => item.mission_id === id)
    const newProgress = parseInt(currentMissoin.remainingTime / (totalTime / 305.5))

    if (!play) {
      if (currentMissoin.isCompelete) {
        this.setState({ progress: 0 })
      } else if (!currentMissoin.isCompelete && currentMissoin.isProgress) {
        this.setState({ progress: newProgress })
      } else (
        this.setState({ progress: 305.5 })
      )
      this.setState({
        selectRow: id,
        selectMission: currentMissoin
      })
    }
  }

  handleDeleteBtn() {
    const { play, selectRow, missionList } = this.state
    const findIndex = missionList.findIndex(item => item.mission_id === selectRow)
    if (!play) {
      if (missionList.length > 1) {
        missionList.splice(findIndex, 1);
        this.setState({
          missionList: missionList,
          selectMission: missionList[findIndex],
          selectRow: missionList[findIndex].mission_id
        })
      } else {
        this.setState({
          missionList: [],
          selectMission: {},
          selectRow: '',
        })
      }
    }
  }

  render() {
    console.log(this.state);
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
                countdown={this.state.selectMission.formatTime}
                onClick={this.onRowClick}
              />
            </div>
            <div className="tomato-main__left__list--more">
              MORE
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
              <div className="tomato-main__middle__circle--square" onClick={() => this.handleDeleteBtn()}>
                <span className={classNames("white", { "active": this.state.play })}></span>
              </div>
            </div>
          </section>
          <section className="tomato-main__right">
            <div className="tomato-main__right__toolBar">
              <div className="tomato-main__right__toolBar--icon">
                <div className="item">
                  <i className="material-icons">
                    list
                  </i>
                </div>
                <div className="item">
                  <i className="material-icons">
                    insert_chart
                  </i>
                </div>
                <div className="item">
                  <i className="material-icons">
                    library_music
                  </i>
                </div>
              </div>
              <div className="tomato-main__right__toolBar--text">
                POMODORO
              </div>
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
    remainingTime: totalTime, // 剩餘時間（時間戳）
    formatTime: formatSeconds(totalTime), // 剩餘時間（顯示用）
    isCompelete: false,
    isProgress: false,
    beginTime: '',
    compeleteTime: '',
  },
  {
    mission_id: createRandomId(),
    mission_content: 'The second thing to do today',
    remainingTime: totalTime, // 剩餘時間（時間戳）
    formatTime: formatSeconds(totalTime), // 剩餘時間（顯示用）
    isCompelete: false,
    isProgress: false,
    beginTime: '',
    compeleteTime: '',
  },
  {
    mission_id: createRandomId(),
    mission_content: 'The third thing to do today',
    remainingTime: totalTime, // 剩餘時間（時間戳）
    formatTime: formatSeconds(totalTime), // 剩餘時間（顯示用）
    isCompelete: false,
    isProgress: false,
    beginTime: '',
    compeleteTime: '',
  },
  {
    mission_id: createRandomId(),
    mission_content: 'The forth thing to do today',
    remainingTime: totalTime, // 剩餘時間（時間戳）
    formatTime: formatSeconds(totalTime), // 剩餘時間（顯示用）
    isCompelete: false,
    isProgress: false,
    beginTime: '',
    compeleteTime: '',
  },
]



export default TomatoClockPage