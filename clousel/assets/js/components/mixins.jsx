import React from 'react'


export function flippable(base = null) {

  class Flippable extends base {

    static PAGINATE = {
      per_page: 12,
      margin_pages_displayed: 1,
      page_range_displayed: 3
    }

    get current_page() {
      return (this.props.location.query.page || 1) - 1
    }

    get offset() {
      return Math.ceil(this.current_page * Flippable.PAGINATE.per_page)
    }
  }

  return Flippable
}
