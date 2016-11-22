import React from 'react'

import { post, del } from '../../ajax'


export default class Item extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      is_liked: this.props.item.is_liked,
      is_purchased: this.props.item.is_purchased
    }
  }

  get like_url() {
    return "/api/items/" + this.props.item.pk + "/like/"
  }

  get purchase_url() {
    return "/api/items/" + this.props.item.pk + "/purchase/"
  }

  post_like() {
    post(
      this.like_url, {},
      (res) => {
        this.setState({is_liked: true})
      }
    )
  }

  delete_like() {
    del(
      this.like_url,
      (res) => {
        this.setState({is_liked: false})
      }
    )
  }

  post_purchase() {
    post(
      this.purchase_url, {},
      (res) => {
        this.setState({is_purchased: true})
      }
    )
  }

  delete_purchase() {
    del(
      this.purchase_url,
      (res) => {
        this.setState({is_purchased: false})
      }
    )
  }

  onClickLikeButton(e) {
    e.preventDefault()
    if (this.state.is_liked)
      this.delete_like()
    else
      this.post_like()
  }

  onClickPurchaseButton(e) {
    e.preventDefault()
    if (this.state.is_purchased)
      this.delete_purchase()
    else
      this.post_purchase()
  }

  get image_class() {
    if (this.props.orientation === "square")
      return "p-image"
    return "p-image--" + this.props.item.orientation
  }

  get like_class() {
    if (!this.state.is_liked)
      return "p-item__like"
    return "p-item__like--is_liked"
  }

  get purchase_class() {
    if (!this.state.is_purchased)
      return "p-item__purchase"
    return "p-item__like--is_purchased"
  }

  render() {
    return (
      <div className="p-item">
        <a href={"/shop/" + this.props.item.pk}>
          <div className="p-item__image">
            <div className="p-image-box">
              <img className={this.image_class} src={this.props.item.image} />
            </div>
          </div>
        </a>
        <ul className="p-item__caption">
          <li className="p-item__price">
            ¥{this.props.item.price}
          </li>
          <li className={this.like_class}>
            <a href="#" onClick={(e) => this.onClickLikeButton(e)} title="like"></a>
          </li>
          <li className={this.purchase_class}>
            <a href="#" onClick={(e) => this.onClickPurchaseButton(e)} title="purchase"></a>
          </li>
        </ul>
      </div>
    )
  }
}

Item.propTypes = {
  item: React.PropTypes.object.isRequired
}