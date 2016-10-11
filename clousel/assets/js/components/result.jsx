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
      hasOccurredError: false,
      errorMessage: "",
      filtersAreHidden: true,
      categories: null,
      options: {
        keyword: "",
        category: "",
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
    let query = this.generateQuery()
    this.setState({
      loadingIsHidden: false,
      hasOccurredError: false,
      errorMessage: "",
    })

    Request
      .get(this.props.itemsFetchUrl)
      .query(query)
      .end( (err, res) => {
        console.log(res.status)
        if (!res.ok) {
          console.error(this.props.itemsFetchUrl, res.status, err.toString())
        }

        this.updateData(res.body)
      })
  }

  updateData(response) {
    if (!this.isset(response.results[0])) {
      this.setState({
        data: [],
        loadingIsHidden: true,
        filtersAreHidden: false,
        hasOccurredError: true,
        errorMessage: "アイテムが見つかりませんでした"
      })
      return
    }

    this.setState({
      data: response.results,
      pageNum: Math.ceil(response.count / this.props.paginate.perPage),
      loadingIsHidden: true,
      filtersAreHidden: true,
    })
  }

  loadCategoriesFromServer() {
    Request
      .get(this.props.categoriesFetchUrl)
      .end( (err, res) => {
        if (!res.ok) {
          console.error(this.props.categoriesFetchUrl, status, err.toString())
        }

        this.setState({
          categories: this.formatCategories(res.body)
        })
      })
  }

  formatCategories(categories) {
    const indent = "--- "

    categories.unshift({pk: "null", name: "選択してください", level: 0})
    return categories.map(function(category) {
      return <option key={category.pk} value={category.pk}>{generateIndent(category.level)+category.name}</option>
    })

    function generateIndent(level) {
      return Array(level+1).join(indent)
    }
  }

  componentDidMount() {
    this.loadItemsFromServer()
    this.loadCategoriesFromServer()
  }

  generateQuery() {
    let query = {
      limit: this.props.paginate.perPage,
      offset: this.state.offset
    }

    query.ordering = this.parseOrdering(this.state.ordering)
    query.search = this.state.options.keyword
    query.category = this.state.options.category
    query.min_price = this.state.options.minPrice
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

    this.setState({offset: offset}, () => {
      this.loadItemsFromServer()
    })
  }

  handleFiltersChange(options) {
    this.setState({options: options, offset: 0}, () => {
      this.loadItemsFromServer()
    })
  }

  handleOrderingChange(ordering) {
    this.setState({
      ordering: ordering,
      offset: 0
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
          <h2 className="p-result__title">Search Results <span onClick={(e) => this.toggleFiltersBlock(e)}>[option]</span></h2>
          <ResultOrdering handleOrderingChange={(e) => this.handleOrderingChange(e)} />
        </div>
        <ReactCSSTransitionGroup
          transitionName="slide"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}>
          {this.state.filtersAreHidden?
            null : <ResultFilters handleFiltersChange={(e) => this.handleFiltersChange(e)}
                                  category={{
                                    list: this.state.categories,
                                    pk: this.state.options.category
                                  }}
                                  /> }
        </ReactCSSTransitionGroup>
        <ResultList
          data={this.state.data}
          loadingIsHidden={this.state.loadingIsHidden}
          hasOccurredError={this.state.hasOccurredError}
          errorMessage={this.state.errorMessage}
          pageNum={this.state.pageNum}
          paginate={{
            handlePaginationClick: (e) => this.handlePaginationClick(e),
            marginPagesDisplayed: this.props.paginate.marginPagesDisplayed,
            pageRangeDisplayed: this.props.paginate.pageRangeDisplayed
          }}
        />
      </section>
    )
  }
}
