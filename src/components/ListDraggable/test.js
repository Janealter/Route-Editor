import React from 'react';
import { mount } from 'enzyme';
import ListElementClosable from "./ListElementClosable";
import ListDraggable from "./index";
import {dispatchEvent, getCustomMouseEvent, simulateMouseMove} from "../../lib/custom-mouse-event";

describe("ListDraggable", function() {
  const elements = [
    {
      key: 1,
      element: 'element0',
      isRemovable: true
    },
    {
      key: 2,
      element: 'element1',
      isRemovable: true
    },
    {
      key: 3,
      element: 'element2',
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

    //console.log(renderedComponent.debug());
  });

  it('input actions are work fine', () => {
    renderedComponent.find('li#le-0 > div > button').simulate('click');
    expect(onElementDeleteSpy).toBeCalled();

    renderedComponent.find('li#le-0').simulate('mousedown', { clientY: 1 });
    simulateMouseMove(1, 'down', 180);
    simulateMouseMove(181, 'up', 80);
    dispatchEvent(window.document.documentElement, getCustomMouseEvent("mouseup"));
    expect(onElementSortSpy).toBeCalled();
  });
});
