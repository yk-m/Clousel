import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'

import UserItemList from './components/user-item/user-item-list'


const container = document.getElementById('js-user-item')
if (container !== null) {
  const url = container.getAttribute('data-request-url')

  ReactDOM.render((
    <Router history={hashHistory}>
      <Route path="/" component={() => <UserItemList items_fetch_url={url} />} />
    </Router>
  ), container)
}