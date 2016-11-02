import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

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

  onClickItemImage(e) {
    e.preventDefault()

    document.body.classList.add("u-overflow-hidden")
    this.setState({is_hidden_details: false})
  }

  onModalClose() {
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

  render() {
    let image_class = "p-image "
    if (this.props.item.orientation !== "square")
      image_class += "p-image--" + this.props.item.orientation

    let like_class = "p-item__like "
    if (this.state.is_liked)
      like_class += "p-item__like--is_liked"
    let purchase_class = "p-item__purchase "
    if (this.state.is_purchased)
      purchase_class += "p-item__like--is_purchased"

    return (
      <div className="p-item">
        <a href="#" onClick={(e) => this.onClickItemImage(e)}>
          <div className="p-item__image">
            <div className="p-image-box">
              <img className={image_class} src={this.props.item.image} />
            </div>
          </div>
        </a>
        <ul className="p-item__caption">
          <li className="p-item__price">¥{this.props.item.price}</li>
          <li className={like_class}>
            <a href="#" onClick={(e) => this.onClickLikeButton(e)} title="like"></a>
          </li>
          <li className={purchase_class}>
            <a href="#" onClick={(e) => this.onClickPurchaseButton(e)} title="purchase"></a>
          </li>
        </ul>
        <Modal is_hidden_modal={this.state.is_hidden_details}
               onClickCloseButton={() => this.onModalClose()}>
          <ItemDetail item={this.props.item}/>
        </Modal>
      </div>
    )
  }
}

Item.propTypes = {
  item: React.PropTypes.object.isRequired
}