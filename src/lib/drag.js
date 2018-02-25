import ElementParameters from "./element-parameters";

export const startDrag = function (evt, moveEvtCB, upEvtCB, CBArgs, limitXMin, limitXMax, limitYMin, limitYMax) {
  evt.preventDefault();
  const elementParameters = new ElementParameters(evt.currentTarget);

  /*console.log(`MouseDown ScreenX: ${evt.screenX}`);
  console.log(`MouseDown ScreenY: ${evt.screenY}`);
  console.log(`MouseDown ClientX: ${evt.clientX}`);
  console.log(`MouseDown ClientY: ${evt.clientY}`);
  console.log('---------------------------------');*/

  // Element on top
  elementParameters.zIndex = '99';

  let BodySize = {
    WIDTH: parseInt(window.getComputedStyle(document.body).width, 10),
    HEIGHT: parseInt(window.getComputedStyle(document.body).height, 10)
  };

  limitXMin = limitXMin || 0;
  limitXMax = limitXMax || BodySize.WIDTH;
  limitYMin = limitYMin || 0;
  limitYMax = limitYMax || BodySize.HEIGHT;

  // Стартовые координаты курсора
  let mouseStartCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  // Смещение курсора относительно элемента
  let shift = {
    x: mouseStartCoords.x - elementParameters.x,
    y: mouseStartCoords.y - elementParameters.y
  };

  // Обработчик события при перемещении мыши
  let onElementMousemove = function (moveEvt) {
    /*console.log(`MouseMove ScreenX: ${moveEvt.screenX}`);
    console.log(`MouseMove ScreenY: ${moveEvt.screenY}`);
    console.log(`MouseMove ClientX: ${moveEvt.clientX}`);
    console.log(`MouseMove ClientY: ${moveEvt.clientY}`);
    console.log('---------------------------------');*/
    moveEvt.preventDefault();
    // Текущие координаты курсора
    let mouseCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    // Текущие координаты элемента
    let elementCoords = {
      x: mouseCoords.x - shift.x,
      y: mouseCoords.y - shift.y
    };

    if (elementCoords.x >= limitXMin && elementCoords.x + elementParameters.width <= limitXMax) {
      elementParameters.x = elementCoords.x;
    }
    if (elementCoords.y >= limitYMin && elementCoords.y + elementParameters.height <= limitYMax) {
      elementParameters.y = elementCoords.y;
    }
    if (typeof moveEvtCB === 'function') {
      moveEvtCB(elementParameters, ...CBArgs);
    }
  };

  // Обработчик события при отпускании кнопки мыши
  let onElementMouseup = function (upEvt) {
    upEvt.preventDefault();
    document.removeEventListener('mousemove', onElementMousemove);
    document.removeEventListener('mouseup', onElementMouseup);
    if (typeof upEvtCB === 'function') {
      upEvtCB(elementParameters, ...CBArgs);
    }
  };

  document.addEventListener('mousemove', onElementMousemove);
  document.addEventListener('mouseup', onElementMouseup);
};

// ID передвигаемых элементов должны состоять из любых 3-х символов и числа после них
// Число должно указывать на индекс элемента в массиве nodes
export const startDragListElement = function(evt, nodes, mouseUpCB) {
  const draggableElementParameters = new ElementParameters(evt.currentTarget);
  const draggableIndex = parseInt(draggableElementParameters.object.id.substring(3), 10);

  const dragInfo = {
    draggableElementStartIndex: draggableIndex,
    draggableElementIndex: draggableIndex,
    draggableElementPreviousY: draggableElementParameters.y,
    elementsRelativeY: getRelativeY(nodes, draggableIndex),
    nodes: nodes
  };

  const limitXMin = 0;
  const limitXMax = draggableElementParameters.width;
  const limitYMin = dragInfo.elementsRelativeY[0];
  const limitYMax = dragInfo.elementsRelativeY[dragInfo.elementsRelativeY.length - 1] +
    new ElementParameters(nodes[nodes.length - 1]).height;

  startDrag(evt,
    moveAdjacentListElements,
    mouseUpCB || null,
    [dragInfo], limitXMin ,limitXMax, limitYMin, limitYMax);
};

