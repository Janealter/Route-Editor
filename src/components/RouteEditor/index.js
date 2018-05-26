import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-grid.css';
import './style.scss';
import WaypointContainer from '../WaypointContainer';
import MapContainer from '../MapContainer';
import PropTypes from "prop-types";

const coords = new Map();
coords.set('Moscow', [55.76, 37.64]);

class RouteEditor extends Component {
  constructor (props) {
    super(props);
    this.handleWaypointsSort = this.handleWaypointsSort.bind(this);
    this.handleWaypointDelete = this.handleWaypointDelete.bind(this);
    this.handleWaypointAdd = this.handleWaypointAdd.bind(this);
    this.handleMapNodeCreate = this.handleMapNodeCreate.bind(this);
    this.handlePlacemarkGeometryChange = this.handlePlacemarkGeometryChange.bind(this);
    this.state = {
      data: {
        waypoints: Array.isArray(this.props.waypoints) ? this.props.waypoints : []
      }
    };
    this.nextWaypointId = this.state.data.waypoints.length + 1;
  }

  componentWillMount() {
    if (this.props.subscribersStorage instanceof Set) {
      this.props.subscribersStorage.add(this);
    }
  }

  handleWaypointsSort(waypoints) {
    const state = this.cloneState();
    state.data.waypoints = waypoints;
    this.setState(state);
  }

  handleWaypointDelete(id) {
    const state = this.cloneState();
    state.data.waypoints = state.data.waypoints.filter(waypoint => waypoint.id !== id);
    this.setState(state);
  }

  // Во время теста почему-то не вместо mapNode передается null (карта не инициализируется),
  // поэтому ставим координаты по-умолчанию
  handleWaypointAdd(name) {
    const state = this.cloneState();
    state.data.waypoints.push({
      id: this.nextWaypointId,
      name: name,
      coordinates: this.mapNode ? this.mapNode.getCenter() : [1, 1]
    });
    this.nextWaypointId++;
    this.setState(state);
  }

  handleMapNodeCreate(mapNode) {
    if (mapNode !== null) {
      this.mapNode = mapNode;
    }
  }

  handlePlacemarkGeometryChange(evt) {
    const state = this.cloneState();
    const waypointId = evt.get('target').properties.get('waypointId');
    const newCoordinates = evt.originalEvent.originalEvent.originalEvent.newCoordinates;
    state.data.waypoints.some((waypoint, index) => {
      if (waypoint.id === waypointId) {
        waypoint.coordinates = newCoordinates;
        return true;
      }
      return false;
    });
    this.setState(state);
  }

  cloneState() {
    const state = {};
    Object.assign(state, this.state);
    return state;
  }

  nextWaypointId = 0;
  mapNode = null;

  render() {
    return (
      <div className="app container">
        <div className="card">
          <div className="card-header text-center">
            {this.props.title}
          </div>
          <div className="card-body">
            <div className="row app__container">
              <div className="col-md-6 col-sm-12 app__container__waypoint-container">
                <WaypointContainer className="div"
                                   waypoints={this.state.data.waypoints.slice()}
                                   onWaypointSort={this.handleWaypointsSort}
                                   onWaypointDelete={this.handleWaypointDelete}
                                   onWaypointAdd={this.handleWaypointAdd}
                />
              </div>
              <div className="col-md-6 col-sm-12 app__container__map-container">
                <MapContainer mapInitialState={{
                  center: coords.get('Moscow'),
                  zoom: 10
                }}
                              waypoints={this.state.data.waypoints.slice()}
                              onMapNodeCreate={this.handleMapNodeCreate}
                              onPlacemarkGeometryChange={this.handlePlacemarkGeometryChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

RouteEditor.propTypes = {
  waypoints: PropTypes.array.isRequired,
  title: PropTypes.string,
  subscribersStorage: PropTypes.instanceOf(Set)
};

export default RouteEditor;
