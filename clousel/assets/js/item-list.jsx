import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'

import ItemList from './components/item/searchable-item-list'


const container = document.getElementById('js-item')
if (container !== null) {
  const url = container.getAttribute('data-request-url')
  const title = container.getAttribute('data-page-title')

  ReactDOM.render((
    <Router history={hashHistory}>
      <Route path="/" component={() => <ItemList items_fetch_url={url} page_title={title} />} />
    </Router>
  ), container)
}