import React from 'react'

import Paginate from '../paginate'
import ErrorReporter from '../error-reporter'
import Loader from '../loader'
import UserItems from './user-items'


export default class UserItemList extends React.Component {

  handlePaginationClick(data) {
    let offset = Math.ceil(data.selected * this.props.paginate.per_page)
    this.props.handleChangeOffset(offset)
  }

  render() {
    let items

    if (!this.props.loading_is_hidden)
      items = <Loader />
    else if (this.props.has_occurred_error)
      items =  <ErrorReporter message={this.props.error_message} />
    else
      items = <UserItems data={this.props.data} />

    return (
      <div className="p-item-list">
        { items }
        <Paginate
          page_num={this.props.page_num}
          margin_pages_displayed={this.props.paginate.margin_pages_displayed}
          page_range_displayed={this.props.paginate.page_range_displayed}
          handlePaginationClick={(data) => this.props.handleChangeOffset(data)}
        />
      </div>
    )
  }
}

UserItemList.propTypes = {
  data: React.PropTypes.array.isRequired,
  loading_is_hidden: React.PropTypes.bool.isRequired,
  has_occurred_error: React.PropTypes.bool.isRequired,
  error_message: React.PropTypes.string.isRequired,
  page_num: React.PropTypes.number.isRequired,
  handleChangeOffset: React.PropTypes.func.isRequired,
  paginate: React.PropTypes.shape({
    margin_pages_displayed: React.PropTypes.number.isRequired,
    page_range_displayed:React.PropTypes.number.isRequired
  })
}
