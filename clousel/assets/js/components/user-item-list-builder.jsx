import React from 'react'
import Request from 'superagent'

import ListBuilder from './list-builder'
import UserItemList from './user-item/user-item-list'


export default class UserItemListBuilder extends ListBuilder {

  fetchItems() {
    let query = {
      limit: this.props.paginate.per_page,
      offset: this.state.offset
    }

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
        console.error(this.props.items_fetch_url, res.status, res.text)
      }
    )
  }

  render() {
    return (
      <section className="p-showcase" >
        <UserItemList
          data={this.state.data}
          loading_is_hidden={this.state.loading_is_hidden}
          has_occurred_error={this.state.has_occurred_error}
          error_message={this.state.error_message}
          page_num={this.state.page_num}
          handleChangeOffset={(e) => this.handleChangeOffset(e)}
          paginate={this.props.paginate}
        />
      </section>
    )
  }
}

UserItemListBuilder.propTypes = {
  items_fetch_url: React.PropTypes.string.isRequired,
  paginate: React.PropTypes.shape({
    per_page: React.PropTypes.number.isRequired,
    margin_pages_displayed: React.PropTypes.number.isRequired,
    page_range_displayed:React.PropTypes.number.isRequired
  })
}
