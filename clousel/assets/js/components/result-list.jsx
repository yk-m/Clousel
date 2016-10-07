import React from 'react'

import Paginate from 'react-paginate'

import Loader from './loader'


export default class ResultList extends React.Component {

  render() {
    return (
      <div className="p-result__list">
        { this.props.loadingIsHidden ? null : <Loader /> }
        <Items data={this.props.data} />
        <Paginate previousLabel={"previous"}
                       nextLabel={"next"}
                       breakLabel={"..."}
                       breakClassName={"c-pagination__child--break-me"}
                       pageNum={this.props.pageNum}
                       marginPagesDisplayed={this.props.paginate.marginPagesDisplayed}
                       pageRangeDisplayed={this.props.paginate.pageRangeDisplayed}
                       clickCallback={this.props.paginate.handlePaginationClick}
                       containerClassName={"c-pagination"}
                       previousClassName={"c-pagination__child--to_prev"}
                       nextClassName={"c-pagination__child--to_next"}
                       previousLinkClassName={"c-pagination__ctrl--to_prev"}
                       nextLinkClassName={"c-pagination__ctrl--to_next"}
                       activeClassName={"c-pagination__child--is_active"}
                       disabledClassName={"c-pagination__child--is_disabled"} />
      </div>
    )
  }
}

ResultList.propTypes = {
  data: React.PropTypes.array.isRequired,
  loadingIsHidden: React.PropTypes.bool.isRequired,
  pageNum: React.PropTypes.number.isRequired,
  paginate: React.PropTypes.shape({
    handlePaginationClick: React.PropTypes.func.isRequired,
    marginPagesDisplayed: React.PropTypes.number.isRequired,
    pageRangeDisplayed:React.PropTypes.number.isRequired
  })
}


class Items extends React.Component {

  render() {
    var itemNodes = this.props.data.map( (item) => {
      return (
        <Item
          key={item.pk}
          image={item.image} orientation={item.orientation}
          category={item.category_tree} price={item.price}>
        </Item>
      )
    })
    return (
      <div className="p-items">
        {itemNodes}
      </div>
    )
  }
}


class Item extends React.Component {

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
            <p className="p-item__price">¥{this.props.price}</p>
            <dl>
              <dt>category</dt>
              <dd>{this.props.category.join(" > ")}</dd>
            </dl>
          </div>
        </div>
      </a>
    )
  }
}

Item.propTypes = {
  image: React.PropTypes.string.isRequired,
  price: React.PropTypes.number.isRequired,
  category: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
}