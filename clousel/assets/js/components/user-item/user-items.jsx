import React from 'react'

import UserItem from './user-item'


export default class UserItems extends React.Component {

  render() {
    const item_separator = " > "
    let item_nodes = this.props.data.map( (item) => {
      return (
        <UserItem
          key={item.pk}
          item={item}
        />
      )
    })
    return (
      <div className="p-items">
        {item_nodes}
      </div>
    )
  }
}

UserItems.propTypes = {
  data: React.PropTypes.array.isRequired
}