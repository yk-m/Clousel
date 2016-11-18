import React from 'react'


export default class ErrorReporter extends React.Component {

  render() {
    return (
      <div className="p-items--state_error">
        <p>{this.props.message}</p>
      </div>
    )
  }
}

ErrorReporter.propTypes = {
  message: React.PropTypes.string.isRequired,
}