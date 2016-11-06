import React from 'react'

import Modal from '../modal'
import ItemDetail from './item-detail'


export default class Item extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      is_hidden_details: true,
      is_liked: this.props.item.is_liked === "true",
      is_purchased: this.props.item.is_purchased === "true"
    }
  }

  onClickImage(e) {
    e.preventDefault()
    this.openModal()
  }

  openModal() {
    this.setState({is_hidden_details: false})
  }

  closeModal() {
    this.setState({is_hidden_details: true})
  }

  onClickLikeButton(e) {
    e.preventDefault()
    this.setState({is_liked: !this.state.is_liked})
  }

  onClickPurchaseButton(e) {
    e.preventDefault()
    this.setState({is_purchased: !this.state.is_purchased})
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
        <Modal is_hidden_modal={this.state.is_hidden_details}
               onClickCloseButton={() => this.closeModal()}>
          <ItemDetail item={this.props.item}/>
        </Modal>
      </div>
    )
  }
}

Item.propTypes = {
  item: React.PropTypes.object.isRequired
}