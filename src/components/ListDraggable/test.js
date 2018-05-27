import React from 'react';
import { mount } from 'enzyme';
import ListElementClosable from "../ElementClosable";
import ListDraggable from "./index";
import { dispatchEvent, getCustomMouseEvent, simulateMouseMove } from "../../lib/custom-mouse-event";
import toJson from "enzyme-to-json";

describe("ListDraggable", function() {
  const elements = [
    {
      key: 1,
      text: 'element1',
      isRemovable: true
    },
    {
      key: 2,
      text: 'element2',
      isRemovable: true
    },
    {
      key: 3,
      text: 'element3',
      isRemovable: true
    },
  ];
  const onElementDeleteSpy = jest.fn();
  const onElementSortSpy = jest.fn();
  const renderedComponent = mount(
    <ListDraggable elements={elements}
                   listElementTemplate={ListElementClosable}
                   onElementDelete={onElementDeleteSpy}
                   onElementSort={onElementSortSpy}
  />);

  it('renders self and inner components', () => {
    expect(renderedComponent.instance()).toBeInstanceOf(ListDraggable);
    expect(renderedComponent.props().elements).toEqual(elements);
    expect(renderedComponent.props().listElementTemplate).toEqual(ListElementClosable);
    expect(renderedComponent.props().onElementDelete).toEqual(onElementDeleteSpy);
    expect(renderedComponent.props().onElementMove).toEqual(onElementSortSpy);
    elements.forEach((element, index) => {
      expect(renderedComponent.find(`ListElementClosable#le-${index}`).instance()).toBeInstanceOf(ListElementClosable);
      expect(renderedComponent.find(`ListElementClosable#le-${index}`).props().onElementNodeCreate).toEqual(renderedComponent.instance().handleElementNodeCreate);
      expect(renderedComponent.find(`li#le-${index}`).props().onMouseDown).toEqual(renderedComponent.find(`ListElementClosable#le-${index}`).instance().handleMouseDown);
      expect(renderedComponent.find(`li#le-${index} > div > button`).props().onClick).toEqual(renderedComponent.instance().handleElementDelete);
      expect(renderedComponent.find(`li#le-${index} > div > span`).text()).toEqual(element.text);
    });
  });

  it('input actions are work fine', () => {
    // Указываем высоту элементов, координаты и бордеры вручную,
    // так как getComputedStyle в среде JSDOM возвращает пустые строки вместо значений
    const elementHeights = [
      '55.375px',
      '55.375px',
      '55.375px'
    ];
    elementHeights.forEach((height, index) => {
      renderedComponent.find('li#le-' + index).instance().style.top = '0px';
      renderedComponent.find('li#le-' + index).instance().style.height = height;
      renderedComponent.find('li#le-' + index).instance().style.border = '1px';
    });

    renderedComponent.find('li#le-0').simulate('mousedown', { clientY: 1 });
    simulateMouseMove(1, 'down', 120);
    dispatchEvent(window.document.documentElement, getCustomMouseEvent("mouseup"));
    expect(onElementSortSpy).toBeCalledWith(0, 2);

    renderedComponent.find('li#le-1 > div > button').simulate('click');
    expect(onElementDeleteSpy).toBeCalledWith(2);
  });

  it('the snapshot and the rendered component are the same', () => {
    expect(toJson(renderedComponent)).toMatchSnapshot();
  });
});
