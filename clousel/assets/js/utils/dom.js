import classie from 'desandro-classie'


export function hasParentClass(e, classname) {
  if(e === document)
    return false;
  if(classie.has(e, classname))
    return true;
  return e.parentNode && hasParentClass(e.parentNode, classname);
}

export function querySelectorAllAsArray(parent, selector) {
  return Array.prototype.slice.call(
    parent.querySelectorAll(selector)
  )
}