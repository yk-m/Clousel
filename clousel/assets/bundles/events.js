/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _sidebar = __webpack_require__(2);

	var _sidebar2 = _interopRequireDefault(_sidebar);

	var _modal = __webpack_require__(5);

	var _modal2 = _interopRequireDefault(_modal);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var sidebar_prefix = "c-sb",
	    container = document.getElementById("js-sb"),
	    container_class = sidebar_prefix,
	    menu = document.getElementById("js-sb__menu"),
	    menu_class = sidebar_prefix + '__menu',
	    menuopen_class = sidebar_prefix + '--menu-open',
	    sidebar_openbutton_class = 'js-sidebar--open',
	    sidebar_closebutton_class = 'js-sidebar--close';

	var sidebar = new _sidebar2.default(container, container_class, menu, menu_class, menuopen_class);

	sidebar.init(sidebar_openbutton_class, sidebar_closebutton_class);

	var modal_prefix = "c-modal",
	    overlay = document.getElementById("js-modal-overlay"),
	    modalopen_class = modal_prefix + '--open',
	    modal_openbutton_class = 'js-modal--open',
	    modal_closebutton_class = 'js-modal--close';

	var modal = new _modal2.default(overlay, modalopen_class);

	modal.init(modal_openbutton_class, modal_closebutton_class);

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _desandroClassie = __webpack_require__(3);

	var _desandroClassie2 = _interopRequireDefault(_desandroClassie);

	var _dom = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
	var Sidebar = function Sidebar(container_el, container_classname, menu_el, menu_classname, menuopen_classname) {
	  var _this = this;

	  _classCallCheck(this, Sidebar);

	  this.close = function () {
	    _desandroClassie2.default.remove(_this.container, _this.menuopen_classname);
	    document.removeEventListener(_this.eventtype, _this.on_body_click);
	  };

	  this.on_body_click = function (event) {
	    /*
	      クリックされた要素が
	        メニューの子孫のとき：なにもしない
	        それ以外：メニューを閉じる
	    */
	    if ((0, _dom.hasParentClass)(event.target, _this.menu_classname)) return;
	    event.stopPropagation();
	    event.preventDefault();
	    _this.close();
	  };

	  this.on_close_click = function (event) {
	    event.stopPropagation();
	    event.preventDefault();
	    _this.close();
	  };

	  this.open = function (event, effect) {
	    event.stopPropagation();
	    event.preventDefault();
	    _this.container.className = _this.container_classname;
	    _desandroClassie2.default.add(_this.container, effect);
	    setTimeout(function () {
	      _desandroClassie2.default.add(_this.container, _this.menuopen_classname);
	    }, 25);
	    document.addEventListener(_this.eventtype, _this.on_body_click);
	  };

	  this.init = function (open_button_classname, close_button_classname) {
	    var open_buttons = (0, _dom.querySelectorAllAsArray)(document, '.' + open_button_classname),
	        close_buttons = (0, _dom.querySelectorAllAsArray)(_this.menu, '.' + close_button_classname);

	    open_buttons.forEach(function (el, i) {
	      var effect = el.getAttribute('data-effect'),
	          open = function open(event) {
	        return _this.open(event, effect);
	      };
	      el.addEventListener(_this.eventtype, open);
	    });

	    close_buttons.forEach(function (el, i) {
	      el.addEventListener(_this.eventtype, _this.on_close_click);
	    });
	  };

	  this.container = container_el;
	  this.container_classname = container_classname;
	  this.menu = menu_el;
	  this.menu_classname = menu_classname;
	  this.menuopen_classname = menuopen_classname;

	  this.eventtype = 'ontouchstart' in window ? 'touchstart' : 'click';
	};

	exports.default = Sidebar;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * classie v1.0.1
	 * class helper functions
	 * from bonzo https://github.com/ded/bonzo
	 * MIT license
	 * 
	 * classie.has( elem, 'my-class' ) -> true/false
	 * classie.add( elem, 'my-new-class' )
	 * classie.remove( elem, 'my-unwanted-class' )
	 * classie.toggle( elem, 'my-class' )
	 */

	/*jshint browser: true, strict: true, undef: true, unused: true */
	/*global define: false, module: false */

	( function( window ) {

	'use strict';

	// class helper functions from bonzo https://github.com/ded/bonzo

	function classReg( className ) {
	  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
	}

	// classList support for class management
	// altho to be fair, the api sucks because it won't accept multiple classes at once
	var hasClass, addClass, removeClass;

	if ( 'classList' in document.documentElement ) {
	  hasClass = function( elem, c ) {
	    return elem.classList.contains( c );
	  };
	  addClass = function( elem, c ) {
	    elem.classList.add( c );
	  };
	  removeClass = function( elem, c ) {
	    elem.classList.remove( c );
	  };
	}
	else {
	  hasClass = function( elem, c ) {
	    return classReg( c ).test( elem.className );
	  };
	  addClass = function( elem, c ) {
	    if ( !hasClass( elem, c ) ) {
	      elem.className = elem.className + ' ' + c;
	    }
	  };
	  removeClass = function( elem, c ) {
	    elem.className = elem.className.replace( classReg( c ), ' ' );
	  };
	}

	function toggleClass( elem, c ) {
	  var fn = hasClass( elem, c ) ? removeClass : addClass;
	  fn( elem, c );
	}

	var classie = {
	  // full names
	  hasClass: hasClass,
	  addClass: addClass,
	  removeClass: removeClass,
	  toggleClass: toggleClass,
	  // short names
	  has: hasClass,
	  add: addClass,
	  remove: removeClass,
	  toggle: toggleClass
	};

	// transport
	if ( true ) {
	  // AMD
	  !(__WEBPACK_AMD_DEFINE_FACTORY__ = (classie), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if ( typeof exports === 'object' ) {
	  // CommonJS
	  module.exports = classie;
	} else {
	  // browser global
	  window.classie = classie;
	}

	})( window );


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.hasParentClass = hasParentClass;
	exports.querySelectorAllAsArray = querySelectorAllAsArray;

	var _desandroClassie = __webpack_require__(3);

	var _desandroClassie2 = _interopRequireDefault(_desandroClassie);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function hasParentClass(e, classname) {
	  if (e === document) return false;
	  if (_desandroClassie2.default.has(e, classname)) return true;
	  return e.parentNode && hasParentClass(e.parentNode, classname);
	}

	function querySelectorAllAsArray(parent, selector) {
	  return Array.prototype.slice.call(parent.querySelectorAll(selector));
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _desandroClassie = __webpack_require__(3);

	var _desandroClassie2 = _interopRequireDefault(_desandroClassie);

	var _dom = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
	var Modal = function Modal(overlay_el, modalopen_classname) {
	  var _this = this;

	  _classCallCheck(this, Modal);

	  this.remove = function (modal, event) {
	    event.stopPropagation();
	    event.preventDefault();
	    _desandroClassie2.default.remove(modal, _this.modalopen_classname);
	  };

	  this.open = function (modal, removeModal, event) {
	    event.stopPropagation();
	    event.preventDefault();
	    _desandroClassie2.default.add(modal, _this.modalopen_classname);
	    _this.overlay.removeEventListener('click', removeModal);
	    _this.overlay.addEventListener('click', removeModal);
	  };

	  this.init = function (open_button_classname, close_button_classname) {
	    var open_buttons = (0, _dom.querySelectorAllAsArray)(document, '.' + open_button_classname);

	    open_buttons.forEach(function (el, i) {
	      var modal = document.querySelector('#' + el.getAttribute('data-modal')),
	          close_buttons = (0, _dom.querySelectorAllAsArray)(modal, '.' + close_button_classname),
	          remove = function remove(event) {
	        return _this.remove(modal, event);
	      },
	          open = function open(event) {
	        return _this.open(modal, remove, event);
	      };

	      el.addEventListener('click', open);
	      close_buttons.forEach(function (el, i) {
	        el.addEventListener('click', remove);
	      });
	    });
	  };

	  this.overlay = overlay_el;
	  this.modalopen_classname = modalopen_classname;
	};

	exports.default = Modal;

/***/ }
/******/ ]);