import React from 'react';
import { shallow } from 'enzyme';
import MapContainer from "./index";
import Waypoints from '../../waypoints.json';

describe('MapContainer', function () {
  const mapInitialState = { center: [50, 50], zoom: 10 };
  const onMapNodeCreateSpy = jest.fn();
  const onPlacemarkGeometryChangeSpy = jest.fn();
  const renderedComponent = shallow(
    <MapContainer mapInitialState={mapInitialState}
                  waypoints={Waypoints}
                  onMapNodeCreate={onMapNodeCreateSpy}
                  onPlacemarkGeometryChange={onPlacemarkGeometryChangeSpy}
    />
  );

  //console.log(renderedComponent.debug());

  it('renders self', () => {
    expect(renderedComponent.instance()).toBeInstanceOf(MapContainer);
  });

  /*it('handlers are work fine', () => {
    //expect(onMapNodeCreateSpy).toBeCalled();
  });*/

  it('changes state when receiving changed props', () => {
    renderedComponent.setProps({mapInitialState: {center: [45, 45], zoom: 8}});
    expect(renderedComponent.state().mapInitialState).toEqual({center: [45, 45], zoom: 8});
  });

  it('not changes state when receiving not changed props', () => {
    renderedComponent.setProps({mapInitialState: mapInitialState});
    expect(renderedComponent.state().mapInitialState).toEqual(mapInitialState);
  });
});