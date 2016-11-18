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

var Comment = React.createClass({displayName: "Comment",
  rawMarkup: function() {
    var md = new Remarkable();
    var rawMarkup = md.render(this.props.children.toString());
    return { __html: rawMarkup };
  },

  render: function() {
    return (
      React.createElement("div", {className: "comment"}, 
        React.createElement("h2", {className: "commentAuthor"}, 
          this.props.author
        ), 
        React.createElement("span", {dangerouslySetInnerHTML: this.rawMarkup()})
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
        React.createElement(Item, {price: item.price, key: item.pk}, 
          item.image
        )
      );
    });
    return (
      React.createElement("div", {className: "ItemList"}, 
        itemNodes
      )
    );
  }
});

var CommentForm = React.createClass({displayName: "CommentForm",
  getInitialState: function() {
    return {author: '', text: ''};
  },
  handleAuthorChange: function(e) {
    this.setState({author: e.target.value});
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    this.setState({author: '', text: ''});
  },
  render: function() {
    return (
      React.createElement("form", {className: "commentForm", onSubmit: this.handleSubmit}, 
        React.createElement("input", {
          type: "text", 
          placeholder: "Your name", 
          value: this.state.author, 
          onChange: this.handleAuthorChange}
        ), 
        React.createElement("input", {
          type: "text", 
          placeholder: "Say something...", 
          value: this.state.text, 
          onChange: this.handleTextChange}
        ), 
        React.createElement("input", {type: "submit", value: "Post"})
      )
    );
  }
});

ReactDOM.render(
  React.createElement(ItemBox, {url: "/api/items", pollInterval: 2000}),
  document.getElementById('content')
);

}, false);