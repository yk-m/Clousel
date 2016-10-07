import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import Request from 'superagent'

import ResultFilters from './result-filters'
import ResultList from './result-list'
import ResultOrdering from './result-ordering'


export default class Result extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      data: [],
      offset: 0,
      pageNum: 0,
      loadingIsHidden: false,
      filtersAreHidden: true,
      options: {
        keyword: "",
        minPrice: "",
        maxPrice: ""
      },
      ordering: {
        key: "",
        by: ""
      }
    }
  }

  loadItemsFromServer() {
    let _query = this.generateQuery()

    Request
      .get(this.props.url)
      .query(_query)
      .end( (err, res) => {
        if (!res.ok) {
          console.error(this.props.url, status, err.toString())
        }

        console.log(res.body.results)

        this.setState({
          data: res.body.results,
          pageNum: Math.ceil(res.body.count / this.props.paginate.perPage),
          loadingIsHidden: true,
        })
      })
  }

  componentDidMount() {
    this.loadItemsFromServer();
  }

  generateQuery() {
    let query = {
      limit: this.props.paginate.perPage,
      offset: this.state.offset
    }

    let ordering = this.parseOrdering(this.state.ordering)
    if (ordering !== null)
      query.ordering = ordering

    if (this.isset(this.state.options.keyword))
      query.search = this.state.options.keyword
    if (this.isset(this.state.options.minPrice))
      query.min_price = this.state.options.minPrice
    if (this.isset(this.state.options.maxPrice))
      query.max_price = this.state.options.maxPrice

    return query
  }

  parseOrdering(ordering) {
    if (!this.isset(ordering))
      return null
    if (!this.isset(ordering.key))
      return null

    if (ordering.by === "desc")
      return "-" + ordering.key
    return ordering.key
  }

  isset(data) {
    if(data === "" || data === null || data === undefined)
      return false
    return true
  }

  handlePaginationClick(data) {
    let selected = data.selected
    let offset = Math.ceil(selected * this.props.paginate.perPage)

    this.props.paginate.onClick()

    this.setState({offset: offset, loadingIsHidden: false}, () => {
      this.loadItemsFromServer()
    })
  }

  handleFiltersChange(options) {
    this.setState({options: options, offset: 0, loadingIsHidden: false}, () => {
      this.loadItemsFromServer()
    })
  }

  handleOrderingChange(ordering) {
    this.setState({
      ordering: ordering,
      offset: 0, loadingIsHidden: false
    }, () => {
      this.loadItemsFromServer()
    })
  }

  toggleFiltersBlock() {
    this.setState({filtersAreHidden: !this.state.filtersAreHidden})
  }

  render() {
    return (
      <section className="p-result" >
        <div className="p-result__header">
          <h2 className="p-result__title">Search Results <span onClick={this.toggleFiltersBlock.bind(this)}>[option]</span></h2>
          <ResultOrdering handleOrderingChange={this.handleOrderingChange.bind(this)} />
        </div>
        <ReactCSSTransitionGroup
          transitionName="slide"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}>
          {this.state.filtersAreHidden?
            null : <ResultFilters handleFiltersChange={this.handleFiltersChange.bind(this)} /> }
        </ReactCSSTransitionGroup>
        <ResultList
          data={this.state.data}
          loadingIsHidden={this.state.loadingIsHidden}
          pageNum={this.state.pageNum}
          paginate={{
            handlePaginationClick: this.handlePaginationClick.bind(this),
            marginPagesDisplayed: this.props.paginate.marginPagesDisplayed,
            pageRangeDisplayed: this.props.paginate.pageRangeDisplayed
          }}
        />
      </section>
    )
  }
}