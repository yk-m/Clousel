import React from 'react'
import { withRouter } from 'react-router'

import AbstractBaseList from '../abstract-base-list'
import UserItems from './user-items'


export default class UserItemHeadline extends AbstractBaseList {

  static LIMIT = 4

  getListComponent(data) {
    return <UserItems data={data} />
  }

  buildQueryForFetching() {
    return {
      limit: this.props.limit,
      ordering: "-updated"
    }
  }
}

UserItemHeadline.defaultProps = {
  limit: UserItemHeadline.LIMIT
}
