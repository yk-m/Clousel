import Sidebar from 'observers/sidebar'
import Modal from 'observers/modal'


const sidebar_prefix = "c-sb",
      container = document.getElementById("js-sb"),
      container_class = sidebar_prefix,
      menu = document.getElementById("js-sb__menu"),
      menu_class      = sidebar_prefix + '__menu',
      menuopen_class  = sidebar_prefix + '--menu-open',
      sidebar_openbutton_class  = 'js-sidebar--open',
      sidebar_closebutton_class = 'js-sidebar--close'

const sidebar = new Sidebar(container, container_class,
                            menu, menu_class, menuopen_class)

sidebar.init(sidebar_openbutton_class, sidebar_closebutton_class)


const modal_prefix = "c-modal",
      overlay = document.getElementById("js-modal-overlay"),
      modalopen_class = modal_prefix + '--open',
      modal_openbutton_class  = 'js-modal--open',
      modal_closebutton_class = 'js-modal--close'

const modal = new Modal(overlay, modalopen_class)

modal.init(modal_openbutton_class, modal_closebutton_class)