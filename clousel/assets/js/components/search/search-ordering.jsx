import React from 'react'

import Select from '../select'


export default class SearchOrdering extends React.Component {

  constructor(props) {
    super(props)

    this.orderSet = [
      {id: "default", key: null, by: null, value: "default"},
      {id: "priceAsc", key: "price", by: "asc", value: "price(ascending)"},
      {id: "priceDesc", key: "price", by: "desc", value: "price(descending)"}
    ]

    this.list = this.orderSet.map((element) => {
      return {id: element.id, value: element.value}
    })
  }

  onChange(id) {
    this.props.handleOrderingChange(
      this.parseOrdering(
        this.orderSet.find((element) => { return element.id === id })
      )
    )
  }

  parseOrdering(ordering) {
    if (!ordering || !ordering.id)
      return null

    if (ordering.by === "desc")
      return "-" + ordering.key
    return ordering.key
  }

  render() {
    return (
      <div className="p-result__sort-order">
        <Select handleChangeEvent={(id) => this.onChange(id)}
                select_id="ordering"
                list={this.orderSet}
                default={this.props.default}
        />
      </div>
    )
  }
}

SearchOrdering.propTypes = {
  handleOrderingChange: React.PropTypes.func.isRequired,
  default: React.PropTypes.string.isRequired
}