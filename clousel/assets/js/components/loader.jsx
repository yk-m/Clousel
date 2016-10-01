import React from 'react'


export default class Loader extends React.Component {
  render() {
    if(!this.props.isActive){
      return null
    }
    return (
      <div className="p-items--state_loading">
        <i></i>
      </div>
    )
  }
}