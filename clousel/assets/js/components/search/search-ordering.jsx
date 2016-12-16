import React from 'react'

import Select from '../select'


export default class SearchOrdering extends React.Component {

  constructor(props) {
    super(props)

    this.order_set = [
      {id: "default", key: null, by: null, value: "default"},
      {id: "priceAsc", key: "price", by: "asc", value: "price(ascending)"},
      {id: "priceDesc", key: "price", by: "desc", value: "price(descending)"},
      {id: "updatedAsc", key: "updated", by: "asc", value: "oldest"},
      {id: "updatedDesc", key: "updated", by: "desc", value: "latest"}
    ]

    this.list = this.order_set.map((element) => {
      return {id: element.id, value: element.value}
    })
  }

  onChange(id) {
    this.props.handleOrderingChange(
      this.generateOrdering(
        this.order_set.find((element) => { return element.id === id })
      )
    )
  }

  generateOrdering(ordering) {
    if (!ordering || !ordering.id)
      return null

    if (ordering.by === "desc")
      return "-" + ordering.key
    return ordering.key
  }

  parseOrdering(ordering) {
    if (!ordering || ordering === "")
      return "default"

    if (ordering[0] === "-") {
      return this.findOrdering(ordering.substr(1), "desc")
    }

    return this.findOrdering(ordering, "asc")
  }

  findOrdering(key, by) {
    return this.order_set.find((ordering) => {
      if (ordering.key !== key)
        return false
      return ordering.by === by
    }).id
  }

  render() {
    return (
      <div className="p-showcase__sort-ordering">
        <Select handleChangeEvent={(id) => this.onChange(id)}
                select_id="ordering"
                list={this.order_set}
                default={this.parseOrdering(this.props.default)}
                classname={"p-showcase__sort-ordering-select"}
        />
      </div>
    )
  }
}

SearchOrdering.propTypes = {
  handleOrderingChange: React.PropTypes.func.isRequired,
  default: React.PropTypes.string
}

SearchOrdering.defaultProps = {
  default: ""
}