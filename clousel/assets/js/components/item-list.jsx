import React from 'react'
import CSSTransitionGroup from 'react-addons-css-transition-group'

import Request from 'superagent'
import Paginate from 'react-paginate'

import Loader from './loader'


export default class ItemList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: [],
      offset: 0,
      loading: true,
    }
  }

  loadItemsFromServer() {
    Request
      .get(this.props.url)
      .query({
        limit: this.props.paginate.perPage,
        offset: this.state.offset,
        max_price: 10000
      })
      .end( (err, res) => {
        if (!res.ok) {
          console.error(this.props.url, status, err.toString())
        }

        this.setState({
          data: res.body.results,
          pageNum: Math.ceil(res.body.count / this.props.paginate.perPage),
          loading: false,
        })
      })
  }

  componentDidMount() {
    this.loadItemsFromServer();
  }

  handlePageClick(data) {
    let selected = data.selected
    let offset = Math.ceil(selected * this.props.paginate.perPage)

    this.props.paginate.onClick()

    this.setState({offset: offset, loading: true}, () => {
      this.loadItemsFromServer()
    })
  }

  render() {
    return (
      <div>
        <Loader isActive={this.state.loading} />
        <Items data={this.state.data} />
        <Paginate previousLabel={"previous"}
                       nextLabel={"next"}
                       breakLabel={"..."}
                       breakClassName={"c-pagination__child--break-me"}
                       pageNum={this.state.pageNum}
                       marginPagesDisplayed={this.props.paginate.marginPagesDisplayed}
                       pageRangeDisplayed={this.props.paginate.pageRangeDisplayed}
                       clickCallback={this.handlePageClick.bind(this)}
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
