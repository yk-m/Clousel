import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { withRouter } from 'react-router'

import Category from 'utils/category'
import { ItemListWithoutRouter } from 'components/item/item-list'
import SearchFilters from 'components/search/search-filters'
import SearchOrdering from 'components/search/search-ordering'


export class SearchableItemListWithoutRouter extends ItemListWithoutRouter {

  constructor(props) {
    super(props)

    this.state = {
      filters_are_hidden: true,
      categories: null
    }
  }

  get filters() {
    return {
      search: this.props.location.query.search,
      category: this.props.location.query.category,
      min_price: this.props.location.query.min_price,
      max_price: this.props.location.query.max_price
    }
  }

  get ordering() {
    return this.props.location.query.ordering
  }

  get base_query() {
    let query = this.filters
    query.ordering = this.ordering
    return query
  }

  buildQueryForFetching() {
    let query = this.filters
    query.ordering = this.ordering
    query.limit = SearchableItemListWithoutRouter.PAGINATE.per_page
    query.offset = this.offset
    return query
  }

  componentDidMount() {
    super.componentDidMount()
    Category.fetch(
      (categories) => this.setState({categories: categories}),
      (url, res) => console.error(url, res.status, res.text)
    )
  }

  updateFilters = (filters) => {
    let base_query = filters
    base_query.ordering = this.ordering

    this.jump_to(1, base_query)
  }

  updateOrdering = (ordering) => {
    let base_query = this.filters
    base_query.ordering = ordering

    this.jump_to(1, base_query)
  }

  handleFiltersToggleEvent = (e) => {
    this.setState({filters_are_hidden: !this.state.filters_are_hidden})
  }

  render() {
    return (
      <section className="p-showcase" >
        <div className="p-showcase__header">
          <h2 className="p-showcase__title">
            {this.props.page_title}
            <span className="p-showcase__filters-opener" onClick={this.handleFiltersToggleEvent}>[option]</span>
          </h2>
          <SearchOrdering handleOrderingChange={this.updateOrdering}
                          default={this.ordering}/>
        </div>
        <ReactCSSTransitionGroup transitionName="slide"
                                 transitionEnterTimeout={500}
                                 transitionLeaveTimeout={500}>
          {
            this.state.filters_are_hidden
            ? null : <SearchFilters handleFiltersChange={this.updateFilters}
                                    categories={this.state.categories}
                                    defaults={this.filters} />
          }
        </ReactCSSTransitionGroup>
        {super.render()}
      </section>
    )
  }
}

SearchableItemListWithoutRouter.propTypes = {
  page_title: React.PropTypes.string.isRequired
}

export default withRouter(SearchableItemListWithoutRouter)

