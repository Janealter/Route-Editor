import waypoints from '../waypoints.json';

class Backend {
  getWaypoints() {
    return waypoints;
  }

  addWaypoint(waypoint) {
    const id = Math.random();
    return id;
  }
}

export default new Backend();
