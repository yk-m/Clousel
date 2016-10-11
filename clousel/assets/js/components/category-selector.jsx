import React from 'react'

import Request from 'superagent'


export default class CategorySelector extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      selectedCategory: "null",
    }
  }

  onChangeSelectedValue(e) {
    let selectedCategory = e.target.value
    this.setState({selectedCategory: selectedCategory})

    if (selectedCategory === "null")
      this.props.handleCategoryChange(null)
    this.props.handleCategoryChange(selectedCategory)
  }

  render() {
    if (this.props.categories === null)
      return null

    return (
      <select value={this.state.selectedCategory} onChange={(e) => this.onChangeSelectedValue(e)}>
        {this.props.categories}
      </select>
    )
  }
}

CategorySelector.propTypes = {
  categories: React.PropTypes.array.isRequired,
  handleCategoryChange: React.PropTypes.func.isRequired,
}
