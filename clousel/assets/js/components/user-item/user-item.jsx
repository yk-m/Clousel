import React from 'react'

import Modal from '../modal'
import UserItemDetail from './user-item-detail'


export default class UserItem extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      is_hidden_details: true,
      is_purchased: this.props.item.has_bought === "true"
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

  onClickPurchaseButton(e) {
    e.preventDefault()
    this.setState({is_purchased: !this.state.is_purchased})
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
        <a href="#" onClick={(e) => this.onClickImage(e)}>
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
        </ul>
        <Modal is_hidden_modal={this.state.is_hidden_details}
               onClickCloseButton={() => this.closeModal()}>
          <UserItemDetail item={this.props.item}/>
        </Modal>
      </div>
    )
  }
}

UserItem.propTypes = {
  item: React.PropTypes.object.isRequired
}