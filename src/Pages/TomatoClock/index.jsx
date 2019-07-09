import React, { Component } from 'react'
import classNames from 'classnames'
import './tomatoClock.scss'

class TomatoClockPage extends Component {
  state = {
    play: false,
  }

  onPlayBtnClick() {
    this.setState({ play: !this.state.play })
  }

  render() {
    const circleActive = classNames('tomato-main__middle__circle', { "active": this.state.play })
    const btnActive = classNames('tomato-main__middle__circle--playBtn', { "active": this.state.play })
    return (
      <div className="tomato--wrap">
        <div className="tomato-main--wrap">
          <section className="tomato-main__left">
            <div className="tomato-main__left__input--wrap">
              <input type="text" className="tomato-main__left__input" placeholder="ADD A NEW MISSION..." />
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

export default TomatoClockPage