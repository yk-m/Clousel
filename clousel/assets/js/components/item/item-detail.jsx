import React from 'react'


export default class ItemDetail extends React.Component {

  render() {
    let details = []
    for(var line of this.props.item.details.split("\n"))
      details.push(<p>{line}</p>)

    return (
      <div className="p-item-detail">
        <div className="p-item-detail__image">
          <img src={this.props.item.image} />
        </div>
        <div className="p-item-detail__text">
          <table>
            <caption>Item Details</caption>
            <tbody>
              <tr>
                <th>ブランド</th>
                <td>{this.props.item.brand}</td>
              </tr>
              <tr>
                <th>サイズ</th>
                <td>{this.props.item.size}</td>
              </tr>
              <tr>
                <th>ランク</th>
                <td>{this.props.item.rank}</td>
              </tr>
              <tr>
                <th>価格</th>
                <td>{this.props.item.price}</td>
              </tr>
              <tr>
                <th>詳細</th>
                <td>{details}</td>
              </tr>
              <tr>
                <th>出品者</th>
                <td>{this.props.item.exhibiter}</td>
              </tr>
              <tr>
                <th>配送日</th>
                <td>{this.props.item.delivery_days}</td>
              </tr>
              <tr>
                <th>配送業者</th>
                <td>{this.props.item.delivery_service}</td>
              </tr>
              <tr>
                <th>発送元</th>
                <td>{this.props.item.delivery_source}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

ItemDetail.propTypes = {
  item: React.PropTypes.object.isRequired
}