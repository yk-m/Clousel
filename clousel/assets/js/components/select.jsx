import React from 'react'


export default class Select extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      selected: this.props.selected
    }
  }

  onChange(e) {
    let selected = e.target.value
    this.props.handleChangeEvent(selected)
    this.setState({selected: selected})
  }

  render() {
    var options = this.props.list.map(function(element) {
      return <option key={element.id} value={element.id}>{element.value}</option>
    })
    return (
      <label className="c-select">
        <select value={this.state.selected} onChange={(e) => this.onChange(e)}>
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
  selected: React.PropTypes.string
}
