var Hello = React.createClass({displayName: "Hello",
  render:function() {
    return React.createElement("div", null, this.props.name);
  }
});

React.render(React.createElement(Hello, {name: "foo"}), document.body);