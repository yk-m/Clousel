import React from 'react'
import { withRouter } from 'react-router'

import AbstractBaseFlippableList from '../abstract-base-flippable-list'
import Items from './items'


export class ItemListWithoutRouter extends AbstractBaseFlippableList {

  getListComponent(data) {
    return <Items data={data} />
  }
}

export default withRouter(ItemListWithoutRouter)

