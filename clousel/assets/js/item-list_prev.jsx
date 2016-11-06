import React from 'react'
import ReactDOM from 'react-dom'
import 'superagent-django-csrf'

import ItemSearch from './components/item-search'


let resultContainer = document.getElementById('js-result')
let url = resultContainer.getAttribute('data-request-url')

ReactDOM.render(
  <ItemSearch
    items_fetch_url={url}
    categories_fetch_url="/api/categories/"
    paginate={{
      per_page: 12,
      margin_pages_displayed: 1,
      page_range_displayed: 3
    }}
  />, resultContainer
)