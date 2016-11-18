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

var Item = React.createClass({
  rawMarkup: function() {
    var md = new Remarkable();
    var rawMarkup = md.render(this.props.children.toString());
    return { __html: rawMarkup };
  },

  render: function() {
    return (
      <a className="p-item" href="#">
        <div>
          <div className="p-item__image">
            <div><img src={this.props.image} /></div>
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
    );
  }
});

var ItemBox = React.createClass({
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
    // setInterval(this.loadItemsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <ItemList data={this.state.data} />
    );
  }
});

var ItemList = React.createClass({
  render: function() {
    var itemNodes = this.props.data.map(function(item) {
      return (
        <Item price={item.price} image={item.image} category={item.category.tree} key={item.pk}></Item>
      );
    });
    return (
      <div>
        {itemNodes}
      </div>
    );
  }
});

ReactDOM.render(
  <ItemBox url="/api/items" pollInterval={2000} />,
  document.getElementById('item-box')
);

}, false);