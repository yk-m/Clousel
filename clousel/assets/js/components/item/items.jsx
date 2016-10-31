import React from 'react'

import Item from './item'


export default class Items extends React.Component {

  render() {
    let itemNodes = this.props.data.map( (item) => {
      return (
        <Item key={item.pk} item={item} />
      )
    })
    return (
      <div className="p-items">
        { itemNodes }
      </div>
    )
  }
}

Items.propTypes = {
  data: React.PropTypes.array.isRequired
}