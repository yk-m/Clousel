import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Request from 'superagent'

import fetch from './fetch'
import ItemList from './item/item-list'
import SearchFilters from './search/search-filters'
import SearchOrdering from './search/search-ordering'


export default class ItemSearch extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      filters_are_hidden: true,
      categories: null,
      current_page: 0,
      filters: this.props.default_filters,
      ordering: this.props.default_ordering
    }
  }

  fetchCategories() {
    fetch(
      this.props.categories_fetch_url,
      {},
      (res) => {
        this.setState({
          categories: this.formatCategories(res.body)
        })
      },
      (res) => {
        console.error(this.props.items_fetch_url, res.status, res.text)
      }
    )
  }

  formatCategories(categories) {
    const indent = "--- "

    categories.unshift({pk: "", name: "---------", level: 0})
    return categories.map(function(category) {
      return {
        id: '' + category.pk,
        value: generateIndent(category.level) + category.name
      }
    })

    function generateIndent(level) {
      return Array(level+1).join(indent)
    }
  }

  componentDidMount() {
    this.fetchCategories()
  }

  updateFilters(filters) {
    this.setState({current_page: 0, filters: filters})
  }

  updateOrdering(ordering) {
    this.setState({current_page: 0, ordering: ordering})
  }

  updateCurrentPage(page) {
    this.setState({current_page: page})
  }

  handleFiltersToggleEvent() {
    this.setState({filters_are_hidden: !this.state.filters_are_hidden})
  }

  render() {
    return (
      <section className="p-showcase" >
        <div className="p-showcase__header">
          <h2 className="p-showcase__title">
            Search Results
            <span className="p-showcase__filters-opener" onClick={(e) => this.handleFiltersToggleEvent(e)}>[option]</span>
          </h2>
          <SearchOrdering handleOrderingChange={(ordering) => this.updateOrdering(ordering)}
                          default={this.state.ordering}/>
        </div>
        <ReactCSSTransitionGroup transitionName="slide"
                                 transitionEnterTimeout={500}
                                 transitionLeaveTimeout={500}>
          {
            this.state.filters_are_hidden
            ? null : <SearchFilters handleFiltersChange={(filters) => this.updateFilters(filters)}
                                    categories={this.state.categories}
                                    defaults={this.state.filters} />
          }
        </ReactCSSTransitionGroup>
        <ItemList items_fetch_url={this.props.items_fetch_url}
                  current_page={this.state.current_page}
                  handleChangeCurrentPage={(page) => this.updateCurrentPage(page)}
                  paginate={this.props.paginate}
                  filters={this.state.filters}
                  ordering={this.state.ordering}
        />
      </section>
    )
  }
}

ItemSearch.propTypes = {
  items_fetch_url: React.PropTypes.string.isRequired,
  categories_fetch_url: React.PropTypes.string.isRequired,
  paginate: React.PropTypes.shape({
    per_page: React.PropTypes.number.isRequired,
    margin_pages_displayed: React.PropTypes.number.isRequired,
    page_range_displayed:React.PropTypes.number.isRequired
  }),
  default_filters: React.PropTypes.shape({
    search: React.PropTypes.string,
    category: React.PropTypes.string,
    min_price: React.PropTypes.string,
    max_price: React.PropTypes.string
  }),
  default_ordering: React.PropTypes.string
}

ItemSearch.defaultProps = {
  default_filters: {
    search: "",
    category: "",
    min_price: "",
    max_price: ""
  },
  default_ordering: ""
}
