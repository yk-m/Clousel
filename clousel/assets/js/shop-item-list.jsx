import React from 'react'
import ReactDOM from 'react-dom'
import 'superagent-django-csrf'
import ItemList from './components/item/item-list'
// import SmoothScroll from 'smooth-scroll'

let listContainer = document.getElementById('item-list')

ReactDOM.render(
  <ItemList url="/api/items/" paginate={{
    perPage: 12,
    marginPagesDisplayed: 1,
    pageRangeDisplayed: 3,
    onClick: () => {
      // const options = { speed: 500, easing: 'easeInOutQuart' }
      // SmoothScroll.animateScroll(0, null, options)
      window.scrollTo(0,0)
    }
  }} />, listContainer
)