import React from 'react'

import Select from './select'


export default class ResultOrdering extends React.Component {

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

    this.state = {
      selected: this.orderSet[0].id
    }
  }

  onChange(id) {
    this.setState({selected: id})
    let ordering = this.orderSet.find((element) => { return element.id === id })
    let options = {
      ordering: this.parseOrdering(ordering)
    }
    this.props.handleOrderingChange(options)
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
                list={this.orderSet}
                selected={this.state.selected}
        />
      </div>
    )
  }
}

ResultOrdering.propTypes = {
  handleOrderingChange: React.PropTypes.func.isRequired,
}