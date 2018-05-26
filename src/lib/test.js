import {startDrag, startDragListElement, clearStyleAfterDragging, getRelativeY} from './drag';
import ElementParameters from './element-parameters';
import { dispatchEvent, getCustomMouseEvent, simulateMouseMove } from "./custom-mouse-event";

const createListAndGetListElementNodes = function() {
  const list = document.createElement('ul');
  const listElements = document.createDocumentFragment();

  for (let i = 0; i < 5; i++) {
    const listElement = document.createElement('li');
    listElements.appendChild(listElement);
  }
  list.appendChild(listElements);
  return [].map.call(list.querySelectorAll('li'), listElement => listElement);
};

document.body.style.height = '600px';
document.body.style.width = '800px';

describe('startDrag', function () {
  const element = document.createElement('div');

  it('is work fine', () => {
    element.style.top = '0px';
    element.style.left = '0px';
    element.style.height = '53.345px';
    element.style.width = '118.25px';

    element.addEventListener('mousedown', evt => {
      startDrag(evt);
    });

    dispatchEvent(element, getCustomMouseEvent("mousedown"));
    simulateMouseMove(1, 'down', 110);
    dispatchEvent(window.document.documentElement, getCustomMouseEvent("mouseup"));
  });

  it('the snapshot and the style are the same', () => {
    expect(JSON.stringify(element.style)).toMatchSnapshot();
  });

});

describe('startDragListElement', function () {
  const listElementNodes = createListAndGetListElementNodes();
  const draggedElement = listElementNodes[1];

  it('is work fine', () => {
    // Указываем высоту элементов, координаты и бордеры вручную,
    // так как getComputedStyle в среде JSDOM возвращает пустые строки вместо значений
    const elementHeights = [
      '85.75px',
      '167.35px',
      '15.375px',
      '17.65px',
      '35.55px',
    ];
    const draggedElementParameters = new ElementParameters(draggedElement);
    // Эталонное состояние dragInfo перед передвижением элемента
    const startDragInfo = {
      draggableElementStartIndex: 1,
      draggableElementIndex: 1,
      draggableElementPreviousY: 0,
      elementsRelativeY: [ -84.75, 0, 166.35, 180.725, 197.375 ],
      nodes: listElementNodes
    };
    // Эталонное состояние dragInfo после передвижения элемента
    const finalDragInfo = {
      draggableElementStartIndex: 1,
      draggableElementIndex: 3,
      draggableElementPreviousY: 29,
      elementsRelativeY: [ -84.75, -2, 12.375, 180.725, 197.375 ],
      nodes: listElementNodes
    };
    const onElementMouseDownSpy = jest.fn();//(ep, di) => console.log(di);
    const onElementMouseUpSpy = jest.fn();
    elementHeights.forEach((height, index) => {
      listElementNodes[index].id = `le-${index}`;
      listElementNodes[index].style.top = '0px';
      listElementNodes[index].style.left = '0px';
      listElementNodes[index].style.height = height;
      listElementNodes[index].style.width = `${height * 3}px`;
      listElementNodes[index].style.border = '1px';
    });

    draggedElement.addEventListener('mousedown', evt => {
      startDragListElement(evt, listElementNodes, onElementMouseDownSpy, onElementMouseUpSpy);
    });

    dispatchEvent(listElementNodes[1], getCustomMouseEvent("mousedown"));
    expect(onElementMouseDownSpy).toBeCalledWith(draggedElementParameters, startDragInfo);
    simulateMouseMove(1, 'down', 30);
    simulateMouseMove(191, 'up', 10);
    dispatchEvent(window.document.documentElement, getCustomMouseEvent("mouseup"));
    expect(onElementMouseUpSpy).toBeCalledWith(draggedElementParameters, finalDragInfo);
  });

  it('the snapshot and the style are the same', () => {
    expect(JSON.stringify([].map.call(listElementNodes, node => node.style))).toMatchSnapshot();
  });
});

describe('clearStyleAfterDragging', function () {
  const element = document.createElement('div');

  it('is work fine', () => {
    element.style.top = '0px';
    element.style.left = '0px';
    element.style.height = '53.345px';
    element.style.width = '118.25px';
    element.style.zIndex = '5';
    element.style.borderRadius = '2px';

    clearStyleAfterDragging([element]);
  });

  it('the snapshot and the style are the same', () => {
    expect(JSON.stringify(element.style)).toMatchSnapshot();
  });
});
