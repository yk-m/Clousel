import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Router from 'react-router'
import Request from 'superagent'

import Loader from './loader'
import Paginate from './paginate'
import ErrorReporter from './error-reporter'
import ListBuilder from './list-builder'
import Items from './item/items'
import SearchFilters from './search/search-filters'
import SearchOrdering from './search/search-ordering'


export default class ItemListBuilder extends ListBuilder {

  constructor(props) {
    super(props)

    this.state = Object.assign(this.state, {
      filters_are_hidden: true,
      categories: null,
      filters: this.props.default_filters,
      ordering: this.props.default_ordering
    })
  }

  fetchItems() {
    let query = this.state.filters
    query.ordering = this.state.ordering
    query.limit = this.props.paginate.per_page
    query.offset = this.state.offset

    this.setStateOfLoading()

    this.fetch(
      this.props.items_fetch_url,
      query,
      (res) => {
        if (!res.body.results[0]) {
          this.setStateOfError("アイテムが見つかりませんでした．")
          return
        }

        this.setState({
          data: res.body.results,
          offset: 0,
          page_num: Math.ceil(res.body.count / this.props.paginate.per_page),
          loading_is_hidden: true,
        })
      },
      (res) => {
        console.error(this.props.items_fetch_url, res.status, err.toString())
      }
    )
  }

  fetchCategories() {
    this.fetch(
      this.props.categories_fetch_url,
      {},
      (res) => {
        this.setState({
          categories: this.formatCategories(res.body)
        })
      },
      (res) => {
        console.error(this.props.items_fetch_url, res.status, res.text)
      }
    )
  }

  formatCategories(categories) {
    const indent = "--- "

    categories.unshift({pk: "", name: "---------", level: 0})
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
    super.componentDidMount()
    this.fetchCategories()
  }

  handleChangeFilters(filters) {
    this.setState({filters: filters}, () => {
      this.fetchItems()
    })
  }

  handleChangeOrdering(ordering) {
    this.setState({ordering: ordering}, () => {
      this.fetchItems()
    })
  }

  handleFiltersToggleEvent() {
    this.setState({filters_are_hidden: !this.state.filters_are_hidden})
  }

  handlePaginationClick(data) {
    let offset = Math.ceil(data.selected * this.props.paginate.per_page)
    this.handleChangeOffset(offset)
  }

  render() {
    let items = null
    if (!this.state.loading_is_hidden)
      items = <Loader />
    else if (this.state.has_occurred_error)
      items =  <ErrorReporter message={this.state.error_message} />
    else if (this.state.data !== null && this.state.data !== [])
      items = <Items data={this.state.data} />

    return (
      <section className="p-showcase" >
        <div className="p-showcase__header">
          <h2 className="p-showcase__title">
            Search Results
            <span className="p-showcase__filters-opener" onClick={(e) => this.handleFiltersToggleEvent(e)}>[option]</span>
          </h2>
          <SearchOrdering handleOrderingChange={(ordering) => this.handleChangeOrdering(ordering)}
                          default={this.state.ordering}/>
        </div>
        <ReactCSSTransitionGroup transitionName="slide"
                                 transitionEnterTimeout={500}
                                 transitionLeaveTimeout={500}>
          {
            this.state.filters_are_hidden
            ? null : <SearchFilters handleFiltersChange={(filters) => this.handleChangeFilters(filters)}
                                    categories={this.state.categories}
                                    defaults={this.state.filters} />
          }
        </ReactCSSTransitionGroup>
        <div className="p-item-list">
          {items}
        </div>
        <Paginate page_num={this.state.page_num}
                  margin_pages_displayed={this.props.paginate.margin_pages_displayed}
                  page_range_displayed={this.props.paginate.page_range_displayed}
                  handlePaginationClick={(data) => this.handlePaginationClick(data)} />
      </section>
    )
  }
}

ItemListBuilder.propTypes = {
  items_fetch_url: React.PropTypes.string.isRequired,
  categories_fetch_url: React.PropTypes.string.isRequired,
  paginate: React.PropTypes.shape({
    per_page: React.PropTypes.number.isRequired,
    margin_pages_displayed: React.PropTypes.number.isRequired,
    page_range_displayed:React.PropTypes.number.isRequired
  }),
  default_filters: React.PropTypes.shape({
    search: React.PropTypes.string,
    category: React.PropTypes.string,
    min_price: React.PropTypes.string,
    max_price: React.PropTypes.string
  }),
  default_ordering: React.PropTypes.string
}

ItemListBuilder.defaultProps = {
  default_filters: {
    search: "",
    category: "",
    min_price: "",
    max_price: ""
  },
  default_ordering: ""
}
