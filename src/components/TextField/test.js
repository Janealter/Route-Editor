import React from 'react';
import TextField from './index';
import { shallow } from 'enzyme';
import { KeyCode } from "../../lib/const";

describe("TextField", function() {

  const onKeyDownSpy = jest.fn();
  const renderedComponent = shallow(
    <TextField name="testTextField"
               value="testValue"
               placeholder="testPlaceholder"
               minLength="3"
               maxLength="30"
               onKeyDown={onKeyDownSpy}
    />
  );
  //console.log(renderedComponent.debug());
  const inputWrapper = renderedComponent.find('input');

  it('renders without crashing', () => {
    expect(renderedComponent.instance()).toBeInstanceOf(TextField);
    expect(inputWrapper.props().value).toBe('testValue');
    expect(inputWrapper.props().placeholder).toBe('testPlaceholder');
    expect(inputWrapper.props().minLength).toBe('3');
    expect(inputWrapper.props().maxLength).toBe('30');
    expect(inputWrapper.props().onKeyDown).toBeDefined();
  });

  it('input actions are work fine', () => {
    const keyDownEventProps = {keyCode: KeyCode.ENTER, target: {value: 'testValue'}};
    inputWrapper.simulate('keydown', keyDownEventProps);
    expect(onKeyDownSpy).toBeCalledWith(keyDownEventProps);
  });
});
