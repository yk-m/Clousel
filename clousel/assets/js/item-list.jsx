import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import 'superagent-django-csrf'

import ItemList from './components/item/searchable-item-list'


let resultContainer = document.getElementById('js-result')
let url = resultContainer.getAttribute('data-request-url')

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={() => <ItemList items_fetch_url={url} />} />
  </Router>
), resultContainer)