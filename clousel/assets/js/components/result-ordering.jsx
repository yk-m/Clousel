import React from 'react'


export default class ResultOrdering extends React.Component {

  constructor(props) {
    super(props)

    this.select = [
      {key: "default", value: "default"},
      {key: "priceAsc", value: "price(ascending)"},
      {key: "priceDesc", value: "price(descending)"}
    ]

    this.ordering = {
      "default" : null,
      "priceAsc": {key: "price", by: "asc"},
      "priceDesc": {key: "price", by: "desc"}
    }

    this.state = {
      selectedKey: "default"
    }
  }

  onChangeSelectValue(e) {
    let selectedKey = e.target.value
    this.setState({selectedKey: selectedKey})

    let ordering = this.ordering[selectedKey]
    if (ordering === null) {
      this.props.handleOrderingChange()
      return
    }

    this.props.handleOrderingChange(ordering)
  }

  render() {
    var options = this.select.map(function(obj) {
      return <option key={obj.key} value={obj.key}>{obj.value}</option>
    })
    return (
      <div className="p-result__sort-order">
        <label className="c-select">
          <select value={this.state.selectedKey} onChange={(e) => this.onChangeSelectValue(e)}>
            {options}
          </select>
        </label>
      </div>
    )
  }
}

ResultOrdering.propTypes = {
  handleOrderingChange: React.PropTypes.func.isRequired,
}