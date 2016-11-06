import React from 'react'
import Request from 'superagent'


export default class ListBuilder extends React.Component {

  static PAGINATE = {
    per_page: 12,
    margin_pages_displayed: 1,
    page_range_displayed: 3
  }

  constructor(props) {
    if (new.target === ListBuilder) {
      throw new TypeError("Cannot construct Abstract instances directly");
    }

    super(props)

    this.state = {
      data: [],
      loading_is_hidden: false,
      has_occurred_error: false,
      error_message: ""
    }
  }

  setStateOfLoading() {
    this.setState({
      data: [],
      loading_is_hidden: false,
      has_occurred_error: false,
      error_message: "",
    })
  }

  setStateOfError(message) {
    this.setState({
      data: [],
      loading_is_hidden: true,
      has_occurred_error: true,
      error_message: message
    })
  }

  componentDidMount() {
    this.fetchItems()
  }

  calcOffset(page_num, per_page) {
    return Math.ceil(page_num * per_page)
  }

  fetchItems() {}

  render() {}
}
