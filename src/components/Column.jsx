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
  isEditingId,
  setEditingId,
  inputText,
  setInputText,
  onKeypressEditHeader,
  saveAndResetEditingHeader,
  onStartEditingCard,
  onSaveEditingCard,
  onKeypressEditCard,
  currLabels,
  removeCurrLabel,
  addCurrLabel,
  currDateAlarm,
  currTimeAlarm,
  clearCurrAlarm,
  addDateToCurrAlarm,
  addTimeToCurrAlarm,
  labels,
  alarms,
  theme,
}) {
  const isEditingHeader = isEditingId === column.title;
  const IconComponent = columnIcons[colIndex] || CircleOutlineIcon;
  const itemCount = column.items.length;

  return (
    <div className="column-wrapper" style={{ backgroundColor: theme.columnBgColor }}>
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
            onDoubleClick={() => {
              setInputText(column.newTitle || column.title);
              setEditingId(column.title);
            }}
          >
            <span className="column-icon">
              <IconComponent size={15} color={theme.accentColoredBright} />
            </span>
            <span>{column?.newTitle || column.title}</span>
            <span className="column-count">{itemCount}</span>
          </div>
        )}
      </div>

      <Droppable droppableId={column.title}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              borderColor: theme.columnBorderColor,
              borderWidth: snapshot.isDraggingOver ? '2px' : 0,
            }}
            className="droppable-container column-container"
          >
            {column.items.map((item, i) => (
              <Card
                key={item.id}
                item={item}
                index={i}
                isEditing={isEditingId === item.id}
                onStartEditing={onStartEditingCard}
                onSaveEditing={onSaveEditingCard}
                inputText={inputText}
                setInputText={setInputText}
                onKeypressEditCard={onKeypressEditCard}
                currLabels={currLabels}
                removeCurrLabel={removeCurrLabel}
                addCurrLabel={addCurrLabel}
                currDateAlarm={currDateAlarm}
                currTimeAlarm={currTimeAlarm}
                clearCurrAlarm={clearCurrAlarm}
                addDateToCurrAlarm={addDateToCurrAlarm}
                addTimeToCurrAlarm={addTimeToCurrAlarm}
                labels={labels}
                alarms={alarms}
                theme={theme}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default Column;
