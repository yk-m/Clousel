import classie from 'desandro-classie'

import { hasParentClass, querySelectorAllAsArray } from 'utils/dom'


/**
 * sidebarEffects.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
export default class Sidebar {

  constructor(container_el, container_classname,
              menu_el, menu_classname, menuopen_classname) {
    this.container = container_el
    this.container_classname = container_classname
    this.menu = menu_el
    this.menu_classname = menu_classname
    this.menuopen_classname = menuopen_classname

    this.eventtype = 'ontouchstart' in window ? 'touchstart' : 'click'
  }

  close = () => {
    classie.remove(this.container, this.menuopen_classname)
    document.removeEventListener(this.eventtype, this.on_body_click)
  }

  on_body_click = (event) => {
    /*
      クリックされた要素が
        メニューの子孫のとき：なにもしない
        それ以外：メニューを閉じる
    */
    if(hasParentClass(event.target, this.menu_classname))
      return
    event.stopPropagation()
    event.preventDefault()
    this.close()
  }

  on_close_click = (event) => {
    event.stopPropagation()
    event.preventDefault()
    this.close()
  }

  open = (event, effect) => {
    event.stopPropagation()
    event.preventDefault()
    this.container.className = this.container_classname
    classie.add(this.container, effect)
    setTimeout(() => {
      classie.add(this.container, this.menuopen_classname)
    }, 25)
    document.addEventListener(this.eventtype, this.on_body_click)
  }

  init = (open_button_classname, close_button_classname) => {
    const open_buttons = querySelectorAllAsArray(document, '.' + open_button_classname),
          close_buttons = querySelectorAllAsArray(this.menu, '.' + close_button_classname)

    open_buttons.forEach((el, i) => {
      const effect = el.getAttribute('data-effect'),
            open = (event) => this.open(event, effect)
      el.addEventListener(this.eventtype, open)
    })

    close_buttons.forEach((el, i) => {
      el.addEventListener(this.eventtype, this.on_close_click)
    })
  }
}

