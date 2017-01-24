import React from 'react'
import { withRouter } from 'react-router'

import AbstractBaseFlippableList from 'components/abstract-base-flippable-list'
import Items from 'components/item/items'


export class ItemListWithoutRouter extends AbstractBaseFlippableList {

  getListComponent(data) {
    return <Items data={data} />
  }
}

export default withRouter(ItemListWithoutRouter)

