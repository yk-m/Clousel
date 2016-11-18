import React from 'react'


export default class UserItemDetail extends React.Component {

  render() {
    return (
      <div className="p-item-detail">
        <div className="p-item-detail__image">
          <img src={this.props.item.image} />
        </div>
        <div className="p-item-detail__content">
          <table className="p-item-detail__table">
            <caption>Item Details</caption>
            <tbody>
              <tr>
                <th>タイトル</th>
                <td>{this.props.item.title}</td>
              </tr>
              <tr>
                <th>カテゴリー</th>
                <td>{this.props.item.category}</td>
              </tr>
            </tbody>
          </table>
          <ul>
            <li><a href={"/shop/similar/" + this.props.item.pk + "/"} title="この服に似ているアイテムを探す">この服に似ているアイテムを探す</a></li>
            <li><a href={"/shop/suitable/" + this.props.item.pk + "/"} title="この服に似合うアイテムを探す">この服に似合うアイテムを探す</a></li>
          </ul>
        </div>
      </div>
    )
  }
}

UserItemDetail.propTypes = {
  item: React.PropTypes.object.isRequired
}