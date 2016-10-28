import React from 'react'

import UserItem from './user-item'


export default class UserItems extends React.Component {

  render() {
    const item_separator = " > "
    let itemNodes = this.props.data.map( (item) => {
      let category = item.category_meta.join(item_separator)
      return (
        <UserItem
          key={item.pk}
          image={item.image} orientation={item.orientation}
          category={category}
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

UserItems.propTypes = {
  data: React.PropTypes.array.isRequired
}