class ElementParameters {
  constructor(element) {
    this.object = element;
  }

  get x() {
    return parseFloat(window.getComputedStyle(this.object).left);
  }

  set x(v) {
    this.object.style.left = v + 'px';
  }

  get y() {
    return parseFloat(window.getComputedStyle(this.object).top);
  }

  set y(v) {
    this.object.style.top = v + 'px';
  }

  get width() {
    return parseFloat(window.getComputedStyle(this.object).width);
  }

  set width(v) {
    this.object.style.width = v + 'px';
  }

  get height() {
    return parseFloat(window.getComputedStyle(this.object).height);
  }

  set height(v) {
    this.object.style.height = v + 'px';
  }

  get border() {
    const border = window.getComputedStyle(this.object).border;
    return border !== '' ? parseFloat(border) : 0;
  }

  set zIndex(v) {
    this.object.style.zIndex = v;
  }

  get zIndex() {
    return parseInt(this.object.style.zIndex, 10);
  }

}

export default ElementParameters;
