import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import DeleteForeverIcon from 'mdi-react/DeleteForeverIcon';

export function TrashDroppable({ theme, isDragging }) {
  return (
    <Droppable droppableId="trash">
      {(provided, snapshot) => (
        <div
          className="droppable-trash-wrapper"
          style={{
            opacity: isDragging ? 1 : 0,
            pointerEvents: isDragging ? 'auto' : 'none',
            transition: 'opacity 0.2s ease',
          }}
        >
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              backgroundColor: snapshot.isDraggingOver ? theme.delActiveCol : theme.delCol,
            }}
            className={`droppable-trash-placeholder ${snapshot.isDraggingOver ? 'droppable-trash-active' : ''}`}
          >
            <DeleteForeverIcon color={theme.accent} size={16} className="delete-icon" />
            <span className="delete-me-text">
              {snapshot.isDraggingOver ? 'Drop to remove' : 'Remove task'}
            </span>
            <div style={{ display: 'none' }}>{provided.placeholder}</div>
          </div>
        </div>
      )}
    </Droppable>
  );
}

export default TrashDroppable;
