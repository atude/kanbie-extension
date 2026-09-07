import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import DeleteForeverIcon from 'mdi-react/DeleteForeverIcon';

export function TrashDroppable({ theme }) {
  return (
    <Droppable droppableId="trash">
      {(provided, snapshot) => (
        <div className="droppable-trash-parent">
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="droppable-trash"
          />
          <div
            style={{
              background: snapshot.isDraggingOver ? theme.delActiveCol : theme.delCol,
              width: snapshot.isDraggingOver ? '200px' : '20px',
              height: snapshot.isDraggingOver ? '200px' : '23px',
            }}
            className="droppable-trash-placeholder"
          >
            <DeleteForeverIcon color={theme.accent} size={18} className="delete-icon" />
            <span className={`delete-me-text ${snapshot.isDraggingOver ? 'transitioner' : ''}`}>
              Remove task
            </span>
          </div>
        </div>
      )}
    </Droppable>
  );
}

export default TrashDroppable;
