import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import OutsideClickHandler from 'react-outside-click-handler';
import CloseCircleIcon from 'mdi-react/CloseCircleIcon';
import BellRingIcon from 'mdi-react/BellRingIcon';
import moment from 'moment';
import { MentionsInput, Mention } from './MentionsInput';
import { labelRegex } from '../utils/generic';
import { allDays, allTimes } from '../utils/time';

export function Card({
  item,
  index,
  isEditing,
  onStartEditing,
  onSaveEditing,
  inputText,
  setInputText,
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
  if (isEditing) {
    return (
      <OutsideClickHandler onOutsideClick={onSaveEditing}>
        <div className="input-container-inplace">
          <MentionsInput
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Edit task..."
            className="mentions input-add-inplace"
            onKeyDown={onKeypressEditCard}
            autoFocus
          >
            <Mention
              trigger="#"
              data={labels.filter((label) => !currLabels[label.id])}
              displayTransform={() => ''}
              onAdd={(id, display) => addCurrLabel(id, display)}
            />
            <Mention
              trigger="t:"
              data={allTimes}
              onAdd={(id, display) => addTimeToCurrAlarm(id, display)}
            />
            <Mention
              trigger="d:"
              data={allDays}
              onAdd={(id, display) => addDateToCurrAlarm(id, display)}
            />
          </MentionsInput>

          {!!Object.values(currLabels).length && (
            <div className="curr-labels-container">
              {Object.keys(currLabels).map((keyLabel) => {
                const labelObj = labels.find((label) => label.id === keyLabel);
                return (
                  <span
                    className="curr-label-item"
                    style={{ backgroundColor: labelObj?.color }}
                    key={keyLabel}
                  >
                    {currLabels[keyLabel]}
                    <CloseCircleIcon
                      size={14}
                      onClick={() => removeCurrLabel(keyLabel)}
                      className="remove-label-icon"
                    />
                  </span>
                );
              })}
            </div>
          )}

          {currDateAlarm && currTimeAlarm && (
            <div className="curr-labels-container curr-time-container">
              <span className="curr-label-item">
                <BellRingIcon size={14} style={{ marginRight: '6px' }} />
                {moment(`${currDateAlarm} ${currTimeAlarm}`, 'DD/MM/YYYY HH:mm').format(
                  'dddd DD/MM, h:mmA'
                )}
                <CloseCircleIcon
                  size={14}
                  onClick={clearCurrAlarm}
                  className="remove-label-icon"
                />
              </span>
            </div>
          )}
        </div>
      </OutsideClickHandler>
    );
  }

  // Normal draggable card view
  const filteredLabels = item.content.match(labelRegex);
  const cardAlarm = alarms[item.id];
  const dueTime = cardAlarm ? moment(cardAlarm.alarmDue) : null;

  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          style={{
            userSelect: 'none',
            backgroundColor: snapshot.isDragging ? theme.cardBgActiveCol : theme.cardBgCol,
            ...provided.draggableProps.style,
          }}
          className="draggable-card"
          onDoubleClick={() => onStartEditing(item)}
        >
          <div className="card-text">{item.content.replace(labelRegex, '')}</div>

          {filteredLabels && (
            <div className="card-label-container">
              {[...filteredLabels].reverse().map((filteredLabel) => {
                const labelId = filteredLabel.replace(labelRegex, '$2');
                const labelText = filteredLabel.replace(labelRegex, '$1');
                const matchedLabel = labels.find((label) => label.id === labelId);
                if (!matchedLabel) return null;

                return (
                  <span
                    key={filteredLabel}
                    className="card-label-item"
                    style={{
                      backgroundColor: matchedLabel.color || theme.backgroundDark,
                    }}
                  >
                    {labelText}
                  </span>
                );
              })}
            </div>
          )}

          {dueTime && (
            <div
              className="curr-labels-container curr-time-container card-time-container"
              style={{ backgroundColor: dueTime.isBefore() ? theme.delCol : theme.accentColored }}
            >
              <span className="curr-label-item">
                <BellRingIcon size={14} style={{ marginRight: '6px', flexShrink: 0 }} />
                Due {dueTime.fromNow()}
              </span>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}

export default Card;
