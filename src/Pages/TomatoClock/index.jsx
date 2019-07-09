import React, { Component } from 'react'
import './tomatoClock.scss'

class TomatoClockPage extends Component {
  render() {
    return (
      <div className="tomato--wrap">
        <div className="tomato-main--wrap">
          <section className="tomato-main__left">
            <div className="tomato-main__left__input--wrap">
              <input type="text" className="tomato-main__left__input" placeholder="ADD A NEW MISSION..." />
            </div>
          </section>
          <section className="tomato-main__middle">
            <div className="tomato-main__middle__circle">
              <div className="tomato-main__middle__circle--playBtn">
                <i class="material-icons">
                  play_arrow
                </i>
              </div>
              <div className="tomato-main__middle__circle--square">
                <span className="white"></span>
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