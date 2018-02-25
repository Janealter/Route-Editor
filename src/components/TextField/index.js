import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.css';

class TextField extends Component {
  render() {
    return (
      <input type="text"
             className="form-control"
             name={this.props.name}
             value={this.props.value}
             minLength={this.props.minLength}
             maxLength={this.props.maxLength}
             placeholder={this.props.placeholder}
             onKeyDown={this.props.onKeyDown}>
      </input>
    );
  }
}

TextField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  minLength: PropTypes.string,
  maxLength: PropTypes.string,
  onKeyDown: PropTypes.func
};

export default TextField;
