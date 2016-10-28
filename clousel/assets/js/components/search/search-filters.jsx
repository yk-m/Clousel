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

    this.setState(this.props.defaults)
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
      <div className="p-result__filter-form">
        <form onSubmit={(e) => this.submit(e)}>
          <table className="p-filters">
            <caption>Search option</caption>
            <tbody>
              <tr>
                <th>keyword</th>
                <td>
                  <input type="text" ref="search" value={this.state.search}
                         onChange={(e) => this.updateFilter("search", e)} />
                </td>
              </tr>
              <tr>
                <th>category</th>
                <td>
                  {
                    this.props.categories
                      ? <Select handleChangeEvent={(id) => this.updateCategory(id)}
                                select_id="categories"
                                list={this.props.categories}
                                default={this.state.category}
                        />
                      : null
                  }
                </td>
              </tr>
              <tr>
                <th>price</th>
                <td>
                  <span>¥<input type="text" ref="min_price" value={this.state.min_price}
                                placeholder="----" onChange={(e) => this.updateFilter("min_price", e)} /></span>
                  <span className="u-inline-block">〜</span>
                  <span>¥<input type="text" ref="max_price" defaultValue={this.state.max_price}
                                placeholder="----" onChange={(e) => this.updateFilter("max_price", e)} /></span>
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

SearchFilters.propTypes = {
  handleFiltersChange: React.PropTypes.func.isRequired,
  defaults: React.PropTypes.shape({
    search: React.PropTypes.string,
    category: React.PropTypes.string,
    min_price: React.PropTypes.string,
    max_price: React.PropTypes.string
  }).isRequired,
  categories: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      id: React.PropTypes.string,
      value: React.PropTypes.string
    })
  )
}