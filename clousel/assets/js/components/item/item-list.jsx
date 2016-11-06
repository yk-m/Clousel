import deepEqual from 'deep-equal'
import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Request from 'superagent'

import fetch from '../fetch'
import Loader from '../loader'
import Paginate from '../paginate'
import ErrorReporter from '../error-reporter'
import ListBuilder from '../list-builder'
import Items from './items'


export default class ItemList extends ListBuilder {

  constructor(props) {
    super(props)

    this.state.offset = this.calcOffset(this.props.current_page, this.props.paginate.per_page)
  }

  fetchItems() {
    let query = this.props.filters
    query.ordering = this.props.ordering
    query.limit = this.props.paginate.per_page
    query.offset = this.state.offset

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
          page_num: Math.ceil(res.body.count / this.props.paginate.per_page),
          loading_is_hidden: true,
        })
      },
      (res) => {
        console.error(this.props.items_fetch_url, res.status, err.toString())
      }
    )
  }

  componentWillReceiveProps(next_props) {
    if (!deepEqual(this.props.filters, next_props.filters)
         || this.props.ordering !== next_props.ordering
         || this.props.current_page !== next_props.current_page) {
      let offset = this.calcOffset(next_props.current_page, this.props.paginate.per_page)
      this.setState({offset: offset}, () => {
        this.fetchItems()
      })
    }
  }

  handlePaginationClick(data) {
    this.props.handleChangeCurrentPage(data.selected)
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
                           current_page={this.props.current_page}
                           margin_pages_displayed={this.props.paginate.margin_pages_displayed}
                           page_range_displayed={this.props.paginate.page_range_displayed}
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
  items_fetch_url: React.PropTypes.string.isRequired,
  current_page: React.PropTypes.number.isRequired,
  handleChangeCurrentPage: React.PropTypes.func.isRequired,
  paginate: React.PropTypes.shape({
    per_page: React.PropTypes.number.isRequired,
    margin_pages_displayed: React.PropTypes.number.isRequired,
    page_range_displayed: React.PropTypes.number.isRequired
  }),
  filters: React.PropTypes.shape({
    search: React.PropTypes.string,
    category: React.PropTypes.string,
    min_price: React.PropTypes.string,
    max_price: React.PropTypes.string
  }),
  ordering: React.PropTypes.string
}

ItemList.defaultProps = {
  filters: {
    search: "",
    category: "",
    min_price: "",
    max_price: ""
  },
  ordering: ""
}
