import React, { Component } from 'react';
import autoBind from 'react-autobind';
import TextField from '../TextField/index';
import ListDraggable from '../ListDraggable/index';
import ElementClosable from "../ElementClosable/index";
import PropTypes from 'prop-types';

class EditableList extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  handleElementMove(oldIndex, newIndex) {
    if (typeof this.props.onElementMove === 'function') {
      this.props.onElementMove(oldIndex, newIndex);
    }
  }

  handleElementDelete(id) {
    if (typeof this.props.onElementDelete === 'function') {
      this.props.onElementDelete(id);
    }
  }

  handleElementAdd(name) {
    if (name.length < 3) {
      return false;
    }
    if (typeof this.props.onElementAdd === 'function') {
      this.props.onElementAdd(name);
    }
  }

  renderName (id) {
    return (
      <span className="list-element__text">{this.props.elementsByID[id].name}</span>
    );
  }

  renderRow (index) {
    return (
      <ElementClosable key={this.props.elementsIDArray[index]}
                       dataKey={this.props.elementsIDArray[index]}
                       render={this.renderName}
                       onCloseButtonClick={this.handleElementDelete}
                       isClosable
      />
    );
  }

  render() {
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
                       onEnterKeyDown={this.handleElementAdd}/>
          </div>
            <ListDraggable elementsIDArray={this.props.elementsIDArray}
                           renderRow={this.renderRow}
                           onElementSort={this.handleElementMove}/>
        </div>
      </div>
    );
  }
}

EditableList.propTypes = {
  elementsIDArray: PropTypes.arrayOf(PropTypes.number).isRequired,
  elementsByID: PropTypes.object.isRequired,
  onElementAdd: PropTypes.func,
  onElementDelete: PropTypes.func,
  onElementMove: PropTypes.func
};

export default EditableList;
