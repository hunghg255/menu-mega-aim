const MOUSE_LOCS_TRACKED = 3; // number of past mouse locations to trackv
const DELAY = 300; // ms delay when user appears to be entering submenu
const TOLERANCE = 75; // bigger = more forgivey when entering submenu
const mouseLocs = [];
let timerId;
let lastDelayLoc;
let rowActive;

/**
 *
 * DOM helpers
 *
 */
function on(el, eventName, callback) {
  if (el.addEventListener) {
    el.addEventListener(eventName, callback, false);
  } else if (el.attachEvent) {
    el.attachEvent('on' + eventName, function (e) {
      callback.call(el, e || window.event);
    });
  }
}

function off(el, eventName, callback) {
  if (el.removeEventListener) {
    el.removeEventListener(eventName, callback);
  } else if (el.detachEvent) {
    el.detachEvent('on' + eventName, callback);
  }
}

function offset(el) {
  if (!el) {
    return {
      left: 0,
      top: 0,
    };
  }

  const rect = el.getBoundingClientRect();
  return {
    top: rect.top + document.body.scrollTop,
    left: rect.left + document.body.scrollLeft,
  };
}

function outerWidth(el) {
  let _width = el.offsetWidth;
  const style = el.currentStyle || getComputedStyle(el);

  _width += parseInt(style.marginLeft, 10) || 0;
  return _width;
}

function outerHeight(el) {
  let _height = el.offsetHeight;
  const style = el.currentStyle || getComputedStyle(el);

  _height += parseInt(style.marginLeft, 10) || 0;
  return _height;
}

/**
 *
 * Util helpers
 *
 */

// Mousemove handler on document
function handleMouseMoveDocument(e) {
  mouseLocs.push({
    x: e.pageX,
    y: e.pageY,
  });

  if (mouseLocs.length > MOUSE_LOCS_TRACKED) {
    mouseLocs.shift();
  }
}

function getActivateDelay(config) {
  if (
    !rowActive ||
    !rowActive?.evt?.target?.querySelector(config?.classPopup)
  ) {
    // If there is no other submenu row already active, then
    // go ahead and activate immediately.
    return 0;
  }

  config = config || {};
  let menuSelector = document.querySelector(config.menuSelector);

  // If can't find any DOM node
  if (!menuSelector || !menuSelector.querySelector) {
    return 0;
  }

  const menuOffset = offset(menuSelector);

  let upperLeft = {
    x: menuOffset.left,
    y: menuOffset.top - (config.tolerance || TOLERANCE),
  };
  let upperRight = {
    x: menuOffset.left + outerWidth(menuSelector),
    y: upperLeft.y,
  };
  let lowerLeft = {
    x: menuOffset.left,
    y:
      menuOffset.top +
      outerHeight(menuSelector) +
      (config.tolerance || TOLERANCE),
  };
  let lowerRight = {
    x: menuOffset.left + outerWidth(menuSelector),
    y: lowerLeft.y,
  };

  let loc = mouseLocs[mouseLocs.length - 1];
  let prevLoc = mouseLocs[0];

  if (!loc) {
    return 0;
  }

  if (!prevLoc) {
    prevLoc = loc;
  }

  // If the previous mouse location was outside of the entire
  // menu's bounds, immediately activate.
  if (
    prevLoc.x < menuOffset.left ||
    prevLoc.x > lowerRight.x ||
    prevLoc.y < menuOffset.top ||
    prevLoc.y > lowerRight.y
  ) {
    return 0;
  }

  // If the mouse hasn't moved since the last time we checked
  // for activation status, immediately activate.
  if (lastDelayLoc && loc.x == lastDelayLoc.x && loc.y == lastDelayLoc.y) {
    return 0;
  }

  function slope(a, b) {
    return (b.y - a.y) / (b.x - a.x);
  }

  let decreasingCorner = upperRight;
  let increasingCorner = lowerRight;

  if (config.submenuDirection === 'left') {
    decreasingCorner = lowerLeft;
    increasingCorner = upperLeft;
  } else if (config.submenuDirection === 'bottom') {
    decreasingCorner = lowerRight;
    increasingCorner = lowerLeft;
  } else if (config.submenuDirection === 'top') {
    decreasingCorner = upperLeft;
    increasingCorner = upperRight;
  }

  let decreasingSlope = slope(loc, decreasingCorner);
  let increasingSlope = slope(loc, increasingCorner);
  let prevDecreasingSlope = slope(prevLoc, decreasingCorner);
  let prevIncreasingSlope = slope(prevLoc, increasingCorner);

  if (
    decreasingSlope < prevDecreasingSlope &&
    increasingSlope > prevIncreasingSlope
  ) {
    lastDelayLoc = loc;
    return config.delay || DELAY;
  }

  lastDelayLoc = null;

  return 0;
}

function activate(rowIdentifier, handler, config) {
  if (eval(rowIdentifier?.evt?.target) === eval(rowActive?.evt?.target)) return;

  handler(rowIdentifier);
  rowActive = rowIdentifier;

  const subMenu = document.querySelector(config.classPopup);
  if (subMenu) subMenu.classList.add(config.classPopupActive);
}

function possiblyActivate(rowIdentifier, handler, config) {
  const delay = getActivateDelay(config);

  if (delay) {
    timerId = setTimeout(function () {
      possiblyActivate(rowIdentifier, handler, config);
    }, delay);
  } else {
    activate(rowIdentifier, handler, config);
  }
}

const MenuAim = (configs) => {
  const menuSelector = document.querySelector(configs.menuSelector);
  const menuItems = menuSelector.querySelectorAll(configs.classItem);

  const onActiveItem = (it) => {
    rowActive?.evt?.target?.classList?.remove(configs.classItemActive);
    it?.evt?.target?.classList?.add(configs.classItemActive);
  };

  const handleMouseEnterRow = function (rowIdentifier, handler) {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }

    possiblyActivate(rowIdentifier, handler, configs);
  };

  const clearTime = () => {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = null;
  };

  const handleOnMouseLeave = () => {
    const subMenu = document.querySelector(configs.classPopup);
    const itemActive = document.querySelector(`.${configs.classItemActive}`);
    subMenu && subMenu.classList.remove(configs.classPopupActive);
    itemActive && itemActive.classList.remove(configs.classItemActive);
    lastDelayLoc = undefined;
    rowActive - null;

    clearTime();
  };

  menuItems.forEach((element) => {
    on(element, 'mouseenter', (evt) =>
      handleMouseEnterRow({ item: element, evt }, onActiveItem)
    );
  });

  on(document, 'mousemove', handleMouseMoveDocument);

  on(menuSelector, 'mouseleave', handleOnMouseLeave);
};

export default MenuAim;
