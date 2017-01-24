import React from 'react'

import { patch, del } from 'utils/ajax'
import UserItem from 'components/user-item/user-item'


export default class UserItems extends React.Component {

  static MESSAGES = {
    CONFIRM: gettext("Are you sure you want to delete this item?"),
    YES: gettext("Yes"),
    NO: gettext("No"),
    CLOSE: gettext("Close")
  }

  constructor(props) {
    super(props)

    this.state = {
      items: this.props.data,
      modal_pk: null,
      is_modal_open: false
    }
  }

  get_item_url(pk) {
    return `/api/wardrobe/${pk}/`
  }

  patch_purchase(pk) {
    patch(
      this.get_item_url(pk),
      {
        has_bought: !this.state.items.find((item) => item.pk === pk).has_bought
      },
      (res) => {
        this.setState({items: this.state.items.map((item) => {
          if (item.pk !== pk)
            return item
          item.has_bought = !item.has_bought
          return item
        })})
      },
      (res) => {
        console.error(this.get_item_url(pk), res.status, res.text)
      }
    )
  }

  delete_item(pk) {
    del(
      this.get_item_url(pk),
      (res) => {
        this.context.item_refresh()
      },
      (res) => {
        console.error(this.get_item_url(pk), res.status, res.text)
      }
    )
  }

  open_modal(pk) {
    this.setState({is_modal_open: true, modal_pk: pk})
  }

  close_modal() {
    this.setState({is_modal_open: false, modal_pk: null})
  }

  onClickDeleteButton = (e, pk) => {
    e.preventDefault()
    this.delete_item(pk)
  }

  onClickCloseModal = (e) => {
    e.preventDefault()
    this.close_modal()
  }

  get modal_class() {
    if (!this.state.is_modal_open)
      return "c-modal"
    return "c-modal c-modal--open"
  }

  render() {
    const item_nodes = this.state.items.map( (item) => {
      return (
        <UserItem
          key={item.pk}
          item={item}
          onClickPurchaseButton={(pk) => this.patch_purchase(pk)}
          onClickDeleteButton={(pk) => this.open_modal(pk)}
        />
      )
    })
    return (
      <div className="p-items">
        {item_nodes}

        <div className={this.modal_class}>
          <div className="c-modal__content">
            <div className="p-confirm">
              <div className="p-confirm__header">
                <div className="p-confirm__close">
                  <a href="" onClick={this.onClickCloseModal} title={UserItems.MESSAGES.CLOSE}>
                    {UserItems.MESSAGES.CLOSE}<i className="p-confirm__close-icon"></i>
                  </a>
                </div>
              </div>
              <div className="p-confirm__content">
                {UserItems.MESSAGES.CONFIRM}
                <ul className="p-confirm__buttons">
                  <li className="p-confirm__no">
                    <a href="" onClick={this.onClickCloseModal} title={UserItems.MESSAGES.NO}>
                      {UserItems.MESSAGES.NO}
                    </a>
                  </li>
                  <li className="p-confirm__yes">
                    <a href="" onClick={(e) => this.onClickDeleteButton(e, this.state.modal_pk)} title={UserItems.MESSAGES.YES}>
                      {UserItems.MESSAGES.YES}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="c-modal__overlay" onClick={this.onClickCloseModal}></div>
      </div>
    )
  }
}

UserItems.propTypes = {
  data: React.PropTypes.array.isRequired
}

UserItems.contextTypes = {
  item_refresh: React.PropTypes.func
}