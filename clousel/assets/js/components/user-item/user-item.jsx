import React from 'react'

import { patch, del } from '../../ajax'


export default class UserItem extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      is_purchased: this.props.item.has_bought
    }
  }

  get item_url() {
    return "/api/wardrobe/" + this.props.item.pk + "/"
  }

  patch_purchase() {
    patch(
      this.item_url,
      {
        has_bought: !this.state.is_purchased
      },
      (res) => {
        this.setState({is_purchased: !this.state.is_purchased})
      },
      (res) => {
        console.error(this.props.items_fetch_url, res.status, res.text)
      }
    )
  }

  delete_item() {
    del(
      this.item_url,
      (res) => {
        this.context.item_refresh()
      },
      (res) => {
        console.error(this.props.items_fetch_url, res.status, res.text)
      }
    )
  }

  onClickPurchaseButton(e) {
    e.preventDefault()
    this.patch_purchase()
  }

  onClickDeleteButton(e) {
    e.preventDefault()

    let result = confirm("このアイテムを削除しますか？")
    if (result)
      this.delete_item()
  }

  get image_class() {
    if (this.props.orientation === "square")
      return "p-image"
    return "p-image--" + this.props.item.orientation
  }

  get purchase_class() {
    if (!this.state.is_purchased)
      return "p-item__purchase"
    return "p-item__like--is_purchased"
  }

  render() {
    return (
      <div className="p-item">
        <a href={"/wardrobe/" + this.props.item.pk}>
          <div className="p-item__image">
            <div className="p-image-box">
              <img className={this.image_class} src={this.props.item.image} />
            </div>
          </div>
        </a>
        <ul className="p-item__caption">
          <li className="p-item__title">
            {this.props.item.title}
          </li>
          <li className={this.purchase_class}>
            <a href="#" onClick={(e) => this.onClickPurchaseButton(e)} title="purchase"></a>
          </li>
          <li className="p-item__delete">
            <a href="#" onClick={(e) => this.onClickDeleteButton(e)} title="delete"></a>
          </li>
        </ul>
      </div>
    )
  }
}

UserItem.propTypes = {
  item: React.PropTypes.object.isRequired
}

UserItem.contextTypes = {
  item_refresh: React.PropTypes.func
}