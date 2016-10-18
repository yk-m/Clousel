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
      query: {
        search: "",
        category: "",
        min_price: "",
        max_price: "",
        ordering: ""
      },
    }

    this.queryKeys = [
      "search", "category", "min_price", "max_price", "ordering"
    ]
  }

  get categoryUndefined() {
    const value = "0"
    return value
  }

  loadItemsFromServer() {
    let query = this.state.query
    query.limit = this.props.paginate.perPage
    query.offset = this.state.offset

    this.setState({
      loadingIsHidden: false,
      hasOccurredError: false,
      errorMessage: "",
    })
    console.log(query)

    Request
      .get(this.props.itemsFetchUrl)
      .query(query)
      .set('Accept', 'application/json')
      .end( (err, res) => {
        if (!res.ok) {
          console.error(this.props.itemsFetchUrl, res.status, err.toString())
        }
        console.log(res)

        this.updateData(res.body)
      })
  }

  updateData(response) {
    if (!response.results[0]) {
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
    })
  }

  loadCategoriesFromServer() {
    Request
      .get(this.props.categoriesFetchUrl)
      .set('Accept', 'application/json')
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

    categories.unshift({pk: this.categoryUndefined, name: "選択してください", level: 0})
    return categories.map(function(category) {
      return {
        id: '' + category.pk,
        value: generateIndent(category.level) + category.name
      }
    })

    function generateIndent(level) {
      return Array(level+1).join(indent)
    }
  }

  componentDidMount() {
    this.loadItemsFromServer()
    this.loadCategoriesFromServer()
  }

  handleOptionsChange(options) {
    this.setState({query: this.generateQuery(options), offset: 0}, () => {
      this.loadItemsFromServer()
    })
  }

  generateQuery(updates) {
    let query = {}
    this.queryKeys.forEach((key) => {
      query[key] = updates[key]
    })
    return this.formatQuery(query)
  }

  formatQuery(query) {
    if (query["category"] === this.categoryUndefined)
      query["category"] = null
    return query
  }

  handlePaginationClick(data) {
    let selected = data.selected
    let offset = Math.ceil(selected * this.props.paginate.perPage)

    this.props.paginate.onClick()

    this.setState({offset: offset}, () => {
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
          <h2 className="p-result__title">
            Search Results
            <span className="p-result__filters-opener" onClick={(e) => this.toggleFiltersBlock(e)}>[option]</span>
          </h2>
          <ResultOrdering handleOrderingChange={(options) => this.handleOptionsChange(options)} />
        </div>
        <ReactCSSTransitionGroup
          transitionName="slide"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}>
          {this.state.filtersAreHidden?
            null : <ResultFilters handleFiltersChange={(options) => this.handleOptionsChange(options)}
                                  categories={this.state.categories}
                                  defaults={{
                                    search: this.state.query.search,
                                    category: this.state.query.category,
                                    min_price: this.state.query.min_price,
                                    max_price: this.state.query.max_price,
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
