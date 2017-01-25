import React from 'react'

import { post, del, failure } from 'utils/ajax'
import Item from 'components/item/item'


export default class Items extends React.Component {

  constructor(props) {
    super(props)

    let items = null
    if (this.props.data[0] && this.props.data[0].item)
      items = this.props.data.map((item) => { return item.item })

    this.state = {
      items: items || this.props.data
    }
  }

  get_like_url(pk) {
    return `/api/items/${pk}/like/`
  }

  get_purchase_url(pk) {
    return `/api/items/${pk}/purchase/`
  }

  update_item(pk, field, value) {
    return this.state.items.map((item) => {
      if (item.pk !== pk)
        return item
      item[field] = value
      return item
    })
  }

  post_like(pk) {
    post(
      this.get_like_url(pk), {},
      (res) => {
        this.setState({items: this.update_item(pk, 'is_liked', true)})
      },
      (res) => failure(this.get_like_url(pk), res)
    )
  }

  delete_like(pk) {
    del(
      this.get_like_url(pk),
      (res) => {
        this.setState({items: this.update_item(pk, 'is_liked', false)})
      },
      (res) => failure(this.get_like_url(pk), res)
    )
  }

  post_purchase(pk) {
    post(
      this.get_purchase_url(pk), {},
      (res) => {
        this.setState({items: this.update_item(pk, 'is_purchased', true)})
      },
      (res) => failure(this.get_purchase_url(pk), res)
    )
  }

  delete_purchase(pk) {
    del(
      this.get_purchase_url(pk),
      (res) => {
        this.setState({items: this.update_item(pk, 'is_purchased', false)})
      },
      (res) => failure(this.get_purchase_url(pk), res)
    )
  }

  onClickLikeButton = (pk, is_liked) => {
    if (is_liked)
      this.delete_like(pk)
    else
      this.post_like(pk)
  }

  onClickPurchaseButton = (pk, is_purchased) => {
    if (is_purchased)
      this.delete_purchase(pk)
    else
      this.post_purchase(pk)
  }

  render() {
    let itemNodes = this.state.items.map((item) => {
      return (
        <Item key={item.pk} item={item}
              onClickLikeButton={this.onClickLikeButton}
              onClickPurchaseButton={this.onClickPurchaseButton}
        />
      )
    })
    return (
      <div className="p-items">
        { itemNodes }
      </div>
    )
  }
}

Items.propTypes = {
  data: React.PropTypes.array.isRequired
}