import React from 'react'

import Select from '../select'


export default class SearchFilters extends React.Component {

  constructor(props) {
    super(props)

    this.state = this.props.defaults
  }

  submit(e) {
    if (e !== undefined)
      e.preventDefault()

    this.props.handleFiltersChange(this.state)
  }

  reset(e) {
    if (e !== undefined)
      e.preventDefault()

    this.setState({
      search: "",
      category: "",
      min_price: "",
      max_price: ""
    })
  }

  updateFilter(filtername, e) {
    let filter = {}
    filter[filtername] = e.target.value

    this.setState(filter)
  }

  updateCategory(id) {
    this.setState({category: id}, () => {
      this.submit()
    })
  }

  render() {
    return (
      <div className="p-showcase__filter-form">
        <form onSubmit={(e) => this.submit(e)}
              onReset={(e) => this.reset(e)}>
          <div className="p-showcase__filters">
            <div className="p-showcase__filter-title">keyword</div>
            <div className="p-showcase__filter-input">
              <input type="text" ref="search" value={this.state.search}
                     onChange={(e) => this.updateFilter("search", e)} />
            </div>
            <div className="p-showcase__filter-title">category</div>
            <div className="p-showcase__filter-input">
              {
                this.props.categories
                  ? <Select handleChangeEvent={(id) => this.updateCategory(id)}
                            select_id="categories"
                            list={this.props.categories}
                            default={this.state.category}
                    />
                  : null
              }
            </div>
            <div className="p-showcase__filter-title">price</div>
            <div className="p-showcase__filter-input">
              <div className="p-showcase__filter-price">
                <div className="p-showcase__filter-price--yen1">¥</div>
                <div className="p-showcase__filter-price--input1">
                  <input type="text" ref="min_price" value={this.state.min_price}
                         placeholder="----" onChange={(e) => this.updateFilter("min_price", e)} />
                </div>
                <div className="p-showcase__filter-price--separator">〜</div>
                <div className="p-showcase__filter-price--yen2">¥</div>
                <div className="p-showcase__filter-price--input2">
                  <input type="text" ref="max_price" defaultValue={this.state.max_price}
                         placeholder="----" onChange={(e) => this.updateFilter("max_price", e)} />
                </div>
              </div>
            </div>
            <div className="p-showcase__filter-button">
              <input type="reset" value="Reset" />
              <input type="submit" value="Update" />
            </div>
          </div>
        </form>
      </div>
    )
  }
}

SearchFilters.propTypes = {
  handleFiltersChange: React.PropTypes.func.isRequired,
  defaults: React.PropTypes.shape({
    search: React.PropTypes.string,
    category: React.PropTypes.string,
    min_price: React.PropTypes.string,
    max_price: React.PropTypes.string
  }),
  categories: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      id: React.PropTypes.string,
      value: React.PropTypes.string
    })
  )
}

SearchFilters.defaultProps = {
  defaults: {
    search: "",
    category: "",
    min_price: "",
    max_price: ""
  }
}