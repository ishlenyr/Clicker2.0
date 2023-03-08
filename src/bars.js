// @ts-check
"use strict";

export function setBarFill(element, value) {
  element.style.width = `${value <= 100 ? value : 100}%`;
}
