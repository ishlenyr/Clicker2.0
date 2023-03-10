// @ts-check
"use strict";

export function setBarFill(element, value) {
  element.style.width = `${value <= 100 ? value : 100}%`;
}

export class ProgressBarController {
  constructor(element) {
    this.barElement = element;
  }

  setProgress(value) {
    this.barElement.style.width = `${value <= 100 ? value : 100}%`;
  }
}
