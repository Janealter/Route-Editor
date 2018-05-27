import React, {Component} from 'react';
import autoBind from 'react-autobind';
import {YMaps, GeoObject, Placemark} from 'react-yandex-maps';
import MapResponsive from '../MapResponsive';
import 'bootstrap/dist/css/bootstrap.css';
import PropTypes from "prop-types";

/**
 * Используется свой собственный стейт с координатами вместо Redux,
 * иначе карта тормозит при перетаскивании меток и перерисовке линий маршрута.
 */

class RouteMap extends Component {
  constructor (props) {
    super(props);
    autoBind(this);

    this.state = {
      placemarksCoordinateArray: []
    };
  }

  componentWillReceiveProps(nextProps) {
    let newPlacemarksCoordinateArray = nextProps.placemarks.map(pm => pm.coordinates);
    const setNewPlacemarksCoordinateArray = () => this.setState({placemarksCoordinateArray: newPlacemarksCoordinateArray});

    if (nextProps.placemarks.length !== this.state.placemarksCoordinateArray.length) {
      setNewPlacemarksCoordinateArray();
    } else if (newPlacemarksCoordinateArray.join(',') !== this.state.placemarksCoordinateArray.join(',')) {
      setNewPlacemarksCoordinateArray();
    }
  }

  // По завершению передвижения метки отправляем новые координаты в Redux (через родителя)
  handlePlacemarkDragEnd(evt) {
    const waypointId = evt.get('target').properties.get('waypointId');
    const newCoordinates = evt.originalEvent.target.geometry._coordinates;

    if (typeof this.props.onPlacemarkDragEnd === 'function') {
      this.props.onPlacemarkDragEnd(waypointId, newCoordinates);
    }
  }

  handlePlacemarkGeometryChange(evt) {
    const waypointIndex = evt.get('target').properties.get('waypointIndex');
    const newCoordinates = evt.originalEvent.originalEvent.originalEvent.newCoordinates;

    const newPlacemarksCoordinateArray = [...this.state.placemarksCoordinateArray];

    newPlacemarksCoordinateArray.some((coordinates, index) => {
      if (index === waypointIndex) {
        newPlacemarksCoordinateArray[index] = newCoordinates;
        return true;
      }
      return false;
    });

    // Ререндерим линию маршрута, посредством обновления стейта
    this.setState({placemarksCoordinateArray: newPlacemarksCoordinateArray});
  }

  render() {
    const placemarks = this.props.placemarks.map((placemark, index) =>
      <Placemark key={placemark.id}
                 geometry={{coordinates: placemark.coordinates}}
                 options={{
                   draggable: true,
                   iconLayout: 'islands#icon',
                   iconColor: '#007bff',
                   iconImageSize: [34, 40],
                   iconImageOffset: [-3, -42],
                   zIndex: 1
                 }}
                 properties={{
                   waypointIndex: index,
                   waypointId: placemark.id,
                   balloonContent: placemark.name
                 }}
                 onGeometryChange={this.handlePlacemarkGeometryChange}
                 onDragEnd={this.handlePlacemarkDragEnd}
      />);
    return (
      <div className="card">
        <div className="card-header">
          Map
        </div>
        <div className="card-body">
          <div className="card">
            <YMaps>
              <MapResponsive state={this.props.mapInitialState}
                             height={450}
                             instanceRef={this.props.onMapNodeCreated}
                             responsive
              >
                {placemarks}
                <GeoObject geometry={{type: 'LineString', coordinates: this.state.placemarksCoordinateArray}}
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

RouteMap.propTypes = {
  placemarks: PropTypes.arrayOf(PropTypes.object).isRequired,
  mapInitialState: PropTypes.object.isRequired,
  onPlacemarkDragEnd: PropTypes.func,
  onMapNodeCreated: PropTypes.func
};

export default RouteMap;
