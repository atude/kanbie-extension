import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import OutsideClickHandler from 'react-outside-click-handler';
import CircleOutlineIcon from 'mdi-react/CircleOutlineIcon';
import ProgressCheckIcon from 'mdi-react/ProgressCheckIcon';
import CheckCircleOutlineIcon from 'mdi-react/CheckCircleOutlineIcon';
import Card from './Card';

const columnIcons = [CircleOutlineIcon, ProgressCheckIcon, CheckCircleOutlineIcon];

export function Column({
  column,
  colIndex,
  isEditingHeader,
  onStartEditingHeader,
  inputText,
  setInputText,
  onKeypressEditHeader,
  saveAndResetEditingHeader,
  onStartEditingCard,
  labels,
  alarms,
  theme,
}) {
  const IconComponent = columnIcons[colIndex] || CircleOutlineIcon;
  const itemCount = column.items.length;

  return (
    <Droppable droppableId={column.title}>
      {(provided, snapshot) => (
        <div
          className="column-wrapper"
          style={{
            backgroundColor: theme.columnBgColor,
            borderColor: snapshot.isDraggingOver ? theme.columnBorderColor : 'transparent',
          }}
        >
          <div className="column-header-container">
            {isEditingHeader ? (
              <OutsideClickHandler onOutsideClick={saveAndResetEditingHeader}>
                <input
                  className="column-heading-editing"
                  autoFocus
                  onKeyDown={onKeypressEditHeader}
                  onChange={(e) => setInputText(e.target.value)}
                  value={inputText}
                  maxLength={14}
                />
              </OutsideClickHandler>
            ) : (
              <div
                className="column-heading"
                onDoubleClick={onStartEditingHeader}
              >
                <span className="column-icon">
                  <IconComponent size={15} color={theme.accentColoredBright} />
                </span>
                <span>{column?.newTitle || column.title}</span>
                <span className="column-count" style={{ marginLeft: 'auto' }}>{itemCount}</span>
              </div>
            )}
          </div>

          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="droppable-container column-container"
          >
            {column.items.map((item, i) => (
              <Card
                key={item.id}
                item={item}
                index={i}
                onStartEditing={onStartEditingCard}
                labels={labels}
                alarms={alarms}
                theme={theme}
              />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}

export default Column;
