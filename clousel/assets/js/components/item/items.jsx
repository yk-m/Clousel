import React from 'react'

import Item from './item'


export default class Items extends React.Component {

  render() {
    const item_separator = " > "
    let itemNodes = this.props.data.map( (item) => {
      let category = item.category_meta.join(item_separator)
      return (
        <Item
          key={item.pk}
          image={item.image} orientation={item.orientation}
          category={category} price={item.price}
        />
      )
    })
    return (
      <div className="p-items">
        {itemNodes}
      </div>
    )
  }
}

Items.propTypes = {
  data: React.PropTypes.array.isRequired
}