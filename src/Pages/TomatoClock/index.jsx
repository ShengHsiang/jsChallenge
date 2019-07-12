import React, { Component } from 'react'
import { Overlay, Tooltip, OverlayTrigger, Popover, Button } from 'react-bootstrap'
import classNames from 'classnames'
import IndexListComponent from './Components/IndexListComponent'
import { createRandomId, formatSeconds } from '../../Utils/functions'
import './tomatoClock.scss'
let interval; // 宣告一個全域變數，給定時器使用
const totalTime = (25 * 60); // 番茄鐘一次任務的時間（單位 秒）

class TomatoClockPage extends Component {
  state = {
    firstStep: true,
    secondStep: false,
    play: false,
    selectRow: '',
    selectMission: {}, // 當前選擇的物件
    currentInput: '',
    missionList: JSON.parse(localStorage.getItem("missionList")) || [],
    progress: 305.5, // 進度條 0% 為 305.5
  }

  // 組件渲染的時候從 localstorage 拿到任務列表
  componentDidMount() {
    const missionList = JSON.parse(localStorage.getItem("missionList")) || [];
    if (missionList.length > 0) {
      this.setState({
        missionList: missionList,
        selectRow: missionList[0].mission_id,
        selectMission: missionList[0],
        progress: parseInt(missionList[0].remainingTime / (totalTime / 305.5))
      })
    }
  }

  // state更新的時候同步更新 localStorage
  componentWillUpdate(nextProps, nextState) {
    console.log("nextState", nextState)
    localStorage.setItem("missionList", JSON.stringify(nextState.missionList))
  }

  componentWillUnmount() {
    // 如果有定時器，再組件卸載的時候清除它
    if (interval) {
      clearInterval(interval)
    }

    // 組件卸載的時候，把 missionList 存到 localStorage
    const { missionList } = this.state
    localStorage.setItem("missionList", JSON.stringify(missionList))
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
      selectRow: newId,
      selectMission: missionList.find(item => item.mission_id === newId) // 選中新增的 mission
    })
  }

  onPlayBtnClick() {
    const { play, selectRow, missionList } = this.state;
    const currentMissoin = missionList.find(item => item.mission_id === selectRow); // 拿到當前選擇的對象
    if (missionList.length > 0) {
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
      if (missionList.length === 1) { //刪除的任務是最後一條的時候，任務陣列置為空
        this.setState({
          missionList: [],
          selectMission: {},
          selectRow: '',
        })
      }
      else if (missionList.length === (findIndex + 1)) { // 刪除的任務是陣列最後一條的時候，選自身前一條數據
        missionList.splice(findIndex, 1);
        this.setState({
          missionList: missionList,
          selectMission: missionList[findIndex - 1],
          selectRow: missionList[findIndex - 1].mission_id
        })
      } else if (missionList.length > 1) {
        missionList.splice(findIndex, 1);
        this.setState({
          missionList: missionList,
          selectMission: missionList[findIndex],
          selectRow: missionList[findIndex].mission_id
        })
      }
    }
  }

  render() {
    // console.log(this.inputRef);
    const circleActive = classNames('tomato-main__middle__circle', { "active": this.state.play })
    const btnActive = classNames('tomato-main__middle__circle--playBtn', { "active": this.state.play })
    return (
      <div className="tomato--wrap">
        <div className="tomato-main--wrap">
          <section className="tomato-main__left">
            <div className="tomato-main__left__input--wrap" ref='input'>
              <OverlayTrigger
                // trigger="click"
                defaultShow={this.state.firstStep}
                placement="bottom"
                overlay={
                  <Popover
                    id="popover-basic"
                  >
                    <span className="tomato-span-text">請輸入一個番茄小任務！</span>
                  </Popover>
                }
              >
                <input
                  type="text"
                  className="tomato-main__left__input"
                  placeholder="ADD A NEW MISSION..."
                  onChange={(e) => this.handleInputChange(e)}
                  value={this.state.currentInput}
                />
              </OverlayTrigger>
              <OverlayTrigger
                // trigger="click"
                defaultShow={this.state.firstStep}
                placement="bottom"
                overlay={
                  <Popover
                    id="popover-basic"
                  >
                    <span className="tomato-span-text">點擊 "＋" 新增任務</span>
                  </Popover>
                }
              >
                <button onClick={() => this.handleAddBtnClick()} type="button" className="addMissionBtn">＋</button>
              </OverlayTrigger>
            </div>
            <div className="tomato-main__left__list--wrap">
              <IndexListComponent
                dataSource={this.state.missionList}
                selectRow={this.state.selectRow}
                countdown={this.state.selectMission.formatTime}
                onClick={this.onRowClick}
              />
            </div>
            {this.state.missionList.length > 4
              ?
              <div className="tomato-main__left__list--more">
                MORE
              </div>
              :
              ''
            }
          </section>
          <section className="tomato-main__middle">
            <svg xmlns="http://www.w3.org/200/svg" id="circleProcess">
              <circle cx="50%" cy="50%" r="48.6%" strokeWidth="3%" strokeLinecap="round" strokeDashoffset={`${this.state.progress}%`} />
            </svg>
            <div className={circleActive}>
              <OverlayTrigger
                placement="left"
                overlay={
                  <Popover
                    id="popover-basic"
                  >
                    <span className="tomato-span-text">點擊開始任務</span>
                  </Popover>
                }
              >
                <div className={btnActive} onClick={() => this.onPlayBtnClick()}>
                  <i className="material-icons">
                    {this.state.play ? "pause" : "play_arrow"}
                  </i>
                </div>
              </OverlayTrigger>
              <OverlayTrigger
                placement="right"
                overlay={
                  <Popover
                    id="popover-basic"
                    title="點擊刪除任務"
                  >
                    <span className="tomato-span-text">PS：正在進行中的任務無法刪除</span>
                  </Popover>
                }
              >
                <div className="tomato-main__middle__circle--square" onClick={() => this.handleDeleteBtn()}>
                  <span className={classNames("white", { "active": this.state.play })}></span>
                </div>
              </OverlayTrigger>
            </div>
          </section>
          <section className="tomato-main__right">
            <div className="tomato-main__right__toolBar ">
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

export default TomatoClockPage