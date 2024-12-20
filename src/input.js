import createMirror from './mirror';
import { getOffset as elementOffset } from './utils';

/**
 * Create a Input caret object.
 *
 * @param {Element} element The element
 * @param {Object} ctx The context
 */
const createInputCaret = (element, ctx) => {

  /**
   * Get the current position
   *
   * @returns {int} The caret position
   */
  const getPos = () => {
    return element.selectionStart;
  };

  /**
   * Set the position
   *
   * @param {int} pos The position
   *
   * @return {Element} The element
   */
  const setPos = (pos) => {
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
  const getOffset = (pos) => {
    const rect = elementOffset(element);
    const position = getPosition(pos);

    let top = rect.top + position.top + ctx.document.body.scrollTop;
    let left = rect.left + position.left + ctx.document.body.scrollLeft;

    // compensate if textarea is scrolled
    if (element.tagName === 'TEXTAREA') {
      // console.log('before, top, left', top, left);
      top -= element.scrollTop || 0;
      left -= element.scrollLeft || 0;
      // console.log('after, top, left', top, left);

    }

    return {
      top,
      left,
      height: position.height,
    };
  };

  /**
   * Get the current position
   *
   * @param {int} pos The position
   *
   * @return {object} The position
   */
  const getPosition = (pos) => {
    const format = (val) => {
      let value = val.replace(/<|>|`|"|&/g, '?')
        .replace(/\r\n|\r|\n/g,'<br/>');
      return value;
    };

    if (ctx.customPos || ctx.customPos === 0) {
      pos = ctx.customPos;
    }

    const position = pos === undefined ? getPos() : pos;
    const startRange = element.value.slice(0, position);
    const endRange = element.value.slice(position);
    let html = `<span style="position: relative; display: inline;">${format(startRange)}</span>`;
    html += '<span id="caret-position-marker" style="position: relative; display: inline;">|</span>';
    html += `<span style="position: relative; display: inline;">${format(endRange)}</span>`;

    const mirror = createMirror(element, html);
    const rect = mirror.rect();
    rect.pos = getPos();

    return rect;
  };

  return {
    getPos,
    setPos,
    getOffset,
    getPosition,
  };
};

export default createInputCaret;
