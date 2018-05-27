import React, {Component} from 'react';
import autoBind from 'react-autobind';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.css';
import {KeyCode} from "../../lib/const";

class TextField extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  handleKeyDown(evt) {
    const value = evt.target.value;

    switch (evt.keyCode) {
      case KeyCode.ENTER:
        evt.preventDefault();
        if (typeof this.props.onEnterKeyDown === 'function') {
          evt.target.value = '';
          this.props.onEnterKeyDown(value);
        }
        break;
      case KeyCode.ESC:
        evt.preventDefault();
        evt.target.value = '';
        if (typeof this.props.onEscKeyDown === 'function') {
          this.props.onEscKeyDown(evt.target);
        }
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <input type="text"
             className="form-control"
             name={this.props.name}
             value={this.props.value}
             minLength={this.props.minLength}
             maxLength={this.props.maxLength}
             placeholder={this.props.placeholder}
             onKeyDown={this.handleKeyDown}>
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
  onEnterKeyDown: PropTypes.func,
  onEscKeyDown: PropTypes.func
};

export default TextField;
