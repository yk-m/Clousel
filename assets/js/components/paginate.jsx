import React from 'react'

import ReactPaginate from 'react-paginate'


export default class Paginate extends React.Component {

  render() {
    return (
        <ReactPaginate previousLabel={"previous"}
                       nextLabel={"next"}
                       breakLabel={"..."}
                       breakClassName={"c-pagination__child--break-me"}
                       pageNum={this.props.page_num}
                       forceSelected={this.props.current_page}
                       marginPagesDisplayed={this.props.margin_pages_displayed}
                       pageRangeDisplayed={this.props.page_range_displayed}
                       clickCallback={this.props.handlePaginationClick}
                       containerClassName={"c-pagination"}
                       previousClassName={"c-pagination__child--to_prev"}
                       nextClassName={"c-pagination__child--to_next"}
                       previousLinkClassName={"c-pagination__ctrl--to_prev"}
                       nextLinkClassName={"c-pagination__ctrl--to_next"}
                       activeClassName={"c-pagination__child--is_active"}
                       disabledClassName={"c-pagination__child--is_disabled"} />
    )
  }
}

Paginate.propTypes = {
  page_num: React.PropTypes.number.isRequired,
  current_page: React.PropTypes.number.isRequired,
  margin_pages_displayed: React.PropTypes.number.isRequired,
  page_range_displayed: React.PropTypes.number.isRequired,
  handlePaginationClick: React.PropTypes.func.isRequired
}
