/*
 * Javascript object into querystring
 *
 * {foo: "hi there", bar: "100%" }
 *     => foo=hi%20there&bar=100%25
 */
export function object_into_querystring(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

/*
 * Get querystring
 *
 * http://example.com/?min_price=1000&page=1
 *     => "?min_price=1000&page=1"
 */
export function get_querystring(url) {
  var index = url.indexOf("?", url.lastIndexOf("/") + 1)
  if(index === -1)
    return ""
  return url.substring(index)
}