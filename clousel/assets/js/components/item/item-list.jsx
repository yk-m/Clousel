import deepEqual from 'deep-equal'
import React from 'react'
import { withRouter } from 'react-router'

import fetch from '../fetch'
import Loader from '../loader'
import Paginate from '../paginate'
import ErrorReporter from '../error-reporter'
import ListBuilder from '../list-builder'
import Items from './items'


class ItemList extends ListBuilder {

  get current_page() {
    return (this.props.location.query.page || 1)
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

  fetchItems() {
    let query = this.filters
    query.ordering = this.ordering
    query.limit = ItemList.PAGINATE.per_page
    query.offset = this.calcOffset(this.current_page, ItemList.PAGINATE.per_page)

    this.setStateOfLoading()

    fetch(
      this.props.items_fetch_url,
      query,
      (res) => {
        if (!res.body.results[0]) {
          this.setStateOfError("アイテムが見つかりませんでした．")
          return
        }

        this.setState({
          data: res.body.results,
          page_num: Math.ceil(res.body.count / ItemList.PAGINATE.per_page),
          loading_is_hidden: true,
        })
      },
      (res) => {
        console.error(this.props.items_fetch_url, res.status, res.text)
      }
    )
  }

  componentWillReceiveProps(next_props) {
    if (deepEqual(this.props.location, next_props.location))
      return

    this.setState({}, () => {
      this.fetchItems()
    })
  }

  handlePaginationClick(data) {
    let query = this.filters
    query.ordering = this.ordering
    query.page = data.selected + 1

    this.props.router.push({
      pathname: '/',
      query: query
    })
  }

  render() {
    let items = null, paginate = null
    if (!this.state.loading_is_hidden) {
      items = <Loader />
    } else if (this.state.has_occurred_error) {
      items =  <ErrorReporter message={this.state.error_message} />
    } else if (this.state.data !== null && this.state.data !== []) {
      items = <Items data={this.state.data} />
      paginate = <Paginate page_num={this.state.page_num}
                           current_page={this.current_page}
                           margin_pages_displayed={ItemList.PAGINATE.margin_pages_displayed}
                           page_range_displayed={ItemList.PAGINATE.page_range_displayed}
                           handlePaginationClick={(data) => this.handlePaginationClick(data)} />
    }

    return (
      <div className="p-item-list">
        {items}
        {paginate}
      </div>
    )
  }
}

ItemList.propTypes = {
  items_fetch_url: React.PropTypes.string.isRequired
}

export default withRouter(ItemList)
