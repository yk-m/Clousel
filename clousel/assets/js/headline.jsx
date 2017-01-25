import React from 'react'
import ReactDOM from 'react-dom'

import ItemHeadline from './components/item/item-headline'
import UserItemHeadline from './components/user-item/user-item-headline'


const item_container = document.getElementById('js-dashboard-item')
if (item_container !== null) {
  const url = item_container.getAttribute('data-request-url')
  ReactDOM.render((
    <ItemHeadline items_fetch_url={url} />
  ), item_container)
}

const user_item_container = document.getElementById('js-dashboard-user-item')
if (user_item_container !== null) {
  const url = user_item_container.getAttribute('data-request-url')
  ReactDOM.render((
    <UserItemHeadline items_fetch_url={url} />
  ), user_item_container)
}
