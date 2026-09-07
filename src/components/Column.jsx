import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import OutsideClickHandler from 'react-outside-click-handler';
import CheckboxMarkedCircleOutlineIcon from 'mdi-react/CheckboxMarkedCircleOutlineIcon';
import CheckboxMarkedCircleIcon from 'mdi-react/CheckboxMarkedCircleIcon';
import ProgressCheckIcon from 'mdi-react/ProgressCheckIcon';
import Card from './Card';

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
  const columnIconProps = {
    size: 24,
    color: theme.accent,
    style: { marginBottom: '8px' },
  };

  const isEditingHeader = isEditingId === column.title;

  return (
    <div>
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
            {column?.newTitle || column.title}
          </div>
        )}

        {colIndex === 0 && <CheckboxMarkedCircleOutlineIcon {...columnIconProps} />}
        {colIndex === 1 && <ProgressCheckIcon {...columnIconProps} />}
        {colIndex === 2 && <CheckboxMarkedCircleIcon {...columnIconProps} />}
      </div>

      <Droppable droppableId={column.title}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              borderColor: theme.columnBorderColor,
              borderWidth: snapshot.isDraggingOver ? '2px' : 0,
              backgroundColor: theme.columnBgColor,
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

