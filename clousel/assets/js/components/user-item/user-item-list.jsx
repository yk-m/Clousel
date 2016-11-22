import React from 'react'
import { withRouter } from 'react-router'

import AbstractBaseFlippableList from '../abstract-base-flippable-list'
import UserItems from './user-items'


export class UserItemListWithoutRouter extends AbstractBaseFlippableList {

  getListComponent(data) {
    return <UserItems data={data} />
  }
}

export default withRouter(UserItemListWithoutRouter)

