import React from 'react'


export default class Select extends React.Component {

  onChange(e) {
    this.props.handleChangeEvent(e.target.value)
  }

  render() {
    var options = this.props.list.map(function(element) {
      return <option key={element.id} value={element.id}>{element.value}</option>
    })
    return (
      <label className="c-select">
        <select ref={this.props.select_id} defaultValue={this.props.default} onChange={(e) => this.onChange(e)}>
          {options}
        </select>
      </label>
    )
  }
}

Select.propTypes = {
  handleChangeEvent: React.PropTypes.func.isRequired,
  select_id: React.PropTypes.string.isRequired,
  list: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.string,
    value: React.PropTypes.string
  })),
  default: React.PropTypes.string.isRequired
}
