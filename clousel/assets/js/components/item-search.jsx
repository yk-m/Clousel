import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Request from 'superagent'

import fetch from './fetch'
import ItemList from './item/item-list'
import SearchFilters from './search/search-filters'
import SearchOrdering from './search/search-ordering'
import { flippable, searchable } from './mixins'


export default class ItemSearch extends searchable(flippable(React.Component)) {

  static CATEGORIES_URL = "/api/categories/"

  constructor(props) {
    super(props)

    this.state = {
      filters_are_hidden: true,
      categories: null
    }
  }

  fetchCategories() {
    fetch(
      ItemSearch.CATEGORIES_URL,
      {},
      (res) => {
        this.setState({
          categories: this.formatCategories(res.body)
        })
      },
      (res) => {
        console.error(ItemSearch.CATEGORIES_URL, res.status, res.text)
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
    let query = filters
    query.ordering = this.ordering
    query.page = 1

    this.props.router.push({
      pathname: '/',
      query: query
    })
  }

  updateOrdering(ordering) {
    let query = this.filters
    query.ordering = ordering
    query.page = 1

    this.props.router.push({
      pathname: '/',
      query: query
    })
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
                          default={this.ordering}/>
        </div>
        <ReactCSSTransitionGroup transitionName="slide"
                                 transitionEnterTimeout={500}
                                 transitionLeaveTimeout={500}>
          {
            this.state.filters_are_hidden
            ? null : <SearchFilters handleFiltersChange={(filters) => this.updateFilters(filters)}
                                    categories={this.state.categories}
                                    defaults={this.filters} />
          }
        </ReactCSSTransitionGroup>
        {this.props.children}
      </section>
    )
  }
}

