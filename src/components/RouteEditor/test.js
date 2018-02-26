import React from 'react';
import { mount } from 'enzyme';
import RouteEditor from './index';
import waypoints from '../../waypoints.json';
import { KeyCode } from "../../lib/const";
import { getCustomMouseEvent, dispatchEvent, simulateMouseMove } from "../../lib/custom-mouse-event";

describe("Route Editor", function () {

  const waypointUpdatingSubscribers = new Set();
  const renderedComponent = mount(
    <RouteEditor title={'Route Editor Test'}
                 waypoints={waypoints}
                 subscribersStorage={waypointUpdatingSubscribers}
    />
  );

  it('renders self and inner components', () => {
    expect(renderedComponent.instance()).toBeInstanceOf(RouteEditor);
    expect(renderedComponent.find('div.app.container > div.card > div.card-header').text()).toBe('Route Editor Test');
    expect(renderedComponent.props().waypoints).toEqual(waypoints);
    expect(renderedComponent.state().data.waypoints).toEqual(waypoints);
    expect(renderedComponent.props().subscribersStorage).toEqual(waypointUpdatingSubscribers);

  });

  it('input actions are work fine', () => {
    renderedComponent.find('input').simulate('keydown', {keyCode: KeyCode.ENTER, target: {value: 'TestWaypoint1'}});
    renderedComponent.find('button#le-0').simulate('click');
    renderedComponent.find('button#le-4').simulate('click');
    renderedComponent.find('button#le-1').simulate('click');
    renderedComponent.find('input').simulate('keydown', {keyCode: KeyCode.ENTER, target: {value: 'TestWaypoint2'}});

    // Указываем высоту элементов, координаты и бордеры вручную,
    // так как getComputedStyle в среде JSDOM возвращает пустые строки вместо значений
    const elementHeights = [
      '55.375px',
      '122px',
      '74px',
      '55.375px',
      '55.375px',
      '55.375px'
    ];
    elementHeights.forEach((height, index) => {
      renderedComponent.find('li#le-' + index).instance().style.top = '0px';
      renderedComponent.find('li#le-' + index).instance().style.height = height;
      renderedComponent.find('li#le-' + index).instance().style.border = '1px';
    });

    // Dragging simulation
    renderedComponent.find('li#le-0').simulate('mousedown', { clientY: 1 });
    simulateMouseMove(1, 'down', 180);
    simulateMouseMove(181, 'up', 80);
    dispatchEvent(window.document.documentElement, getCustomMouseEvent("mouseup"));

    const waypointsAfterActions = [
      {
        id: 4,
        name: 'waypoint 4 very very very very very very very very very very very very very very very very very very very very very large text',
        coordinates: [55.7811245, 37.4930676]
      },
      {
        id: 2,
        name: 'waypoint 2',
        coordinates: [55.768237, 37.5931097]
      },
      {
        id: 5,
        name: 'waypoint 5 very very very very very very very large text here',
        coordinates: [55.792354, 37.6348678]
      },
      {
        id: 7,
        name: 'waypoint 7 very large text here',
        coordinates: [55.902354, 37.7348678]
      },
      {
        id: 8,
        name: 'TestWaypoint1',
        coordinates: [1, 1]
      },
      {
        id: 9,
        name: 'TestWaypoint2',
        coordinates: [1, 1]
      }
    ];

    expect(renderedComponent.state().data.waypoints).toEqual(waypointsAfterActions);
  });
});

