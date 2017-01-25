import React from 'react'


export default class Item extends React.Component {

  static MESSAGES = {
    LIKE: gettext("I like this item."),
    PURCHASE: gettext("I have this item."),
  }

  onClickLikeButton = (e) => {
    e.preventDefault()
    this.props.onClickLikeButton(this.props.item.pk,
                                 this.props.item.is_liked)
  }

  onClickPurchaseButton = (e) => {
    e.preventDefault()
    this.props.onClickPurchaseButton(this.props.item.pk,
                                     this.props.item.is_purchased)
  }

  get image_class() {
    if (this.props.orientation === "square")
      return "p-image"
    return "p-image--" + this.props.item.orientation
  }

  get like_class() {
    if (!this.props.item.is_liked)
      return "p-item__like"
    return "p-item__like--is_liked"
  }

  get purchase_class() {
    if (!this.props.item.is_purchased)
      return "p-item__purchase"
    return "p-item__like--is_purchased"
  }

  render() {
    return (
      <div className="p-item">
        <a href={`/shop/${this.props.item.pk}/`}>
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
            <a href="#" onClick={this.onClickLikeButton}
                        title={Item.MESSAGES.LIKE}></a>
          </li>
          <li className={this.purchase_class}>
            <a href="#" onClick={this.onClickPurchaseButton}
                        title={Item.MESSAGES.PURCHASE}></a>
          </li>
        </ul>
      </div>
    )
  }
}

Item.propTypes = {
  item: React.PropTypes.object.isRequired,
  onClickLikeButton: React.PropTypes.func.isRequired,
  onClickPurchaseButton: React.PropTypes.func.isRequired,
}
