import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ListElementClosable from './ListElementClosable';
import { clearStyleAfterDragging, startDragListElement } from "../../lib/drag";

class ListDraggable extends Component {
  constructor(props) {
    super(props);
    this.handleElementMouseDown = this.handleElementMouseDown.bind(this);
    this.handleElementMouseUp = this.handleElementMouseUp.bind(this);
    this.handleElementDelete = this.handleElementDelete.bind(this);
    this.handleElementNodeCreate = this.handleElementNodeCreate.bind(this);
  }

  handleElementMouseDown(evt) {
    // Не выполнять передвижение, если была нажата кнопка или выделен текст
    // || evt.target.localName === 'span'
    if (evt.target.localName === 'button') {
      return false;
    }

    // В начале передвижения убираем округление углов, так красивее
    this.elementNodes.forEach(elementNode => {
      elementNode.style.borderRadius = '0';
    });

    startDragListElement(evt, this.elementNodes, this.handleElementMouseUp);
  }

  handleElementMouseUp(draggableElementParameters, dragInfo) {
    // Очищаем стиль элемента, иначе у элемента останутся аттрибуты, установленые во время передвижения
    // и начальное позиционирование после обновления данных будет неправильным
    clearStyleAfterDragging(this.elementNodes);

    if (typeof this.props.onElementSort === 'function') {
      this.props.onElementSort(dragInfo.draggableElementStartIndex, dragInfo.draggableElementIndex);
    }
  }

  handleElementDelete(evt) {
    evt.preventDefault();
    // Удаляем элемент из DOM
    const id = parseInt(evt.currentTarget.id.substring(3), 10);
    this.elementNodes.splice(id, 1);
    if (typeof this.props.onElementDelete === 'function') {
      const key = this.props.elements[id].key;
      this.props.onElementDelete(key);
    }
  }

  handleElementNodeCreate(listElementNode) {
    if (listElementNode !== null) {
      this.elementNodes.push(listElementNode);
    }
  }

  elementNodes = [];

  render() {
    const ListElementTemplate = this.props.listElementTemplate || ListElementClosable;
    const elements = this.props.elements.map((element, index) =>
      <ListElementTemplate onElementNodeCreate={this.handleElementNodeCreate}
                           id={'le-' + index} key={element.key} text={element.text}
                           onMouseDown={this.handleElementMouseDown}
                           onCloseButtonClick={this.handleElementDelete}
                           isClosable={element.isRemovable}
                           isHighlightable
      />);
    return (
      <ul className="list-group">
        {elements}
      </ul>
    );
  }
}

ListDraggable.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.object).isRequired,
  listElementTemplate: PropTypes.func,
  onElementDelete: PropTypes.func,
  onElementSort: PropTypes.func
};

export default ListDraggable;
