import React, { Component } from 'react';
import autoBind from 'react-autobind';
import PropTypes from 'prop-types';
import { startDragListElement } from "../../lib/drag";

class ListDraggable extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  handleElementMouseDown(evt) {
    this.draggedElement = evt.currentTarget;

    // Добавляем listener отпускания кнопки мыши на все окно, чтобы состояние компонента менялось
    // при отпускании кнопки в любом месте, а не только над элементом
    window.addEventListener('mouseup', this.handleWindowMouseUp);
    this.draggedElement.classList.add('list-element_highlighted');

    // Не выполнять передвижение, если была нажата кнопка или выделен текст
    // || evt.target.localName === 'span'
    if (evt.target.localName === 'button') {
      return false;
    }

    // В начале передвижения убираем округление углов, так красивее
    const onElementMouseDown = (draggableElementParameters, dragInfo) => {
      dragInfo.nodes.forEach(elementNode => {
        elementNode.style.borderRadius = '0';
      });
    };

    // true четвертым аргументом - Очищаем стиль элемента, иначе у элемента останутся аттрибуты, установленые во время передвижения
    // и начальное позиционирование после обновления данных будет неправильным
    startDragListElement(evt, null, onElementMouseDown, this.handleElementMouseUp, true);
  }

  handleWindowMouseUp() {
    window.removeEventListener('mouseup', this.handleWindowMouseUp);
    this.draggedElement.classList.remove('list-element_highlighted');
  }

  handleElementMouseUp(draggableElementParameters, dragInfo) {
    if (typeof this.props.onElementSort === 'function') {
      this.props.onElementSort(dragInfo.draggableElementStartIndex, dragInfo.draggableElementIndex);
    }
  }

  renderRowFromParent (index) {
    if (typeof this.props.renderRow === 'function') {
      return (this.props.renderRow(index));
    }
  }

  renderRows() {
    return (
      this.props.elementsIDArray.map((id, index) =>
        <li id={'le-' + index}
            className={'list-element list-group-item'}
            key={id}
            onMouseDown={this.handleElementMouseDown}

        >
          {this.renderRowFromParent(index)}
        </li>
    ));
  }

  draggedElement = null;

  render() {
    return (
      <ul className="list-group">
        {this.renderRows()}
      </ul>
    );
  }
}

ListDraggable.propTypes = {
  elementsIDArray: PropTypes.arrayOf(PropTypes.number).isRequired,
  renderRow: PropTypes.func,
  onElementSort: PropTypes.func
};

export default ListDraggable;
