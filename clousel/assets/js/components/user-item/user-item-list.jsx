import deepEqual from 'deep-equal'
import React from 'react'
import { withRouter } from 'react-router'

import fetch from '../fetch'
import Paginate from '../paginate'
import ErrorReporter from '../error-reporter'
import Loader from '../loader'
import ListBuilder from '../list-builder'
import UserItems from './user-items'
import { searchable } from '../mixins'


class UserItemList extends searchable(ListBuilder) {

  fetchItems() {
    let query = {
      limit: UserItemList.PAGINATE.per_page,
      offset: this.calcOffset(this.current_page, UserItemList.PAGINATE.per_page)
    }

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
          page_num: Math.ceil(res.body.count / UserItemList.PAGINATE.per_page),
          loading_is_hidden: true,
        })
      },
      (res) => {
        console.error(this.props.items_fetch_url, res.status, res.text)
      }
    )
  }

  componentWillReceiveProps(next_props) {
    if (!deepEqual(this.props.location, next_props.location)) {
      this.setState({}, () => {
        this.fetchItems()
      })
    }
  }

  handlePaginationClick(data) {
    this.props.router.push({
      pathname: '/',
      query: {
        page: data.selected + 1
      }
    })
  }

  render() {
    let items = null, paginate = null
    if (!this.state.loading_is_hidden) {
      items = <Loader />
    } else if (this.state.has_occurred_error) {
      items =  <ErrorReporter message={this.state.error_message} />
    } else if (this.state.data !== null && this.state.data !== []) {
      items = <UserItems data={this.state.data} />
      paginate = <Paginate page_num={this.state.page_num}
                           current_page={this.current_page}
                           margin_pages_displayed={UserItemList.PAGINATE.margin_pages_displayed}
                           page_range_displayed={UserItemList.PAGINATE.page_range_displayed}
                           handlePaginationClick={(data) => this.handlePaginationClick(data)} />
    }

    return (
      <div className="p-item-list">
        { items }
        { paginate }
      </div>
    )
  }
}

UserItemList.propTypes = {
  items_fetch_url: React.PropTypes.string.isRequired
}

export default withRouter(UserItemList)
