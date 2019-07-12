import React, { Component } from 'react'

class MissionListModal extends Component {
  render() {
    const { missionList, show } = this.props
    return (
      <div className="tomato-missionList--wrap"
        style={show ? { display: 'flex' } : { display: 'none' }}
      >
        <div className="tomato-missionList__left"></div>
        <div className="tomato-missionList__middle"></div>
        <div className="tomato-missionList__right">
          <div
            onClick={() => this.props.handleShow()}
            className="tomato-missionList__right--close"
          >
            <i className="material-icons">
              close
            </i>
          </div>
        </div>
      </div>
    )
  }
}

export default MissionListModal