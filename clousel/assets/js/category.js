import { fetch } from './ajax'


export default class Category {

  static CATEGORIES_URL = "/api/categories/"

  static fetch(success, failure) {
    fetch(
      Category.CATEGORIES_URL,
      {},
      (res) => success(Category.format(res.body)),
      (res) => failure(Category.CATEGORIES_URL, res)
    )
  }

  static format(categories) {
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
}

