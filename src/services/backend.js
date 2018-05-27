import waypoints from '../waypoints.json';

/**
 * Backend emulator
 */

class Backend {
  static getWaypoints() {
    return waypoints;
  }

  static addWaypoint(waypoint) {
    const id = Math.random();
    return id;
  }
}

export default Backend;
