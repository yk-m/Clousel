import React from 'react'

import Select from './select'


export default class ResultFilters extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      search: this.props.defaults.search,
      category: this.props.defaults.category,
      min_price: this.props.defaults.min_price,
      max_price: this.props.defaults.max_price,
    }
  }

  submit(e) {
    if (e !== undefined)
      e.preventDefault()

    let category = (this.state.category === "null") ? null : this.state.category
    let options = {
      search: this.state.search,
      category: category,
      min_price: this.state.min_price,
      max_price: this.state.max_price
    }
    this.props.handleFiltersChange(options)
  }

  reset(e) {
    e.preventDefault()

    this.setState({
      search: "",
      category: "",
      min_price: "",
      max_price: ""
    }, () => {
      this.submit()
    })
  }

  changeKeyword(e) {
    this.setState({search: e.target.value})
  }

  changeCategory(id) {
    this.setState({category: id}, () => {
      this.submit()
    })
  }

  changeMinPrice(e) {
    this.setState({min_price: e.target.value})
  }

  changeMaxPrice(e) {
    this.setState({max_price: e.target.value})
  }

  render() {
    return (
      <div className="p-result__filter-form">
        <form onSubmit={(e) => this.submit(e)}
              onReset={(e) => this.reset(e)}>
          <table className="p-filters">
            <caption>Search option</caption>
            <tbody>
              <tr>
                <th>keyword</th>
                <td>
                  <input type="text" ref="search" value={this.state.search}
                         onChange={(e) => this.changeKeyword(e)} />
                </td>
              </tr>
              <tr>
                <th>category</th>
                <td>
                  {
                    this.props.categories ?
                      <Select handleChangeEvent={(id) => this.changeCategory(id)}
                              list={this.props.categories}
                              selected={this.props.defaults.category}
                      />
                    :
                      null
                  }
                </td>
              </tr>
              <tr>
                <th>price</th>
                <td>
                  <span>¥<input type="text" ref="min_price" value={this.state.min_price}
                                onChange={(e) => this.changeMinPrice(e)} placeholder="----" /></span>
                  <span className="u-inline-block">〜</span>
                  <span>¥<input type="text" ref="max_price" value={this.state.max_price}
                                onChange={(e) => this.changeMaxPrice(e)} placeholder="----" /></span>
                </td>
              </tr>
              <tr>
                <th></th>
                <td>
                  <input type="reset" value="Reset" />
                  <input type="submit" value="Update" />
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    )
  }
}

ResultFilters.propTypes = {
  handleFiltersChange: React.PropTypes.func.isRequired,
  categories: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      id: React.PropTypes.string,
      value: React.PropTypes.string
    })
  ),
  defaults: React.PropTypes.shape({
    search: React.PropTypes.string,
    category: React.PropTypes.string,
    min_price: React.PropTypes.string,
    max_price: React.PropTypes.string
  })
}