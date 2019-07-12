import React, { Component } from 'react'
import classNames from 'classnames'

const IndexListComponent = ({ dataSource, selectRow, countdown, onClick }) => {
  const sliceData = dataSource.length < 4 ? dataSource : dataSource.slice(dataSource.length - 4, dataSource.length)// 只展示最後四條數據
  return sliceData.map(item => {
    const juadgeSelect = classNames("tomato-main__left__list--item", { active: selectRow === item.mission_id })
    return (
      <div className={juadgeSelect} key={item.mission_id}>
        <div className="tomato-main__left__list--top" onClick={() => onClick(item.mission_id)}>
          <div className="circle"></div>
          <div className="content" title={item.mission_content}>
            {item.mission_content}
            {/* <span></span> */}
          </div>
          <div className="icon">
            <i className="material-icons">
              play_circle_outline
            </i>
          </div>
        </div>
        <div className="tomato-main__left__list--bottom">
          <div className="countdown">{countdown}</div>
        </div>
      </div>
    )
  })
}

export default IndexListComponent