import React from 'react'


export default class UserItem extends React.Component {

  render() {
    let image_class = "p-image "
    if (this.props.orientation !== "square")
      image_class += "p-image--" + this.props.orientation

    return (
      <a className="p-item" href="#">
        <div>
          <div className="p-item__image">
            <div className="p-image-box">
              <img className={image_class} src={this.props.image} />
            </div>
          </div>
          <div className="p-item__caption">
            <dl>
              <dt>category</dt>
              <dd>{this.props.category}</dd>
            </dl>
          </div>
        </div>
      </a>
    )
  }
}

UserItem.propTypes = {
  image: React.PropTypes.string.isRequired,
  category: React.PropTypes.string.isRequired,
  orientation: React.PropTypes.string.isRequired,
}