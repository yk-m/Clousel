import React from 'react'
import ReactDOM from 'react-dom'
import 'superagent-django-csrf'

import ListBuilder from './components/user-item-list-builder'


let resultContainer = document.getElementById('js-result')
let url = resultContainer.getAttribute('data-request-url')

ReactDOM.render(
  <ListBuilder
    items_fetch_url={url}
    paginate={{
      per_page: 12,
      margin_pages_displayed: 1,
      page_range_displayed: 3
    }}
  />, resultContainer
)