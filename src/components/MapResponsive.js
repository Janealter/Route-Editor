import React from 'react';
import PropTypes from "prop-types";
import {Map} from 'react-yandex-maps';

const { bool, object, oneOfType, number, string, func } = PropTypes;

class ResponsiveMap extends Map {
  static propTypes = {
    state: object,
    options: object,
    responsive: bool,
    width: oneOfType([number, string]),
    height: oneOfType([number, string]),
    instanceRef: func,
  };

  render() {
    const { width, height, responsive, children } = this.props;
    const { instance } = this.state;

    return (
      <div style={!responsive ? { width, height } : { height }} ref={this.getMapNode}>
        {instance && children}
      </div>
    );
  }
}

export default ResponsiveMap;
