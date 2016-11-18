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
  }

  return Flippable
}


export function searchable(base = null) {

  class Searchable extends base {

    get filters() {
      return {
        search: this.props.location.query.search,
        category: this.props.location.query.category,
        min_price: this.props.location.query.min_price,
        max_price: this.props.location.query.max_price
      }
    }

    get ordering() {
      return this.props.location.query.ordering
    }
  }

  return Searchable
}