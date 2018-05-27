import React, { Component } from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-grid.css';
import './style.scss';
import EditableList from '../../components/EditableList';
import RouteMap from '../../components/RouteMap';
import PropTypes from "prop-types";
import * as waypointSelectors from "../../store/waypoints/reducer";
import * as waypointActions from "../../store/waypoints/actions";

const coords = new Map();
coords.set('Moscow', [55.76, 37.64]);

class RouteEditor extends Component {
  constructor (props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    this.props.dispatch(waypointActions.fetchWaypoints());
  }

  handleWaypointMove(oldIndex, newIndex) {
    this.props.dispatch(waypointActions.moveWaypoint(oldIndex, newIndex));
  }

  handleWaypointDelete(id) {
    this.props.dispatch(waypointActions.deleteWaypoint(id));
  }

  // Во время теста почему-то не вместо mapNode передается null (карта не инициализируется),
  // поэтому ставим координаты по-умолчанию
  handleWaypointAdd(name) {
    const coordinates = this.mapNode ? this.mapNode.getCenter() : [1, 1];
    this.props.dispatch(waypointActions.addWaypoint(name, coordinates));
  }

  handlePlacemarkDragEnd(id, coordinates) {
    this.props.dispatch(waypointActions.changeWaypointCoordinates(id, coordinates));
  }

  handleMapNodeCreated(mapNode) {
    if (mapNode !== null) {
      this.mapNode = mapNode;
    }
  }

  mapNode = null;

  render() {
    return (
      <div className="app container">
        <div className="card">
          <div className="card-header text-center">
            {this.props.title ? this.props.title : 'Route Editor'}
          </div>
          <div className="card-body">
            <div className="row app__container">
              <div className="col-md-6 col-sm-12 app__container__waypoint-container">
                <EditableList className="div"
                              elementsIDArray={this.props.waypointsIDArray}
                              elementsByID={this.props.waypointsByID}
                              onElementMove={this.handleWaypointMove}
                              onElementDelete={this.handleWaypointDelete}
                              onElementAdd={this.handleWaypointAdd}
                />
              </div>
              <div className="col-md-6 col-sm-12 app__container__map-container">
                <RouteMap mapInitialState={{
                  center: coords.get('Moscow'),
                  zoom: 10
                }}
                          placemarks={this.props.waypoints}
                          onMapNodeCreated={this.handleMapNodeCreated}
                          onPlacemarkDragEnd={this.handlePlacemarkDragEnd}
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
  title: PropTypes.string
};

const mapStateToProps = state => {
  return {
    waypoints: waypointSelectors.getWaypointsArray(state),
    waypointsByID: waypointSelectors.getWaypointsByID(state),
    waypointsIDArray: waypointSelectors.getWaypointsIDArray(state)
  };
};

export default connect(mapStateToProps)(RouteEditor);
