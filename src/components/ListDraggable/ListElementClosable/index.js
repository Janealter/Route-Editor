import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.css';
import './style.scss';

class ListElementClosable extends Component {
  constructor(props) {
    super(props);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.state = {
      highlighted: false
    };
  }

  handleMouseDown(evt) {
    if (this.props.isHighlightable) {
      // Добавляем listener отпускания кнопки мыши на все окно, чтобы подсветка элемента выключалась
      // при отпускании кнопки в любом месте, а не только над элементом
      window.addEventListener('mouseup', this.handleMouseUp);
      this.setState({ highlighted: true });
    }
    if(typeof this.props.onMouseDown === 'function') {
      this.props.onMouseDown(evt);
    }
  }

  handleMouseUp() {
    window.removeEventListener('mouseup', this.handleMouseUp);
    this.setState({ highlighted: false });
  }

  render() {
    return (
      <li ref={this.props.onElementNodeCreate}
          id={this.props.id}
          className={`list-element list-group-item${this.state.highlighted ? ' list-element_highlighted' : ''}`}
          onMouseDown={this.handleMouseDown}
      >
        <div className="list-element__inner">
          <span className="list-element__text">{this.props.text}</span>
          {this.props.isClosable ? <button id={this.props.id} className="list-element__button btn btn-danger btn-sm float-right" onClick={this.props.onCloseButtonClick}>x</button> : ''}
        </div>
      </li>
    );
  }
}

ListElementClosable.propTypes = {
  id: PropTypes.string,
  text: PropTypes.string,
  isClosable: PropTypes.bool,
  isHighlightable: PropTypes.bool,
  onMouseDown: PropTypes.func,
  onCloseButtonClick: PropTypes.func,
  onElementNodeCreate: PropTypes.func
};

export default ListElementClosable;
