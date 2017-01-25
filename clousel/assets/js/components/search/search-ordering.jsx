import React from 'react'

import Select from 'components/select'


export default class SearchOrdering extends React.Component {

  constructor(props) {
    super(props)

    this.order_set = [
      {id: "default", key: null, by: null, value: gettext("Category")},
      {id: "priceAsc", key: "price", by: "asc", value: gettext("Price: low to high")},
      {id: "priceDesc", key: "price", by: "desc", value: gettext("Price: high to low")},
      {id: "updatedAsc", key: "updated", by: "asc", value: gettext("Oldest")},
      {id: "updatedDesc", key: "updated", by: "desc", value: gettext("Latest")}
    ]

    this.list = this.order_set.map((element) => {
      return {id: element.id, value: element.value}
    })
  }

  onChange = (id) => {
    this.props.handleOrderingChange(
      this.generate_ordering(
        this.order_set.find((element) => { return element.id === id })
      )
    )
  }

  generate_ordering(ordering) {
    if (!ordering || !ordering.id)
      return null

    if (ordering.by === "desc")
      return "-" + ordering.key
    return ordering.key
  }

  parse_ordering(ordering) {
    if (!ordering || ordering === "")
      return "default"

    if (ordering[0] === "-") {
      return this.find_ordering(ordering.substr(1), "desc")
    }

    return this.find_ordering(ordering, "asc")
  }

  find_ordering(key, by) {
    return this.order_set.find((ordering) => {
      if (ordering.key !== key)
        return false
      return ordering.by === by
    }).id
  }

  render() {
    return (
      <div className="p-showcase__sort-ordering">
        <Select handleChangeEvent={this.onChange}
                select_id="ordering"
                list={this.order_set}
                default={this.parse_ordering(this.props.default)}
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