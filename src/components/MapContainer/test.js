import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import MapContainer from "./index";
import waypoints from '../../waypoints.json';

describe('MapContainer', function () {
  const mapInitialState = { center: [50, 50], zoom: 10 };
  const onMapNodeCreateSpy = jest.fn();
  const onPlacemarkGeometryChangeSpy = jest.fn();
  const renderedComponent = shallow(
    <MapContainer mapInitialState={mapInitialState}
                  waypoints={waypoints}
                  onMapNodeCreate={onMapNodeCreateSpy}
                  onPlacemarkGeometryChange={onPlacemarkGeometryChangeSpy}
    />
  );

  it('renders self', () => {
    expect(renderedComponent.instance()).toBeInstanceOf(MapContainer);
  });

  it('changes state when receiving changed props', () => {
    renderedComponent.setProps({mapInitialState: {center: [45, 45], zoom: 8}});
    expect(renderedComponent.state().mapInitialState).toEqual({center: [45, 45], zoom: 8});
  });

  it('not changes state when receiving not changed props', () => {
    renderedComponent.setProps({mapInitialState: mapInitialState});
    expect(renderedComponent.state().mapInitialState).toEqual(mapInitialState);
  });

  it('the snapshot and the rendered component are the same', () => {
    expect(toJson(renderedComponent)).toMatchSnapshot();
  });
});