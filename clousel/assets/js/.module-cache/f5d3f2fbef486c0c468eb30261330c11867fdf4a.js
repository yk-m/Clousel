var Hello = React.createClass({displayName: "Hello",
  render:function() {
    return (
      React.createElement("div", null, React.createElement("span", null, "hello"))
    )
  }
})