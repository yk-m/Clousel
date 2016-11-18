document.addEventListener("DOMContentLoaded",function(eve){
/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var Item = React.createClass({displayName: "Item",
  rawMarkup: function() {
    var md = new Remarkable();
    var rawMarkup = md.render(this.props.children.toString());
    return { __html: rawMarkup };
  },

  render: function() {
    return (
      React.createElement("a", {className: "p-item", href: "#"}, 
        React.createElement("div", null, 
          React.createElement("div", {className: "p-item__image"}, 
            React.createElement("img", {src: "{this.props.image}"})
          ), 
          React.createElement("div", {className: "p-item__caption"}, 
            React.createElement("p", {className: "p-item__price"}, "¥", this.props.price), 
            React.createElement("dl", null, 
              React.createElement("dt", null, "category"), 
              React.createElement("dd", null, this.props.category)
            )
          )
        )
      )
    );
  }
});

var ItemBox = React.createClass({displayName: "ItemBox",
  loadItemsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadItemsFromServer();
    setInterval(this.loadItemsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      React.createElement("div", {className: "ItemBox"}, 
        React.createElement("h1", null, "Items"), 
        React.createElement(ItemList, {data: this.state.data})
      )
    );
  }
});

var ItemList = React.createClass({displayName: "ItemList",
  render: function() {
    var itemNodes = this.props.data.map(function(item) {
      return (
        React.createElement(Item, {price: item.price, image: item.image, category: item.category, key: item.pk})
      );
    });
    return (
      React.createElement("div", {className: "ItemList"}, 
        itemNodes
      )
    );
  }
});

ReactDOM.render(
  React.createElement(ItemBox, {url: "/api/items", pollInterval: 2000}),
  document.getElementById('item-box')
);

}, false);