import React from 'react';
import WaypointContainer from './index';
import { shallow } from 'enzyme';
import { KeyCode } from "../../lib/const";
import toJson from "enzyme-to-json";

describe("WaypointContainer", function() {
  const onWaypointSortSpy = jest.fn();
  const onWaypointDeleteSpy = jest.fn();
  const onWaypointAddSpy = jest.fn();
  const waypoints = [
    {
      id: 1,
      name: 'waypoint 1',
      coordinates: [55.768237, 37.5931097]
    },
    {
      id: 2,
      name: 'waypoint 2',
      coordinates: [55.7811245, 37.4930676]
    },
    {
      id: 3,
      name: 'waypoint 3',
      coordinates: [55.792354, 37.6348678]
    }
  ];
  const waypointsAfterSorting = [
    {
      id: 2,
      name: 'waypoint 2',
      coordinates: [55.7811245, 37.4930676]
    },
    {
      id: 3,
      name: 'waypoint 3',
      coordinates: [55.792354, 37.6348678]
    },
    {
      id: 1,
      name: 'waypoint 1',
      coordinates: [55.768237, 37.5931097]
    }
  ];
  const elements = [
    {
      key: 1,
      text: 'waypoint 1',
      isRemovable: true
    },
    {
      key: 2,
      text: 'waypoint 2',
      isRemovable: true
    },
    {
      key: 3,
      text: 'waypoint 3',
      isRemovable: true
    }
  ];
  const renderedComponent = shallow(
    <WaypointContainer waypoints={waypoints}
                       onWaypointSort={onWaypointSortSpy}
                       onWaypointAdd={onWaypointAddSpy}
                       onWaypointDelete={onWaypointDeleteSpy}
    />);

  it('renders self and inner components', () => {
    expect(renderedComponent.instance()).toBeInstanceOf(WaypointContainer);
    expect(renderedComponent.instance().props.waypoints).toEqual(waypoints);
    expect(renderedComponent.instance().props.onWaypointSort).toEqual(onWaypointSortSpy);
    expect(renderedComponent.instance().props.onWaypointAdd).toEqual(onWaypointAddSpy);
    expect(renderedComponent.instance().props.onWaypointDelete).toEqual(onWaypointDeleteSpy);
    expect(renderedComponent.find('TextField').props().onKeyDown).toEqual(renderedComponent.instance().handleWaypointAdd);
    expect(renderedComponent.find('ListDraggable').props().elements).toEqual(elements);
    expect(renderedComponent.find('ListDraggable').props().onElementSort).toEqual(renderedComponent.instance().handleWaypointSort);
    expect(renderedComponent.find('ListDraggable').props().onElementDelete).toEqual(renderedComponent.instance().handleWaypointDelete);
  });

  it('handlers are work fine', () => {
    renderedComponent.instance().handleWaypointSort(0, 3);
    expect(onWaypointSortSpy).toBeCalledWith(waypointsAfterSorting);

    renderedComponent.instance().handleWaypointAdd({
      preventDefault() {},
      keyCode: KeyCode.ENTER,
      target: { value: 'waypoint 4' }
    });
    expect(onWaypointAddSpy).toBeCalledWith('waypoint 4');

    renderedComponent.instance().handleWaypointDelete(3);
    expect(onWaypointDeleteSpy).toBeCalledWith(3);
  });

  it('the snapshot and the rendered component are the same', () => {
    expect(toJson(renderedComponent)).toMatchSnapshot();
  });
});

