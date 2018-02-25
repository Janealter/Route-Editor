import React, {Component} from 'react';
import {YMaps, GeoObject, Placemark} from 'react-yandex-maps';
import MapResponsive from '../MapResponsive';
import 'bootstrap/dist/css/bootstrap.css';
import PropTypes from "prop-types";

class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapInitialState: this.props.mapInitialState
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.mapInitialState.center.join(',') !== this.state.mapInitialState.center.join(',') ||
      nextProps.mapInitialState.zoom !== this.state.mapInitialState.zoom) {
      this.setState({mapInitialState: nextProps.mapInitialState});
    }
  }

  render() {
    const placemarks = this.props.waypoints.map(waypoint =>
      <Placemark key={waypoint.id}
                 geometry={{coordinates: waypoint.coordinates}}
                 options={{
                   draggable: true,
                   iconLayout: 'islands#icon',
                   iconColor: '#007bff',
                   iconImageSize: [34, 40],
                   iconImageOffset: [-3, -42],
                   zIndex: 1
                 }}
                 properties={{
                   waypointId: waypoint.id,
                   balloonContent: waypoint.name
                 }}
                 onGeometryChange={this.props.onPlacemarkGeometryChange}
      />);
    return (
      <div className="card">
        <div className="card-header">
          Map
        </div>
        <div className="card-body">
          <div className="card">
            <YMaps>
              <MapResponsive state={this.state.mapInitialState}
                             height={450}
                             instanceRef={this.props.onMapNodeCreate}
                             responsive
              >
                {placemarks}
                <GeoObject geometry={{type: 'LineString', coordinates: this.props.waypoints.map(waypoint => waypoint.coordinates)}}
                          options={{
                            zIndex: 0,
                            strokeColor: '#dc3545',
                            strokeWidth: 3
                          }}
                />
              </MapResponsive>
            </YMaps>
          </div>
        </div>
      </div>
    );
  }
}

MapContainer.propTypes = {
  mapInitialState: PropTypes.object.isRequired,
  waypoints: PropTypes.array,
  onMapNodeCreate: PropTypes.func,
  onPlacemarkGeometryChange: PropTypes.func
};

export default MapContainer;
