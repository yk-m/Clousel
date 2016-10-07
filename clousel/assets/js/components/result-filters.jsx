import React from 'react'


export default class ResultFilters extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      keyword: "",
      minPrice: "",
      maxPrice: ""
    }
  }

  onFormSubmit(e) {
    e.preventDefault()

    let options = {
      keyword: this.state.keyword,
      minPrice: this.state.minPrice,
      maxPrice: this.state.maxPrice
    }
    this.props.handleFiltersChange(options)
  }

  changeKeyword(e) {
    this.setState({keyword: e.target.value})
  }

  changeMinPrice(e) {
    this.setState({minPrice: e.target.value})
  }

  changeMaxPrice(e) {
    this.setState({maxPrice: e.target.value})
  }

  render() {
    return (
      <div className="p-result__filters">
        <form onSubmit={(e) => this.onFormSubmit(e)}>
          <table className="p-filter-table">
            <caption>Search option</caption>
            <tbody>
              <tr>
                <th>keyword</th>
                <td>
                  <input type="text" ref="keyword" value={this.state.keyword} onChange={(e) => this.changeKeyword(e)} />
                </td>
              </tr>
              <tr>
                <th>price</th>
                <td>
                  min: ¥<input type="text" ref="minPrice" value={this.state.minPrice}
                               onChange={(e) => this.changeMinPrice(e)} placeholder="----" /> to
                  max: ¥<input type="text" ref="maxPrice" value={this.state.maxPrice}
                               onChange={(e) => this.changeMaxPrice(e)} placeholder="----" />
                </td>
              </tr>
              <tr>
                <th></th>
                <td>
                  <input type="submit" className="p-result__update-button" value="Update" />
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
}