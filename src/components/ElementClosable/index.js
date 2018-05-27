import React, { Component } from 'react';
import autoBind from 'react-autobind';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.css';
import './style.scss';

class ElementClosable extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  handleCloseButtonClick() {
    if (typeof this.props.onCloseButtonClick === 'function') {
      this.props.onCloseButtonClick(this.props.dataKey);
    }
  }

  renderFromParent() {
    if (typeof this.props.render === 'function') {
      return (this.props.render(this.props.dataKey));
    }
  }

  render() {
    return (
        <div className="list-element__inner">
          {this.renderFromParent()}
          {this.props.isClosable ? <button
            className="list-element__button btn btn-danger btn-sm float-right"
            onClick={this.handleCloseButtonClick}>
            x
          </button> : ''}
        </div>
    );
  }
}

ElementClosable.propTypes = {
  dataKey: PropTypes.number,
  render: PropTypes.func,
  onCloseButtonClick: PropTypes.func,
  isClosable: PropTypes.bool
};

export default ElementClosable;
