import React from 'react'

import { fetch } from '../ajax'
import { flippable } from './mixins'
import Loader from './loader'
import ErrorReporter from './error-reporter'


export default class AbstractBaseList extends React.Component {

  static LIMIT =  12

  constructor(props) {
    if (new.target === AbstractBaseList) {
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

  getChildContext() {
    return {
      item_refresh: () => this.fetchItems()
    }
  }

  getListComponent(data) {}

  buildQueryForFetching() {
    return {
      limit: this.props.limit
    }
  }

  fetchItems() {
    this.setStateOfLoading()

    fetch(
      this.props.items_fetch_url,
      this.buildQueryForFetching(),
      (res) => {
        if (!res.body.results[0]) {
          this.setStateOfError("アイテムが見つかりませんでした．")
          return
        }

        this.setState({
          data: res.body.results,
          page_num: Math.ceil(res.body.count / this.props.limit),
          loading_is_hidden: true,
        })
      },
      (res) => {
        console.error(this.props.items_fetch_url, res.status, res.text)
      }
    )
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

  componentWillReceiveProps(next_props) {
    this.setState({}, () => {
      this.fetchItems()
    })
  }

  render() {
    let items = null, paginate = null
    if (!this.state.loading_is_hidden) {
      items = <Loader />
    } else if (this.state.has_occurred_error) {
      items =  <ErrorReporter message={this.state.error_message} />
    } else if (this.state.data !== null && this.state.data !== []) {
      items = this.getListComponent(this.state.data)
    }

    return (
      <div className="p-item-list">
        {items}
      </div>
    )
  }
}

AbstractBaseList.propTypes = {
  items_fetch_url: React.PropTypes.string.isRequired,
  limit: React.PropTypes.number.isRequired
}

AbstractBaseList.defaultProps = {
  limit: AbstractBaseList.LIMIT
}

AbstractBaseList.childContextTypes = {
  item_refresh: React.PropTypes.func
}