export const moveAdjacentListElements = function(draggableElementParameters, dragInfo) {
  // При движении вниз
  if (dragInfo.draggableElementIndex < dragInfo.elementsRelativeY.length - 1 &&
    draggableElementParameters.y > dragInfo.draggableElementPreviousY)
  {
    const nextElementParameters = new ElementParameters(dragInfo.nodes[dragInfo.draggableElementIndex + 1]);
    if (draggableElementParameters.y + draggableElementParameters.height >
      dragInfo.elementsRelativeY[dragInfo.draggableElementIndex + 1] + nextElementParameters.height / 2)
    {
      nextElementParameters.y -= draggableElementParameters.height - draggableElementParameters.border;
      dragInfo.nodes[dragInfo.draggableElementIndex] = dragInfo.nodes[dragInfo.draggableElementIndex + 1];
      dragInfo.nodes[dragInfo.draggableElementIndex + 1] = draggableElementParameters.object;
      dragInfo.elementsRelativeY[dragInfo.draggableElementIndex] =
        dragInfo.elementsRelativeY[dragInfo.draggableElementIndex + 1] - draggableElementParameters.height - draggableElementParameters.border;
      dragInfo.draggableElementIndex++;
    }
  }
  // При движении вверх
  else if (dragInfo.draggableElementIndex > 0 &&
    draggableElementParameters.y < dragInfo.draggableElementPreviousY)
  {
    const previousElementParameters = new ElementParameters(dragInfo.nodes[dragInfo.draggableElementIndex - 1]);
    if (draggableElementParameters.y <
      dragInfo.elementsRelativeY[dragInfo.draggableElementIndex - 1] + previousElementParameters.height / 2)
    {
      previousElementParameters.y += draggableElementParameters.height - draggableElementParameters.border;
      dragInfo.nodes[dragInfo.draggableElementIndex] = dragInfo.nodes[dragInfo.draggableElementIndex - 1];
      dragInfo.nodes[dragInfo.draggableElementIndex - 1] = draggableElementParameters.object;
      dragInfo.elementsRelativeY[dragInfo.draggableElementIndex] =
        dragInfo.elementsRelativeY[dragInfo.draggableElementIndex - 1] + draggableElementParameters.height - draggableElementParameters.border;
      dragInfo.draggableElementIndex--;
    }
  }
  dragInfo.draggableElementPreviousY = draggableElementParameters.y;
};

export const clearStyleAfterDragging = function(nodes) {
  nodes.forEach(element => {
    element.style.zIndex = '';
    element.style.top = '';
    element.style.left = '';
    element.style.borderRadius = '';
    element.style.height = '';
  });
};

// Возвращает список координат Y у массива DOM-элементов относительно элемента с индексом startIndex
export const getRelativeY = function (elementNodes, startIndex) {
  let relativeY = [];
  relativeY[startIndex] = 0;
  if (startIndex > 0) {
    let totalHeight = 0;
    for (let i = startIndex - 1; i >= 0; i--) {
      let elementParameters = new ElementParameters(elementNodes[i]);
      relativeY[i] = totalHeight - elementParameters.height + elementParameters.border;
      totalHeight += -elementParameters.height + elementParameters.border;
    }
  }
  if (startIndex < elementNodes.length - 1) {
    let totalHeight = 0;
    for (let i = startIndex + 1; i < elementNodes.length; i++) {
      let previousElementParameters = new ElementParameters(elementNodes[i - 1]);
      relativeY[i] = totalHeight + previousElementParameters.height - previousElementParameters.border;
      totalHeight += previousElementParameters.height - previousElementParameters.border;
    }
  }
  return relativeY;
};
