import React from 'react'
import ReactDOM from 'react-dom'
import 'superagent-django-csrf'

import Result from './components/result'


let resultContainer = document.getElementById('js-result')
let url = resultContainer.getAttribute('data-request-url')

ReactDOM.render(
  <Result
    url={url}
    paginate={{
      perPage: 12,
      marginPagesDisplayed: 1,
      pageRangeDisplayed: 3,
      onClick: () => {
        window.scrollTo(0,0)
      }
    }}
  />, resultContainer
)