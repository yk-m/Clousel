import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'


export default class Modal extends React.Component {

  onClickCloseButton(e) {
    e.preventDefault()
    this.props.onClickCloseButton()
  }

  render() {
    if (this.props.is_hidden_modal)
      document.body.classList.remove("u-overflow-hidden")
    else
      document.body.classList.add("u-overflow-hidden")

    return (
      <ReactCSSTransitionGroup transitionName="fade"
                               transitionEnterTimeout={200}
                               transitionLeaveTimeout={200}>
        {
          this.props.is_hidden_modal
          ? null
          : <div className="c-modal">
              <a className="c-modal__close" onClick={(e) => this.onClickCloseButton(e)}></a>
              <div className="c-modal__container" onClick={(e) => this.onClickCloseButton(e)}>
                {this.props.children}
              </div>
            </div>
        }
      </ReactCSSTransitionGroup>
    )
  }
}

Modal.propTypes = {
  is_hidden_modal: React.PropTypes.bool.isRequired,
  onClickCloseButton: React.PropTypes.func
}