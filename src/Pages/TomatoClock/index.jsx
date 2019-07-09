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
              <div className="tomato-main__middle__circle__playBtn">
                <i class="material-icons">
                  play_arrow
                </i>
              </div>
            </div>
          </section>
          <section className="tomato-main__right"></section>
        </div>
      </div>
    )
  }
}

export default TomatoClockPage