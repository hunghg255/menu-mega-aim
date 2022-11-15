function calculateTopLeftAndBottomRightCoordinates(element) {
  var rect = element.getBoundingClientRect();
  var topX =
    rect.left + (window.pageXOffset || document.documentElement.scrollLeft);
  var topY =
    rect.top + (window.pageYOffset || document.documentElement.scrollTop);
  return {
    x: [topX, topX + element.offsetWidth],
    y: [topY, topY + element.offsetHeight],
  };
}

function calculateGradient(A, B) {
  return (B.y - A.y) / (B.x - A.x);
}

const MenuAim = (options) => {
  if (!options?.classMenu || !options?.classMenuItem || !options?.classPopup)
    return;

  const menuElement = document.querySelector(options?.classMenu);
  const menuChilds = menuElement.querySelectorAll(options?.classMenuItem);

  var previousMouseCoordinates = {};
  var currentMouseCoordinates = {};
  var timeoutId;
  var activeMenuItem;
  var activeSubMenuTopLeftCoordinates;
  var activeSubMenuBottomLeftCoordinates;
  var extremeCoordinates;

  var menuElementCoordinates =
    calculateTopLeftAndBottomRightCoordinates(menuElement);

  function saveMouseCoordinates(x, y) {
    previousMouseCoordinates.x = currentMouseCoordinates.x;
    previousMouseCoordinates.y = currentMouseCoordinates.y;
    currentMouseCoordinates.x = x;
    currentMouseCoordinates.y = y;
  }

  // Return `true` if there currently isn't an active menu item, or if
  // `currentMouseCoordinates` is outside of the triangle drawn between
  // `previousMouseCoordinates`, `activeSubMenuTopLeftCoordinates` and
  // `activeSubMenuBottomLeftCoordinates`.
  function shouldChangeActiveMenuItem() {
    return (
      !activeMenuItem ||
      calculateGradient(
        previousMouseCoordinates,
        activeSubMenuTopLeftCoordinates
      ) <
        calculateGradient(
          currentMouseCoordinates,
          activeSubMenuTopLeftCoordinates
        ) ||
      calculateGradient(
        previousMouseCoordinates,
        activeSubMenuBottomLeftCoordinates
      ) >
        calculateGradient(
          currentMouseCoordinates,
          activeSubMenuBottomLeftCoordinates
        )
    );
  }

  // Possibly activates the given `menuItem`. If so, returns true.
  function possiblyActivateMenuItem(menuItem) {
    cancelPendingMenuItemActivations();
    if (shouldChangeActiveMenuItem()) {
      deactivateActiveMenuItem();
      activateMenuItem(menuItem);
      return true;
    }
  }

  function activateMenuItem(menuItem) {
    activeMenuItem = menuItem;
    activeMenuItem.classList.add(options?.classMenuItemActive);
    var activeSubMenu = activeMenuItem.querySelector(options?.classPopup);

    var activeSubMenuCoordinates =
      calculateTopLeftAndBottomRightCoordinates(activeSubMenu);
    activeSubMenuTopLeftCoordinates = {
      x: activeSubMenuCoordinates.x[0],
      y: activeSubMenuCoordinates.y[0],
    };
    activeSubMenuBottomLeftCoordinates = {
      x: activeSubMenuCoordinates.x[0],
      y: activeSubMenuCoordinates.y[1],
    };
    // `extremeCoordinates` corresponds to the top-left coordinates (Ax, Ay) and
    // bottom-right coordinates (Bx, By) of the entire menu, encompassing both the
    // `menuElement` and `activeSubMenu`.
    extremeCoordinates = {
      x: [
        menuElementCoordinates.x[0],
        activeSubMenuTopLeftCoordinates.x + activeSubMenu.offsetWidth,
      ],
      y: [
        menuElementCoordinates.y[0],
        activeSubMenuTopLeftCoordinates.y + activeSubMenu.offsetHeight,
      ],
    };
  }

  function possiblyDeactivateActiveMenuItem() {
    if (
      currentMouseCoordinates.x < extremeCoordinates.x[0] ||
      currentMouseCoordinates.x > extremeCoordinates.x[1] ||
      currentMouseCoordinates.y < extremeCoordinates.y[0] ||
      currentMouseCoordinates.y > extremeCoordinates.y[1]
    ) {
      cancelPendingMenuItemActivations();
      deactivateActiveMenuItem();
    }
  }

  function deactivateActiveMenuItem() {
    if (activeMenuItem) {
      activeMenuItem.classList.remove(options?.classMenuItemActive);
      activeMenuItem = null;
    }
  }

  function cancelPendingMenuItemActivations() {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }

  const onMouseEnterToMenuItem = (event) => {
    var menuItem = event.target;
    if (!possiblyActivateMenuItem(menuItem)) {
      timeoutId = setTimeout(function () {
        possiblyActivateMenuItem(menuItem);
      }, options?.delay || 300);
    }
  };

  function handleMouseMoveDocument(e) {
    saveMouseCoordinates(e.pageX, e.pageY);
    if (activeMenuItem) {
      possiblyDeactivateActiveMenuItem();
    }
  }

  menuChilds.forEach((element) => {
    element.addEventListener('mouseenter', onMouseEnterToMenuItem);
  });

  document.addEventListener('mousemove', handleMouseMoveDocument);
};

export default MenuAim;
