import classie from 'desandro-classie'

import { hasParentClass, querySelectorAllAsArray } from 'utils/dom'


/**
 * modalEffects.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
export default class Modal {

  constructor(overlay_el, modalopen_classname) {
    this.overlay = overlay_el
    this.modalopen_classname = modalopen_classname
  }

  remove = (modal, event) => {
    event.stopPropagation()
    event.preventDefault()
    classie.remove(modal, this.modalopen_classname)
  }

  open = (modal, removeModal, event) => {
    event.stopPropagation()
    event.preventDefault()
    classie.add(modal, this.modalopen_classname);
    this.overlay.removeEventListener('click', removeModal)
    this.overlay.addEventListener('click', removeModal)
  }

  init = (open_button_classname, close_button_classname) => {
    const open_buttons = querySelectorAllAsArray(document, '.' + open_button_classname)

    open_buttons.forEach(( el, i ) => {
      const modal = document.querySelector('#' + el.getAttribute('data-modal')),
            close_buttons = querySelectorAllAsArray(modal, '.' + close_button_classname),
            remove = (event) => this.remove(modal, event),
            open = (event) => this.open(modal, remove, event)

      el.addEventListener('click', open)
      close_buttons.forEach((el, i) => {
        el.addEventListener('click', remove)
      })
    })
  }
}
