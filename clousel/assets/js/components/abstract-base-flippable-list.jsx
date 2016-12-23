import React from 'react'
import deepEqual from 'deep-equal'

import { flippable } from './mixins'
import Loader from './loader'
import Paginate from './paginate'
import ErrorReporter from './error-reporter'
import AbstractBaseList from './abstract-base-list'


export default class AbstractBaseFlippableList extends flippable(AbstractBaseList) {

  static LIMIT = AbstractBaseFlippableList.PAGINATE.per_page

  getListComponent(data) {}

  buildQueryForFetching() {
    return {
      limit: this.props.limit,
      offset: this.offset
    }
  }

  get base_query() {
    return {}
  }

  jumpTo(page, base_query) {
    let query = base_query || this.base_query
    query.page = page

    this.props.router.push({
      pathname: '/',
      query: query
    })
  }

  componentWillReceiveProps(next_props) {
    if (deepEqual(this.props.location, next_props.location))
      return

    super.componentWillReceiveProps(next_props)
  }

  render() {
    let items = null, paginate = null
    if (!this.state.loading_is_hidden) {
      items = <Loader />
    } else if (this.state.has_occurred_error) {
      items =  <ErrorReporter message={this.state.error_message} />
    } else if (this.state.data !== null && this.state.data !== []) {
      items = this.getListComponent(this.state.data)
      paginate = <Paginate page_num={this.state.page_num}
                           current_page={this.current_page}
                           margin_pages_displayed={AbstractBaseFlippableList.PAGINATE.margin_pages_displayed}
                           page_range_displayed={AbstractBaseFlippableList.PAGINATE.page_range_displayed}
                           handlePaginationClick={(page) => this.jumpTo(page)} />
    }

    return (
      <div className="p-item-list">
        {items}
        {paginate}
      </div>
    )
  }
}
