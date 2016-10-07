import React from 'react'
import ReactDOM from 'react-dom'
import 'superagent-django-csrf'

import Result from './components/result'


let resultContainer = document.getElementById('js-result')

ReactDOM.render(
  <Result
    url="/api/items/"
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