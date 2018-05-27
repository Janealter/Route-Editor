import Immutable from 'seamless-immutable';

import * as types from './actionTypes';

const initialState = Immutable({
  waypointsArray: []
});

const reduce = (state = initialState, action = {}) => {
  switch (action.type) {
    case types.WAYPOINT_FETCHED:
      return state.merge({
        waypointsArray: action.waypointsArray
      });
    case types.WAYPOINT_ADDED:
      return state.merge({
        waypointsArray: action.waypointsArray
      });
    case types.WAYPOINT_DELETED:
      return state.merge({
        waypointsArray: action.waypointsArray
      });
    case types.WAYPOINT_MOVED:
      return state.merge({
        waypointsArray: action.waypointsArray
      });
    case types.WAYPOINT_COORDINATES_CHANGED:
      return state.merge({
        waypointsArray: action.waypointsArray
      });
    default:
      return state;
  }
};

/**
 * Селекторы
 * */

const getWaypointsArray = state => {
  return state.waypoints.waypointsArray;
};

const getWaypointsByID = state => {
  const waypointsByID = {};

  state.waypoints.waypointsArray.forEach(waypoint => {
    waypointsByID[waypoint.id] = {
      name: waypoint.name,
      coordinates: waypoint.coordinates
    };
  });
  return waypointsByID;
};

const getWaypointsIDArray = state => {
  return state.waypoints.waypointsArray.map(waypoint => waypoint.id);
};

const getWaypointsNameArray = state => {
  return state.waypoints.waypointsArray.map(waypoint => waypoint.name);
};

export default reduce;

export { getWaypointsArray, getWaypointsByID, getWaypointsIDArray, getWaypointsNameArray };
