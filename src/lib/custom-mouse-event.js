export let getCustomMouseEvent = function(type, sx = 1, sy = 1, cx = 1, cy = 1) {
  let evt;
  const e = {
    bubbles: true,
    cancelable: (type !== "mousemove"),
    view: window,
    detail: 0,
    screenX: sx,
    screenY: sy,
    clientX: cx,
    clientY: cy,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    button: 0,
    relatedTarget: undefined
  };
  if (typeof  document.createEvent === "function") {
    evt = document.createEvent("MouseEvents");
    evt.initMouseEvent(type,
      e.bubbles, e.cancelable, e.view, e.detail,
      e.screenX, e.screenY, e.clientX, e.clientY,
      e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
      e.button, document.body.parentNode);
  } else if (document.createEventObject) {
    evt = document.createEventObject();
    for (prop in e) {
      evt[prop] = e[prop];
    }
    evt.button = {0: 1, 1: 4, 2: 2}[evt.button] || evt.button;
  }
  return evt;
}

export let dispatchEvent = function(el, evt) {
  if (el.dispatchEvent) {
    el.dispatchEvent(evt);
  } else if (el.fireEvent) {
    el.fireEvent('on' + type, evt);
  }
  return evt;
}

export let simulateMouseMove = function (startCoord, direction, distance) {
  for (let i = 1; i < distance; i++) {
    let mouseMove = null;
    switch (direction) {
      case 'up':
        mouseMove = getCustomMouseEvent("mousemove", 1, 1, 1, startCoord - i);
        break;
      case 'down':
        mouseMove = getCustomMouseEvent("mousemove", 1, 1, 1, startCoord + i);
        break;
      case 'left':
        mouseMove = getCustomMouseEvent("mousemove", 1, 1, startCoord - i, 1);
        break;
      case 'right':
        mouseMove = getCustomMouseEvent("mousemove", 1, 1, startCoord + i, 1);
        break;
    }
    dispatchEvent(window.document.documentElement, mouseMove);
  }
};
