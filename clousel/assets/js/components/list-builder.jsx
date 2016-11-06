import React from 'react'
import Request from 'superagent'


export default class ListBuilder extends React.Component {

  constructor(props) {
    if (new.target === ListBuilder) {
      throw new TypeError("Cannot construct Abstract instances directly");
    }

    super(props)

    this.state = {
      data: [],
      offset: 0,
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

  // fetch(url, query, success, failure) {
  //   Request
  //     .get(url)
  //     .query(query)
  //     .set('Accept', 'application/json')
  //     .end( (err, res) => {
  //       if (!res.ok) {
  //         failure(res)
  //         return
  //       }
  //       success(res)
  //     })
  // }

  componentDidMount() {
    this.fetchItems()
  }

  calcOffset(page_num, per_page) {
    return Math.ceil(page_num * per_page)
  }

  handleChangeOffset(offset) {
    window.scrollTo(0,0)

    this.setState({offset: offset}, () => {
      this.fetchItems()
    })
  }

  fetchItems() {}

  render() {}
}
