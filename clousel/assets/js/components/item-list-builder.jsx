import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Request from 'superagent'

import ListBuilder from './list-builder'
import ItemList from './item/item-list'
import SearchFilters from './search/search-filters'
import SearchOrdering from './search/search-ordering'


export default class ItemListBuilder extends ListBuilder {

  constructor(props) {
    super(props)

    console.log(this.state)

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
        console.error(this.props.categories_fetch_url, status, err.toString())
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

  render() {
    return (
      <section className="p-result" >
        <div className="p-result__header">
          <h2 className="p-result__title">
            Search Searchs
            <span className="p-result__filters-opener" onClick={(e) => this.handleFiltersToggleEvent(e)}>[option]</span>
          </h2>
          <SearchOrdering handleOrderingChange={(ordering) => this.handleChangeOrdering(ordering)}
                          default={this.state.ordering}/>
        </div>
        <ReactCSSTransitionGroup
          transitionName="slide"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}>
          {this.state.filters_are_hidden?
            null : <SearchFilters handleFiltersChange={(filters) => this.handleChangeFilters(filters)}
                                  categories={this.state.categories}
                                  defaults={this.state.filters}
                                  /> }
        </ReactCSSTransitionGroup>
        <ItemList
          data={this.state.data}
          loading_is_hidden={this.state.loading_is_hidden}
          has_occurred_error={this.state.has_occurred_error}
          error_message={this.state.error_message}
          page_num={this.state.page_num}
          handleChangeOffset={(e) => this.handleChangeOffset(e)}
          paginate={{
            margin_pages_displayed: this.props.paginate.margin_pages_displayed,
            page_range_displayed: this.props.paginate.page_range_displayed
          }}
        />
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
