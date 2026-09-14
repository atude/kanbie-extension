import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  const containerRef = useRef(null);
  const [scrollInfo, setScrollInfo] = useState({ show: false, top: 0, height: 0 });

  const updateScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight > clientHeight) {
      const height = Math.max((clientHeight / scrollHeight) * clientHeight, 24);
      const maxScroll = scrollHeight - clientHeight;
      const maxTop = clientHeight - height;
      const top = maxScroll > 0 ? (scrollTop / maxScroll) * maxTop : 0;
      setScrollInfo({ show: true, top, height });
    } else {
      setScrollInfo({ show: false, top: 0, height: 0 });
    }
  }, []);

  useEffect(() => {
    updateScroll();
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateScroll);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateScroll, column.items]);

  const handleThumbMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const startY = e.clientY;
    const el = containerRef.current;
    if (!el) return;
    const startScrollTop = el.scrollTop;
    const { scrollHeight, clientHeight } = el;
    const maxTop = clientHeight - scrollInfo.height;
    const maxScroll = scrollHeight - clientHeight;

    const onMouseMove = (moveEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const scrollDelta = maxTop > 0 ? (deltaY / maxTop) * maxScroll : 0;
      el.scrollTop = startScrollTop + scrollDelta;
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleTrackClick = (e) => {
    if (e.target !== e.currentTarget) return;
    const el = containerRef.current;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const { scrollHeight, clientHeight } = el;
    const maxTop = clientHeight - scrollInfo.height;
    const maxScroll = scrollHeight - clientHeight;
    const targetScroll = maxTop > 0 ? ((clickY - scrollInfo.height / 2) / maxTop) * maxScroll : 0;
    el.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

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
                  <IconComponent size={24} color={theme.accentColoredBright} />
                </span>
                <span>{column?.newTitle || column.title}</span>
                <span className="column-count" style={{ marginLeft: 'auto' }}>{itemCount}</span>
              </div>
            )}
          </div>

          <div className="column-content-wrapper">
            <div
              {...provided.droppableProps}
              ref={(el) => {
                provided.innerRef(el);
                containerRef.current = el;
              }}
              onScroll={updateScroll}
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

            {scrollInfo.show && (
              <div className="column-scrollbar-track" onClick={handleTrackClick}>
                <div
                  className="column-scrollbar-thumb"
                  onMouseDown={handleThumbMouseDown}
                  style={{
                    top: `${scrollInfo.top}px`,
                    height: `${scrollInfo.height}px`,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </Droppable>
  );
}

export default Column;
