import * as types from './actionTypes';
import backendService from '../../services/backend';
import * as waypointSelectors from './reducer';

const fetchWaypoints = () => {
  return (dispatch, getState) => {
    try {
      const waypointsArray = backendService.getWaypoints();
      dispatch({
        type: types.WAYPOINT_FETCHED,
        waypointsArray
      });
    } catch (e) {
      console.error(e);
    }
  }
};

const addWaypoint = (name, coordinates) => {
  return (dispatch, getState) => {
    try {
      const newWaypoint = {
        id: undefined,
        name: name,
        coordinates: coordinates
      };
      const id = backendService.addWaypoint(newWaypoint);
      const waypointsArray = waypointSelectors.getWaypointsArray(getState());
      const newWaypointsArray = [...waypointsArray];

      newWaypoint.id = id;
      newWaypointsArray.push(newWaypoint);

      dispatch({
        type: types.WAYPOINT_ADDED,
        waypointsArray: newWaypointsArray
      });
    } catch (e) {
      console.error(e);
    }
  }
};

const deleteWaypoint = (id) => {
  return (dispatch, getState) => {
    try {
      const waypointsArray = waypointSelectors.getWaypointsArray(getState());
      let newWaypointsArray = [...waypointsArray];

      newWaypointsArray = newWaypointsArray.filter(waypoint => waypoint.id !== id);

      dispatch({
        type: types.WAYPOINT_DELETED,
        waypointsArray: newWaypointsArray
      });
    } catch (e) {
      console.error(e);
    }
  }
};

const moveWaypoint = (oldIndex, newIndex) => {
  return (dispatch, getState) => {
    try {
      const waypointsArray = waypointSelectors.getWaypointsArray(getState());
      const newWaypointsArray = [...waypointsArray];
      const movedWaypoint = {};

      Object.assign(movedWaypoint, newWaypointsArray[oldIndex]);
      newWaypointsArray.splice(oldIndex, 1);
      newWaypointsArray.splice(newIndex, 0, movedWaypoint);

      dispatch({
        type: types.WAYPOINT_MOVED,
        waypointsArray: newWaypointsArray
      });
    } catch (e) {
      console.error(e);
    }
  }
};

const changeWaypointCoordinates = (id, coordinates) => {
  return (dispatch, getState) => {
    try {
      const waypointsArray = waypointSelectors.getWaypointsArray(getState());
      const newWaypointsArray = [...waypointsArray];
      const changedWaypoint = {};

      newWaypointsArray.some((waypoint, index) => {
        if (waypoint.id === id) {
          changedWaypoint.id = waypoint.id;
          changedWaypoint.name = waypoint.name;
          changedWaypoint.coordinates = coordinates;
          newWaypointsArray[index] = changedWaypoint;
          return true;
        }
        return false;
      });

      dispatch({
        type: types.WAYPOINT_COORDINATES_CHANGED,
        waypointsArray: newWaypointsArray
      });
    } catch (e) {
      console.error(e);
    }
  }
};

export { fetchWaypoints, addWaypoint, deleteWaypoint, moveWaypoint, changeWaypointCoordinates };
