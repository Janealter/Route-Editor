import React, { Component } from 'react';
import ListDraggable from '../ListDraggable';
import TextField from '../TextField';
import { KeyCode } from "../../lib/const";
import PropTypes from 'prop-types';
/*import {strings} from '../../index';*/

class WaypointContainer extends Component {
  constructor(props) {
    super(props);
    this.handleWaypointSort = this.handleWaypointSort.bind(this);
    this.handleWaypointDelete = this.handleWaypointDelete.bind(this);
    this.handleWaypointAdd = this.handleWaypointAdd.bind(this);
  }

  handleWaypointSort(startIndex, finalIndex) {
    if (typeof this.props.onWaypointSort === 'function') {
      const waypoints = this.props.waypoints.slice();
      const movedWaypoint = {};
      Object.assign(movedWaypoint, waypoints[startIndex]);
      waypoints.splice(startIndex, 1);
      waypoints.splice(finalIndex, 0, movedWaypoint);
      this.props.onWaypointSort(waypoints);
    }
  }

  handleWaypointDelete(key) {
    if (typeof this.props.onWaypointDelete === 'function') {
      // key == id
      this.props.onWaypointDelete(key);
    }
  }

  handleWaypointAdd(evt) {
    if (evt.keyCode === KeyCode.ENTER) {
      evt.preventDefault();
      const name = evt.target.value;
      if (name.length < 3) {
        return false;
      }
      evt.target.value = '';
      if (typeof this.props.onWaypointAdd === 'function') {
        this.props.onWaypointAdd(name);
      }
    }
  }

  render() {
    const elements = this.props.waypoints.map(waypoint => {
      return {key: waypoint.id, text: waypoint.name, isRemovable: true};
    });
    return (
      <div className="waypoints-container card">
        <div className="card-header">
          Waypoint list
        </div>
        <div className="card-body">
          <div className="form-group">
            <label>New waypoint name</label>
            <TextField name="waypointName"
                       placeholder="Press enter to add a waypoint"
                       minLength="3"
                       maxLength="50"
                       onKeyDown={this.handleWaypointAdd}/>
          </div>
            <ListDraggable elements={elements} onElementSort={this.handleWaypointSort} onElementDelete={this.handleWaypointDelete}/>
        </div>
      </div>
    );
  }
}

WaypointContainer.propTypes = {
  waypoints: PropTypes.arrayOf(PropTypes.object).isRequired,
  onWaypointSort: PropTypes.func,
  onWaypointDelete: PropTypes.func,
  onWaypointAdd: PropTypes.func
};

export default WaypointContainer;
