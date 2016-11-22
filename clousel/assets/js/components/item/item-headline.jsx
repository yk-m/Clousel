import React from 'react'

import AbstractBaseList from '../abstract-base-list'
import Items from './items'


export default class ItemHeadline extends AbstractBaseList {

  static LIMIT = 4

  getListComponent(data) {
    return <Items data={data} />
  }

  buildQueryForFetching() {
    return {
      limit: this.props.limit,
      ordering: "-updated"
    }
  }
}

ItemHeadline.defaultProps = {
  limit: ItemHeadline.LIMIT
}
