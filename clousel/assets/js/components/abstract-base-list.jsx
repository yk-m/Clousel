import React from 'react'

import { fetch, failure } from 'utils/ajax'
import { flippable } from 'components/mixins'
import Loader from 'components/loader'
import ErrorReporter from 'components/error-reporter'


export default class AbstractBaseList extends React.Component {

  static LIMIT =  12
  static ITEMS_NOT_FOUND = gettext("Items not found.")

  constructor(props) {
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
      item_refresh: () => this.fetch_items()
    }
  }

  getListComponent(data) {}

  buildQueryForFetching() {
    return {
      limit: this.props.limit
    }
  }

  fetch_items() {
    this.setStateOfLoading()

    fetch(
      this.props.items_fetch_url,
      this.buildQueryForFetching(),
      (res) => {
        if (!res.body.results[0]) {
          this.setStateOfError(AbstractBaseList.ITEMS_NOT_FOUND)
          return
        }

        this.setState({
          data: res.body.results,
          page_num: Math.ceil(res.body.count / this.props.limit),
          loading_is_hidden: true,
        })
      },
      (res) => failure(this.props.items_fetch_url, res)
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
    this.fetch_items()
  }

  componentWillReceiveProps(next_props) {
    this.setState({}, () => {
      this.fetch_items()
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