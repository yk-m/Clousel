import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import ItemDetail from './item-detail'


export default class Item extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      is_hidden_details: true
    }
  }

  onClickOpen(e) {
    e.preventDefault()

    document.body.classList.add("u-overflow-hidden")
    this.setState({is_hidden_details: false})
  }

  onClickClose(e) {
    e.preventDefault()

    document.body.classList.remove("u-overflow-hidden")
    this.setState({is_hidden_details: true})
  }

  render() {
    let image_class = "p-image "
    if (this.props.item.orientation !== "square")
      image_class += "p-image--" + this.props.item.orientation
    return (
      <div className="p-item">
        <a href="#" onClick={(e) => this.onClickOpen(e)}>
          <div className="p-item__image">
            <div className="p-image-box">
              <img className={image_class} src={this.props.item.image} />
            </div>
          </div>
          <div className="p-item__caption">
            <p className="p-item__price">¥{this.props.item.price}</p>
            <dl>
              <dt>category</dt>
              <dd>{this.props.item.category}</dd>
            </dl>
          </div>
        </a>
        <ReactCSSTransitionGroup transitionName="fade"
                                 transitionEnterTimeout={200}
                                 transitionLeaveTimeout={200}>
          {
            this.state.is_hidden_details
            ? null
            : <div className="c-modal">
                <a className="c-modal__close" onClick={(e) => this.onClickClose(e)}></a>
                <div className="c-modal__container" onClick={(e) => this.onClickClose(e)}>
                  <ItemDetail item={this.props.item}/>
                </div>
              </div>
          }
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}

Item.propTypes = {
  item: React.PropTypes.object.isRequired
}