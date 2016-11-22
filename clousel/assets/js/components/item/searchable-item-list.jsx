import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { withRouter } from 'react-router'

import Category from '../../category'
import { ItemListWithoutRouter } from './item-list'
import SearchFilters from '../search/search-filters'
import SearchOrdering from '../search/search-ordering'
import { sortable, searchable } from '../mixins'


export class SearchableItemListWithoutRouter extends searchable(sortable(ItemListWithoutRouter)) {

  constructor(props) {
    super(props)

    this.state = {
      filters_are_hidden: true,
      categories: null
    }
  }

  buildQueryForFetching() {
    let query = this.filters
    query.ordering = this.ordering
    query.limit = SearchableItemListWithoutRouter.PAGINATE.per_page
    query.offset = this.offset
    return query
  }

  get base_query() {
    let query = this.filters
    query.ordering = this.ordering
    return query
  }

  componentDidMount() {
    super.componentDidMount()
    Category.fetch(
      (categories) => this.setState({categories: categories}),
      (res) => console.log(res)
    )
  }

  updateFilters(filters) {
    let base_query = filters
    base_query.ordering = this.ordering

    this.jumpTo(1, base_query)
  }

  updateOrdering(ordering) {
    let base_query = this.filters
    base_query.ordering = ordering

    this.jumpTo(1, base_query)
  }

  handleFiltersToggleEvent() {
    this.setState({filters_are_hidden: !this.state.filters_are_hidden})
  }

  render() {
    return (
      <section className="p-showcase" >
        <div className="p-showcase__header">
          <h2 className="p-showcase__title">
            Search Results
            <span className="p-showcase__filters-opener" onClick={(e) => this.handleFiltersToggleEvent(e)}>[option]</span>
          </h2>
          <SearchOrdering handleOrderingChange={(ordering) => this.updateOrdering(ordering)}
                          default={this.ordering}/>
        </div>
        <ReactCSSTransitionGroup transitionName="slide"
                                 transitionEnterTimeout={500}
                                 transitionLeaveTimeout={500}>
          {
            this.state.filters_are_hidden
            ? null : <SearchFilters handleFiltersChange={(filters) => this.updateFilters(filters)}
                                    categories={this.state.categories}
                                    defaults={this.filters} />
          }
        </ReactCSSTransitionGroup>
        {super.render()}
      </section>
    )
  }
}

export default withRouter(SearchableItemListWithoutRouter)

