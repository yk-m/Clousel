import React from 'react'


export default class UserItem extends React.Component {

  static MESSAGES = {
    PURCHASE: gettext("This one is mine."),
    DELETE: gettext("Delete this item.")
  }

  onClickPurchaseButton = (e) => {
    e.preventDefault()
    this.props.onClickPurchaseButton(this.props.item.pk)
  }

  onClickDeleteButton = (e) => {
    e.preventDefault()
    this.props.onClickDeleteButton(this.props.item.pk)
  }

  get image_class() {
    if (this.props.orientation === "square")
      return "p-image"
    return "p-image--" + this.props.item.orientation
  }

  get purchase_class() {
    if (!this.props.item.has_bought)
      return "p-item__purchase"
    return "p-item__like--is_purchased"
  }

  render() {
    return (
      <div className="p-item">
        <a href={`/wardrobe/${this.props.item.pk}/` }>
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
            <a href="#" onClick={this.onClickPurchaseButton}
                        title={UserItem.MESSAGES.PURCHASE}></a>
          </li>
          <li className="p-item__delete">
            <a href="#" onClick={this.onClickDeleteButton}
                        title={UserItem.MESSAGES.DELETE}></a>
          </li>
        </ul>
      </div>
    )
  }
}

UserItem.propTypes = {
  item: React.PropTypes.object.isRequired,
  onClickPurchaseButton: React.PropTypes.func.isRequired,
  onClickDeleteButton: React.PropTypes.func.isRequired,
}