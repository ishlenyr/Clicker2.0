export class ProgressBarController {
  constructor(element) {
    this.fillElement = element.getElementsByClassName('bar-fill')[0];
    this.textElement = element.getElementsByClassName('bar-text')[0];
  }

  setProgress(value) {
    this.fillElement.style.width = `${value <= 100 ? value : 100}%`;
  }

  setText(text) {
    this.textElement.textContent = text;
  }
}
