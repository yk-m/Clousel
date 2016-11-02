import React from 'react'


export default class UserItem extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      is_purchased: this.props.item.has_bought === "true"
    }
  }

  onClickPurchaseButton(e) {
    e.preventDefault()
    this.setState({is_purchased: !this.state.is_purchased})
  }

  render() {
    let image_class = "p-image "
    if (this.props.orientation !== "square")
      image_class += "p-image--" + this.props.item.orientation

    let purchase_class = "p-item__purchase "
    if (this.state.is_purchased)
      purchase_class += "p-item__like--is_purchased"

    return (
      <div className="p-item">
        <a href="#">
          <div className="p-item__image">
            <div className="p-image-box">
              <img className={image_class} src={this.props.item.image} />
            </div>
          </div>
        </a>
        <ul className="p-item__caption">
          <li className="p-item__title">
            {this.props.item.title}
          </li>
          <li className="p-item__search">
            <a href="#" title="Search"></a>
          </li>
          <li className={purchase_class}>
            <a href="#" onClick={(e) => this.onClickPurchaseButton(e)} title="purchase"></a>
          </li>
        </ul>
      </div>
    )
  }
}

UserItem.propTypes = {
  item: React.PropTypes.object.isRequired
}