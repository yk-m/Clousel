import React from 'react'


export default class Options extends React.Component {

  render() {
    if (!Array.isArray(this.props.list))
      return null

    var options = this.props.list.map(function(element) {
      return <option key={element.id} value={element.id}>{element.value}</option>
    })
    return (
      <optgroup>
        {options}
      </optgroup>
    )
  }
}

Options.propTypes = {
  list: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.string,
    value: React.PropTypes.string
  }))
}
