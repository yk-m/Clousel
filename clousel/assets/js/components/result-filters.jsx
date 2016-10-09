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

  onFormReset(e) {
    e.preventDefault()

    this.setState({
      keyword: "",
      minPrice: "",
      maxPrice: ""
    })
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
        <form onSubmit={(e) => this.onFormSubmit(e)}
              onReset={(e) => this.onFormReset(e)}>
          <table className="p-filters">
            <caption>Search option</caption>
            <tbody>
              <tr className="p-filters__filter--keyword">
                <th>keyword</th>
                <td>
                  <input type="text" ref="keyword" value={this.state.keyword}
                         onChange={(e) => this.changeKeyword(e)} />
                </td>
              </tr>
              <tr className="p-filters__filter--price">
                <th>price</th>
                <td>
                  <span>¥<input type="text" ref="minPrice" value={this.state.minPrice}
                                onChange={(e) => this.changeMinPrice(e)} placeholder="----" /></span>
                  <span className="u-inline-block">〜</span>
                  <span>¥<input type="text" ref="maxPrice" value={this.state.maxPrice}
                                onChange={(e) => this.changeMaxPrice(e)} placeholder="----" /></span>
                </td>
              </tr>
              <tr className="p-filters__update">
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
}