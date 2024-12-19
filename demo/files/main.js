
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  var attributes = ['borderBottomWidth', 'borderLeftWidth', 'borderRightWidth', 'borderTopStyle', 'borderRightStyle', 'borderBottomStyle', 'borderLeftStyle', 'borderTopWidth', 'boxSizing', 'fontFamily', 'fontSize', 'fontWeight', 'height', 'letterSpacing', 'lineHeight', 'marginBottom', 'marginLeft', 'marginRight', 'marginTop', 'outlineWidth', 'overflow', 'overflowX', 'overflowY', 'paddingBottom', 'paddingLeft', 'paddingRight', 'paddingTop', 'textAlign', 'textOverflow', 'textTransform', 'whiteSpace', 'wordBreak', 'wordWrap'];
  /**
   * Create a mirror
   *
   * @param {Element} element The element
   * @param {string} html The html
   *
   * @return {object} The mirror object
   */

  var createMirror = function createMirror(element, html) {
    /**
     * The mirror element
     */
    var mirror = document.createElement('div');
    /**
     * Create the CSS for the mirror object
     *
     * @return {object} The style object
     */

    var mirrorCss = function mirrorCss() {
      var css = {
        position: 'absolute',
        left: -9999,
        top: 0,
        zIndex: -2000
      };

      if (element.tagName === 'TEXTAREA') {
        attributes.push('width');
      }

      attributes.forEach(function (attr) {
        css[attr] = getComputedStyle(element)[attr];
      });
      return css;
    };
    /**
     * Initialize the mirror
     *
     * @param {string} html The html
     *
     * @return {void}
     */


    var initialize = function initialize(html) {
      var styles = mirrorCss();
      Object.keys(styles).forEach(function (key) {
        mirror.style[key] = styles[key];
      });
      mirror.innerHTML = html;
      element.parentNode.insertBefore(mirror, element.nextSibling);
    };
    /**
     * Get the rect
     *
     * @return {Rect} The bounding rect
     */


    var rect = function rect() {
      var marker = mirror.ownerDocument.getElementById('caret-position-marker');
      var boundingRect = {
        left: marker.offsetLeft,
        top: marker.offsetTop,
        height: marker.offsetHeight
      };
      mirror.parentNode.removeChild(mirror);
      return boundingRect;
    };

    initialize(html);
    return {
      rect: rect
    };
  };

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  /**
   * Check if a DOM Element is content editable
   *
   * @param {Element} element  The DOM element
   *
   * @return {bool} If it is content editable
   */
  var isContentEditable = function isContentEditable(element) {
    return !!(element.contentEditable ? element.contentEditable === 'true' : element.getAttribute('contenteditable') === 'true');
  };
  /**
   * Get the context from settings passed in
   *
   * @param {object} settings The settings object
   *
   * @return {object} window and document
   */

  var getContext = function getContext() {
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var customPos = settings.customPos,
        iframe = settings.iframe,
        noShadowCaret = settings.noShadowCaret;

    if (iframe) {
      return {
        iframe: iframe,
        window: iframe.contentWindow,
        document: iframe.contentDocument || iframe.contentWindow.document,
        noShadowCaret: noShadowCaret,
        customPos: customPos
      };
    }

    return {
      window: window,
      document: document,
      noShadowCaret: noShadowCaret,
      customPos: customPos
    };
  };
  /**
   * Get the offset of an element
   *
   * @param {Element} element The DOM element
   * @param {object} ctx The context
   *
   * @return {object} top and left
   */

  var getOffset = function getOffset(element, ctx) {
    var win = ctx && ctx.window || window;
    var doc = ctx && ctx.document || document;
    var rect = element.getBoundingClientRect();
    var docEl = doc.documentElement;
    var scrollLeft = win.pageXOffset || docEl.scrollLeft;
    var scrollTop = win.pageYOffset || docEl.scrollTop;
    return {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft
    };
  };
  /**
   * Check if a value is an object
   *
   * @param {any} value The value to check
   *
   * @return {bool} If it is an object
   */

  var isObject = function isObject(value) {
    return _typeof(value) === 'object' && value !== null;
  };

  /**
   * Create a Input caret object.
   *
   * @param {Element} element The element
   * @param {Object} ctx The context
   */

  var createInputCaret = function createInputCaret(element, ctx) {
    /**
     * Get the current position
     *
     * @returns {int} The caret position
     */
    var getPos = function getPos() {
      return element.selectionStart;
    };
    /**
     * Set the position
     *
     * @param {int} pos The position
     *
     * @return {Element} The element
     */


    var setPos = function setPos(pos) {
      element.setSelectionRange(pos, pos);
      return element;
    };
    /**
     * The offset
     *
     * @param {int} pos The position
     *
     * @return {object} The offset
     */


    var getOffset$1 = function getOffset$1(pos) {
      var rect = getOffset(element);
      var position = getPosition(pos);
      var top = rect.top + position.top + ctx.document.body.scrollTop;
      var left = rect.left + position.left + ctx.document.body.scrollLeft; // compensate if textarea is scrolled

      if (element.tagName === 'TEXTAREA') {
        // console.log('before, top, left', top, left);
        top -= element.scrollTop || 0;
        left -= element.scrollLeft || 0; // console.log('after, top, left', top, left);
      }

      return {
        top: top,
        left: left,
        height: position.height
      };
    };
    /**
     * Get the current position
     *
     * @param {int} pos The position
     *
     * @return {object} The position
     */


    var getPosition = function getPosition(pos) {
      var format = function format(val) {
        var value = val.replace(/<|>|`|"|&/g, '?').replace(/\r\n|\r|\n/g, '<br/>');
        return value;
      };

      if (ctx.customPos || ctx.customPos === 0) {
        pos = ctx.customPos;
      }

      var position = pos === undefined ? getPos() : pos;
      var startRange = element.value.slice(0, position);
      var endRange = element.value.slice(position);
      var html = "<span style=\"position: relative; display: inline;\">".concat(format(startRange), "</span>");
      html += '<span id="caret-position-marker" style="position: relative; display: inline;">|</span>';
      html += "<span style=\"position: relative; display: inline;\">".concat(format(endRange), "</span>");
      var mirror = createMirror(element, html);
      var rect = mirror.rect();
      rect.pos = getPos();
      return rect;
    };

    return {
      getPos: getPos,
      setPos: setPos,
      getOffset: getOffset$1,
      getPosition: getPosition
    };
  };

  /**
   * Create an Editable Caret
   * @param {Element} element The editable element
   * @param {object|null} ctx The context
   *
   * @return {EditableCaret}
   */
  var createEditableCaret = function createEditableCaret(element, ctx) {
    /**
     * Set the caret position
     *
     * @param {int} pos The position to se
     *
     * @return {Element} The element
     */
    var setPos = function setPos(pos) {
      var sel = ctx.window.getSelection();

      if (sel) {
        var offset = 0;
        var found = false;

        var find = function find(position, parent) {
          for (var i = 0; i < parent.childNodes.length; i++) {
            var node = parent.childNodes[i];

            if (found) {
              break;
            }

            if (node.nodeType === 3) {
              if (offset + node.length >= position) {
                found = true;
                var range = ctx.document.createRange();
                range.setStart(node, position - offset);
                sel.removeAllRanges();
                sel.addRange(range);
                break;
              } else {
                offset += node.length;
              }
            } else {
              find(pos, node);
            }
          }
        };

        find(pos, element);
      }

      return element;
    };
    /**
     * Get the offset
     *
     * @return {object} The offset
     */


    var getOffset = function getOffset() {
      var range = getRange();
      var offset = {
        height: 0,
        left: 0,
        right: 0
      };

      if (!range) {
        return offset;
      }

      var hasCustomPos = ctx.customPos || ctx.customPos === 0; // endContainer in Firefox would be the element at the start of
      // the line

      if (range.endOffset - 1 > 0 && range.endContainer !== element || hasCustomPos) {
        var clonedRange = range.cloneRange();
        var fixedPosition = hasCustomPos ? ctx.customPos : range.endOffset;
        clonedRange.setStart(range.endContainer, fixedPosition - 1 < 0 ? 0 : fixedPosition - 1);
        clonedRange.setEnd(range.endContainer, fixedPosition);
        var rect = clonedRange.getBoundingClientRect();
        offset = {
          height: rect.height,
          left: rect.left + rect.width,
          top: rect.top
        };
        clonedRange.detach();
      }

      if ((!offset || offset && offset.height === 0) && !ctx.noShadowCaret) {
        var _clonedRange = range.cloneRange();

        var shadowCaret = ctx.document.createTextNode('|');

        _clonedRange.insertNode(shadowCaret);

        _clonedRange.selectNode(shadowCaret);

        var _rect = _clonedRange.getBoundingClientRect();

        offset = {
          height: _rect.height,
          left: _rect.left,
          top: _rect.top
        };
        shadowCaret.parentNode.removeChild(shadowCaret);

        _clonedRange.detach();
      }

      if (offset) {
        var doc = ctx.document.documentElement;
        offset.top += ctx.window.pageYOffset - (doc.clientTop || 0);
        offset.left += ctx.window.pageXOffset - (doc.clientLeft || 0);
      }

      return offset;
    };
    /**
     * Get the position
     *
     * @return {object} The position
     */


    var getPosition = function getPosition() {
      var offset = getOffset();
      var pos = getPos();
      var rect = element.getBoundingClientRect();
      var inputOffset = {
        top: rect.top + ctx.document.body.scrollTop,
        left: rect.left + ctx.document.body.scrollLeft
      };
      offset.left -= inputOffset.left;
      offset.top -= inputOffset.top;
      offset.pos = pos;
      return offset;
    };
    /**
     * Get the range
     *
     * @return {Range|null}
     */


    var getRange = function getRange() {
      if (!ctx.window.getSelection) {
        return;
      }

      var sel = ctx.window.getSelection();
      return sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
    };
    /**
     * Get the caret position
     *
     * @return {int} The position
     */


    var getPos = function getPos() {
      var range = getRange();
      var clonedRange = range.cloneRange();
      clonedRange.selectNodeContents(element);
      clonedRange.setEnd(range.endContainer, range.endOffset);
      var pos = clonedRange.toString().length;
      clonedRange.detach();
      return pos;
    };

    return {
      getPos: getPos,
      setPos: setPos,
      getPosition: getPosition,
      getOffset: getOffset,
      getRange: getRange
    };
  };

  var createCaret = function createCaret(element, ctx) {
    if (isContentEditable(element)) {
      return createEditableCaret(element, ctx);
    }

    return createInputCaret(element, ctx);
  };

  var position = function position(element, value) {
    var settings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var options = settings;

    if (isObject(value)) {
      options = value;
      value = null;
    }

    var ctx = getContext(options);
    var caret = createCaret(element, ctx);

    if (value || value === 0) {
      return caret.setPos(value);
    }

    return caret.getPosition();
  };
  /**
   *
   * @param {Element} element The DOM element
   * @param {number|undefined} value The value to set
   * @param {object} settings Any settings for context
   */

  var offset = function offset(element, value) {
    var settings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var options = settings;

    if (isObject(value)) {
      options = value;
      value = null;
    }

    var ctx = getContext(options);
    var caret = createCaret(element, ctx);
    return caret.getOffset(value);
  };

  var offsetYLine = document.querySelector('.offset-y-line');
  var offsetXLine = document.querySelector('.offset-x-line');
  var indicators = document.querySelector('.indicators');
  var offsetIndicator = indicators.querySelector('.offset-indicator');
  var positionIndicator = document.querySelector('.position-indicator');

  var setIndicators = function setIndicators(off, pos) {
    offsetYLine.style.left = "".concat(Math.ceil(off.left), "px");
    offsetXLine.style.top = "".concat(Math.ceil(off.top), "px");
    indicators.style.left = "".concat(Math.ceil(off.left), "px");
    indicators.style.top = "".concat(Math.ceil(off.top) + Math.ceil(off.height), "px");
    offsetIndicator.innerHTML = "Offset: left: ".concat(Math.ceil(off.left), ", top: ").concat(Math.ceil(off.top), " height: ").concat(Math.ceil(off.height));
    positionIndicator.innerHTML = "Position: left: ".concat(Math.ceil(pos.left), ", top: ").concat(Math.ceil(pos.top), " height: ").concat(Math.ceil(pos.height), " pos: ").concat(pos.pos);
  };
  /* eslint-disable */


  var output = function output(name, pos, off) {
    console.clear();

    if (console.group) {
      console.group(name);
      console.log('position:', pos);
      console.log('offset:', off);
      console.groupEnd();
    } else {
      console.log(name);
      console.log('position:', pos);
      console.log('offset:', off);
    }
  };
  /* eslint-enable */


  var inputEventHandler = function inputEventHandler() {
    var pos = position(input);
    var off = offset(input);
    output('Textarea', pos, off);
    setIndicators(off, pos);
  };

  var inputTextEventHandler = function inputTextEventHandler() {
    var pos = position(inputText);
    var off = offset(inputText);
    output('inputText', pos, off);
    setIndicators(off, pos);
  };

  var inputText = document.getElementById('inputText');
  inputText.addEventListener('mouseup', inputTextEventHandler);
  inputText.addEventListener('keyup', inputTextEventHandler);
  var input = document.getElementById('input');
  input.addEventListener('mouseup', inputEventHandler);
  input.addEventListener('keyup', inputEventHandler);

  var editableEventHandler = function editableEventHandler() {
    var pos = position(editable);
    var off = offset(editable);
    output('ContentEditable', pos, off);
    setIndicators(off, pos);
  };

  var editable = document.getElementById('editable');
  editable.addEventListener('mouseup', editableEventHandler);
  editable.addEventListener('keyup', editableEventHandler);
  var frame = document.getElementById('iframe');
  var body = frame.contentDocument.body;
  body.contentEditable = true;
  body.id = 'frame-body';
  body.innerHTML = 'For <strong>WYSIWYG</strong> such as <strong>ckeditor</strong>';

  var iframeEventHandler = function iframeEventHandler() {
    var off = offset(body, {
      iframe: frame
    });
    var frameOffset = getOffset(frame);
    off.left += frameOffset.left;
    off.top += frameOffset.top;
    var pos = position(body, {
      iframe: frame
    });
    output('iframe body', pos, off);
    setIndicators(off, pos);
  };

  body.addEventListener('mouseup', iframeEventHandler);
  body.addEventListener('keyup', iframeEventHandler);
  setTimeout(function () {
    position(input, 67).focus();
    inputEventHandler();
  }, 500);

})));
//# sourceMappingURL=main.js.map
