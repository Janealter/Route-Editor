import React from 'react';
import { mount } from 'enzyme';
import ElementClosable from './index';
import { dispatchEvent, getCustomMouseEvent } from "../../lib/custom-mouse-event";

describe("ListElement", function() {
  const onMouseDownSpy = jest.fn();
  const onCloseButtonClickSpy = jest.fn();
  const onElementNodeCreateSpy = jest.fn();
  const renderedComponent = mount(
    <ElementClosable id="le-0"
                         text="testListElement"
                         onMouseDown={onMouseDownSpy}
                         onCloseButtonClick={onCloseButtonClickSpy}
                         onElementNodeCreate={onElementNodeCreateSpy}
                         isClosable
                         isHighlightable
    />
  );
  it('renders without crashing', () => {
    const liWrapper = renderedComponent.find('li');
    const buttonWrapper = renderedComponent.find('button');
    expect(renderedComponent.instance()).toBeInstanceOf(ElementClosable);
    expect(renderedComponent.props().onMouseDown).toEqual(onMouseDownSpy);
    expect(renderedComponent.props().onCloseButtonClick).toEqual(onCloseButtonClickSpy);
    expect(renderedComponent.props().onElementNodeCreate).toEqual(onElementNodeCreateSpy);
    expect(renderedComponent.props().isClosable).toBe(true);
    expect(renderedComponent.props().isHighlightable).toBe(true);

    expect(liWrapper.props().id).toBe('le-0');
    expect(liWrapper.props().onMouseDown).toEqual(renderedComponent.instance().handleMouseDown);
    expect(renderedComponent.find('.list-element__text').text()).toBe('testListElement');
    expect(buttonWrapper.text()).toBe('x');
    expect(buttonWrapper.props().id).toBe('le-0');
    expect(buttonWrapper.props().onClick).toEqual(onCloseButtonClickSpy);

  });

  it('input actions are work fine', () => {
    const buttonWrapper = renderedComponent.find('button');

    expect(onElementNodeCreateSpy).toBeCalled();

    renderedComponent.find('li').simulate('mousedown');
    expect(onMouseDownSpy).toBeCalled();
    expect(renderedComponent.find('li').hasClass('list-element_highlighted')).toBe(true);

    dispatchEvent(window.document.documentElement, getCustomMouseEvent("mouseup"));

    buttonWrapper.simulate('click');
    expect(onCloseButtonClickSpy).toBeCalled();

    expect(renderedComponent.find('li').hasClass('list-element_highlighted')).toBe(false);
  });
});

