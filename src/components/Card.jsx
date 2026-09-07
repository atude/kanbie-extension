import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import BellRingIcon from 'mdi-react/BellRingIcon';
import moment from 'moment';
import { labelRegex } from '../utils/generic';

export function Card({
  item,
  index,
  onStartEditing,
  labels,
  alarms,
  theme,
}) {
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
