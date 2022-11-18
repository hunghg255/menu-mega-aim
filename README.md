# Menu dropdown aim

[![npm version](https://badge.fury.io/js/mega-menu-aim.svg)](https://badge.fury.io/js/mega-menu-aim) [![npm](https://img.shields.io/npm/dw/mega-menu-aim.svg?logo=npm)](https://www.npmjs.com/package/mega-menu-aim) [![npm](https://img.shields.io/bundlephobia/minzip/mega-menu-aim)](https://www.npmjs.com/package/mega-menu-aim)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

```
A simple menu like be Amazone's menu
Post: https://bjk5.com/post/44698559168/breaking-down-amazons-mega-dropdown
```

[Live Demo](https://hunghg255.github.io/menu-mega-aim/demo/index.html)

## Installation

[![NPM](https://nodei.co/npm/mega-menu-aim.png?compact=true)](https://nodei.co/npm/mega-menu-aim/)

#### To install the latest stable version:

```js
npm install --save mega-menu-aim
// or
yarn add mega-menu-aim
```

#### Basic usage:

```css
.menu-aim {
  max-width: 200px;
  position: relative;
  height: 200px;
}

.menu-aim__item {
  background-color: gray;
}

.menu-aim a {
  display: block;
  color: blue;
}

.menu-aim__item:hover {
  color: white;
  background-color: rgba(0, 0, 255, 0.473);
}

.menu-aim__item--active {
  background-color: blue !important;
}

.menu-aim__item--active > a {
  color: white !important;
}

.menu-aim__item-submenu {
  display: none;
  position: absolute;
  top: 0;
  left: 100%;
  width: 100%;
  height: 200px;
  background-color: antiquewhite;
}

.menu-aim__item--active .menu-aim__item-submenu {
  display: block;
}
```

```html
<ul class="menu-aim">
  <li class="menu-aim__item">
    <a class="menu-aim__item-name" href="#">foo</a>
    <ul class="menu-aim__item-submenu">
      <li><a href="#">fooo</a></li>
      <li><a href="#">foooo</a></li>
      <li><a href="#">fooooo</a></li>
      <li><a href="#">foooooo</a></li>
      <li><a href="#">fooooooo</a></li>
      <li><a href="#">foooooooo</a></li>
    </ul>
  </li>
  <li class="menu-aim__item">
    <a class="menu-aim__item-name" href="#">bar</a>
    <ul class="menu-aim__item-submenu">
      <li><a href="#">baar</a></li>
      <li><a href="#">baaar</a></li>
      <li><a href="#">baaaar</a></li>
      <li><a href="#">baaaaar</a></li>
      <li><a href="#">baaaaaar</a></li>
      <li><a href="#">baaaaaaar</a></li>
    </ul>
  </li>
  <li class="menu-aim__item">
    <a class="menu-aim__item-name" href="#">baz</a>
    <ul class="menu-aim__item-submenu">
      <li><a href="#">baaz</a></li>
      <li><a href="#">baaaz</a></li>
      <li><a href="#">baaaaz</a></li>
      <li><a href="#">baaaaaz</a></li>
      <li><a href="#">baaaaaaz</a></li>
      <li><a href="#">baaaaaaaz</a></li>
      <li><a href="#">baaaaaaaaz</a></li>
    </ul>
  </li>
</ul>
```

```ts
function MenuAim(options: {
  menuSelector: string;
  classItem: string;
  classItemActive: string;
  classPopup: string;
  classPopupActive: string;
  delay?: number;
  submenuDirection?: 'top' | 'left' | 'bottom' | 'right';
  tolerance?: number;
}): void;

MenuAim({
  submenuDirection: 'right',
  menuSelector: '.menu-aim',
  delay: 350,
  tolerance: 30,
  classItem: '.menu-aim__item',
  classItemActive: 'menu-aim__item--active',
  classPopup: '.menu-aim__item-submenu',
  classPopupActive: 'menu-aim__item-submenu--active',
});
```
