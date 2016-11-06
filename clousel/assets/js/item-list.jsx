import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import 'superagent-django-csrf'

import ItemSearch from './components/item-search'
import ItemList from './components/item/item-list'


let resultContainer = document.getElementById('js-result')
let url = resultContainer.getAttribute('data-request-url')


ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={ItemSearch}>
      <IndexRoute component={() => <ItemList items_fetch_url={url} />} />
    </Route>
  </Router>
), resultContainer)