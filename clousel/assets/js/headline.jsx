import React from 'react'
import ReactDOM from 'react-dom'
import 'superagent-django-csrf'

import ItemHeadline from './components/item/item-headline'
import UserItemHeadline from './components/user-item/user-item-headline'


let item_container = document.getElementById('js-item')
let item_url = item_container.getAttribute('data-request-url')

ReactDOM.render((
  <ItemHeadline items_fetch_url={item_url} />
), item_container)


let user_item_container = document.getElementById('js-user-item')
let user_item_url = user_item_container.getAttribute('data-request-url')

ReactDOM.render((
  <UserItemHeadline items_fetch_url={user_item_url} />
), user_item_container)