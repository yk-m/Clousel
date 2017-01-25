import React from 'react'

import AbstractBaseList from 'components/abstract-base-list'
import Items from 'components/item/items'


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
