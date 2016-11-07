import React from 'react'


export default class Select extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      value: this.props.default
    }
  }

  componentWillReceiveProps(next_props) {
    this.setState({value: next_props.default})
  }

  onChange(e) {
    let value = e.target.value
    this.setState({value: value})
    this.props.handleChangeEvent(value)
  }

  render() {
    var options = this.props.list.map(function(element) {
      return <option key={element.id} value={element.id}>{element.value}</option>
    })
    return (
      <label className="c-select">
        <select value={this.state.value} onChange={(e) => this.onChange(e)}>
          {options}
        </select>
      </label>
    )
  }
}

Select.propTypes = {
  handleChangeEvent: React.PropTypes.func.isRequired,
  list: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.string,
    value: React.PropTypes.string
  })),
  default: React.PropTypes.string
}

Select.defaultProps = {
  default: ""
}