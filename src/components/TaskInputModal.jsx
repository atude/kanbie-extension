import React, { useState, useRef, useEffect } from 'react';
import BellRingIcon from 'mdi-react/BellRingIcon';
import CalendarIcon from 'mdi-react/CalendarIcon';
import ClockOutlineIcon from 'mdi-react/ClockOutlineIcon';
import TagMultipleIcon from 'mdi-react/TagMultipleIcon';
import CloseCircleIcon from 'mdi-react/CloseCircleIcon';
import CloseIcon from 'mdi-react/CloseIcon';
import CheckIcon from 'mdi-react/CheckIcon';
import PlusIcon from 'mdi-react/PlusIcon';
import TrashCanOutlineIcon from 'mdi-react/TrashCanOutlineIcon';
import moment from 'moment';
import { v4 as uuid } from 'uuid';

import { MentionsInput, Mention } from './MentionsInput';
import { allDays, allTimes } from '../utils/time';
import { filterString } from '../utils/generic';
import { colorPanelColors } from '../constants/Colors';

export function TaskInputModal({
  inputText,
  setInputText,
  labels = [],
  setLabels,
  currLabels = {},
  addCurrLabel,
  removeCurrLabel,
  toggleCurrLabel,
  currDateAlarm,
  currTimeAlarm,
  setCurrDateAlarm,
  setCurrTimeAlarm,
  clearCurrAlarm,
  addDateToCurrAlarm,
  addTimeToCurrAlarm,
  onAddCard,
  onSaveCard,
  onDeleteCard,
  isEditing = false,
  theme,
  onClose,
}) {
  const [newLabelText, setNewLabelText] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const containerRef = useRef(null);

  const colors = theme?.panelColors || colorPanelColors;

  useEffect(() => {
    if (!newLabelColor && colors.length > 0) {
      setNewLabelColor(colors[0]);
    }
  }, [colors, newLabelColor]);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [onClose]);

  // Handle outside click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDatePreset = (daysFromNow) => {
    const targetDate = moment().add(daysFromNow, 'days').format('DD/MM/YYYY');
    if (addDateToCurrAlarm) {
      addDateToCurrAlarm(`__DATE: ${targetDate}`);
    } else if (setCurrDateAlarm) {
      setCurrDateAlarm(targetDate);
      if (!currTimeAlarm && setCurrTimeAlarm) setCurrTimeAlarm('09:00');
    }
  };

  const handleTimePreset = (timeStr24) => {
    if (addTimeToCurrAlarm) {
      addTimeToCurrAlarm(`__TIME: ${timeStr24}`);
    } else if (setCurrTimeAlarm) {
      setCurrTimeAlarm(timeStr24);
      if (!currDateAlarm && setCurrDateAlarm) setCurrDateAlarm(moment().format('DD/MM/YYYY'));
    }
  };

  const handleCustomDateChange = (e) => {
    const val = e.target.value;
    if (!val) {
      if (setCurrDateAlarm) setCurrDateAlarm(undefined);
    } else {
      const formatted = moment(val, 'YYYY-MM-DD').format('DD/MM/YYYY');
      if (addDateToCurrAlarm) {
        addDateToCurrAlarm(`__DATE: ${formatted}`);
      } else if (setCurrDateAlarm) {
        setCurrDateAlarm(formatted);
        if (!currTimeAlarm && setCurrTimeAlarm) setCurrTimeAlarm('09:00');
      }
    }
  };

  const handleCustomTimeChange = (e) => {
    const val = e.target.value;
    if (!val) {
      if (setCurrTimeAlarm) setCurrTimeAlarm(undefined);
    } else {
      if (addTimeToCurrAlarm) {
        addTimeToCurrAlarm(`__TIME: ${val}`);
      } else if (setCurrTimeAlarm) {
        setCurrTimeAlarm(val);
        if (!currDateAlarm && setCurrDateAlarm) setCurrDateAlarm(moment().format('DD/MM/YYYY'));
      }
    }
  };

  const handleCreateLabel = (e) => {
    if (e) e.preventDefault();
    const trimmed = newLabelText.trim();
    if (!trimmed || !setLabels) return;

    const chosenColor = newLabelColor || colors[Math.floor(Math.random() * colors.length)];
    const newLabel = {
      id: uuid(),
      display: trimmed,
      color: chosenColor,
    };

    setLabels((prev) => [...prev, newLabel]);
    if (toggleCurrLabel) {
      toggleCurrLabel(newLabel);
    } else if (addCurrLabel) {
      addCurrLabel(newLabel.id, newLabel.display);
      setInputText((prev) => `${prev} @[${newLabel.display}](${newLabel.id})`.trim());
    }

    setNewLabelText('');
    setShowColorPicker(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isEditing && onSaveCard) {
        onSaveCard(e);
      } else if (onAddCard) {
        onAddCard(e);
      }
    }
  };

  const dateInputValue = currDateAlarm
    ? moment(currDateAlarm, 'DD/MM/YYYY').format('YYYY-MM-DD')
    : '';

  const datePresets = [
    { label: 'Today', days: 0 },
    { label: 'Tomorrow', days: 1 },
    { label: 'In 2 Days', days: 2 },
    { label: 'Next Week', days: 7 },
  ];

  const timePresets = [
    { label: '9:00 AM', time: '09:00' },
    { label: '12:00 PM', time: '12:00' },
    { label: '3:00 PM', time: '15:00' },
    { label: '6:00 PM', time: '18:00' },
    { label: '9:00 PM', time: '21:00' },
  ];

  const isAlarmSet = Boolean(currDateAlarm && currTimeAlarm);
  const formattedAlarm = isAlarmSet
    ? moment(`${currDateAlarm} ${currTimeAlarm}`, 'DD/MM/YYYY HH:mm').format('ddd, MMM D [at] h:mm A')
    : null;

  const canSubmit = filterString(inputText).trim() !== '';

  return (
    <div className="task-modal-overlay" onClick={handleOverlayClick}>
      <div className="task-modal-container" ref={containerRef}>
        {/* Header */}
        <div className="task-modal-header">
          <div className="task-modal-title">
            <span className={`task-modal-badge ${isEditing ? 'task-modal-badge-edit' : ''}`}>
              {isEditing ? 'Edit' : 'New'}
            </span>
            <span>{isEditing ? 'Edit Task' : 'Create Task'}</span>
          </div>
          <div className="task-modal-header-actions">
            <span className="task-modal-hint">Esc to close</span>
            <button
              type="button"
              className="task-modal-close-btn"
              onClick={onClose}
              title="Close (Esc)"
            >
              <CloseIcon size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="task-modal-body">
          {/* Main Task Description Input */}
          <div className="task-modal-input-section">
            <MentionsInput
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="What needs to be done? (#label, t:time, d:day)"
              className="mentions task-modal-textarea"
              onKeyDown={handleKeyDown}
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
          </div>

          {/* Settings Grid: Date/Time & Labels */}
          <div className="task-modal-settings-grid">
            {/* Date & Time Setting */}
            <div className="task-modal-card">
              <div className="task-modal-card-header">
                <div className="task-modal-card-title">
                  <CalendarIcon size={16} className="task-modal-card-icon" />
                  <span>Due Date & Time</span>
                </div>
                {isAlarmSet && (
                  <button
                    type="button"
                    className="task-modal-clear-alarm-btn"
                    onClick={clearCurrAlarm}
                    title="Clear alarm"
                  >
                    <CloseCircleIcon size={14} />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              {isAlarmSet && (
                <div className="task-modal-alarm-pill">
                  <BellRingIcon size={15} />
                  <span>Due: {formattedAlarm}</span>
                </div>
              )}

              {/* Date Presets and Picker */}
              <div className="task-modal-field-group">
                <label className="task-modal-field-label">Date</label>
                <div className="task-modal-chips-row">
                  {datePresets.map((preset) => {
                    const presetDate = moment().add(preset.days, 'days').format('DD/MM/YYYY');
                    const isSelected = currDateAlarm === presetDate;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        className={`task-modal-chip ${isSelected ? 'task-modal-chip-active' : ''}`}
                        onClick={() => handleDatePreset(preset.days)}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                  <input
                    type="date"
                    className="task-modal-datetime-input"
                    value={dateInputValue}
                    onChange={handleCustomDateChange}
                    title="Select custom date"
                  />
                </div>
              </div>

              {/* Time Presets and Picker */}
              <div className="task-modal-field-group">
                <label className="task-modal-field-label">
                  <ClockOutlineIcon size={13} style={{ marginRight: '4px' }} />
                  Time
                </label>
                <div className="task-modal-chips-row">
                  {timePresets.map((preset) => {
                    const isSelected = currTimeAlarm === preset.time;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        className={`task-modal-chip ${isSelected ? 'task-modal-chip-active' : ''}`}
                        onClick={() => handleTimePreset(preset.time)}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                  <input
                    type="time"
                    className="task-modal-datetime-input"
                    value={currTimeAlarm || ''}
                    onChange={handleCustomTimeChange}
                    title="Select custom time"
                  />
                </div>
              </div>
            </div>

            {/* Label Setting */}
            <div className="task-modal-card">
              <div className="task-modal-card-header">
                <div className="task-modal-card-title">
                  <TagMultipleIcon size={16} className="task-modal-card-icon" />
                  <span>Labels</span>
                </div>
                {Object.keys(currLabels).length > 0 && (
                  <span className="task-modal-selected-count">
                    {Object.keys(currLabels).length} selected
                  </span>
                )}
              </div>

              {/* Available Labels Chips */}
              <div className="task-modal-labels-container">
                {labels.length === 0 ? (
                  <div className="task-modal-empty-hint">No labels created yet. Add one below!</div>
                ) : (
                  labels.map((label) => {
                    const isSelected = Boolean(currLabels[label.id]);
                    return (
                      <button
                        key={label.id}
                        type="button"
                        className={`task-modal-label-item ${isSelected ? 'task-modal-label-selected' : ''}`}
                        style={{
                          backgroundColor: isSelected ? label.color : `${label.color}44`,
                          borderColor: label.color,
                        }}
                        onClick={() => {
                          if (toggleCurrLabel) {
                            toggleCurrLabel(label);
                          } else if (isSelected) {
                            removeCurrLabel(label.id);
                          } else {
                            addCurrLabel(label.id, label.display);
                          }
                        }}
                        title={isSelected ? 'Click to remove label' : 'Click to add label'}
                      >
                        {isSelected && <CheckIcon size={14} className="task-modal-label-check" />}
                        <span>{label.display}</span>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Add New Label Inline */}
              <div className="task-modal-new-label-form">
                <div className="task-modal-new-label-inputs">
                  <button
                    type="button"
                    className="task-modal-color-preview-btn"
                    style={{ backgroundColor: newLabelColor || colors[0] }}
                    onClick={() => setShowColorPicker((prev) => !prev)}
                    title="Choose color"
                  />
                  <input
                    type="text"
                    className="task-modal-new-label-text"
                    placeholder="Create new label..."
                    maxLength={24}
                    value={newLabelText}
                    onChange={(e) => setNewLabelText(e.target.value.replace(/[[\]()]/g, ''))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCreateLabel();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="task-modal-add-label-btn"
                    onClick={handleCreateLabel}
                    disabled={!newLabelText.trim()}
                    title="Add Label"
                  >
                    <PlusIcon size={16} />
                  </button>
                </div>

                {showColorPicker && (
                  <div className="task-modal-color-palette">
                    {colors.map((c) => (
                      <div
                        key={c}
                        className={`task-modal-palette-swatch ${c === newLabelColor ? 'task-modal-swatch-active' : ''}`}
                        style={{ backgroundColor: c }}
                        onClick={() => {
                          setNewLabelColor(c);
                          setShowColorPicker(false);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="task-modal-footer">
          <div className="task-modal-footer-info">
            {isEditing && onDeleteCard ? (
              <button
                type="button"
                className="task-modal-delete-btn"
                onClick={onDeleteCard}
                title="Delete this task"
              >
                <TrashCanOutlineIcon size={16} />
                <span>Delete Task</span>
              </button>
            ) : (
              <span className="task-modal-shortcut-tip">
                Press <b>Enter</b> to {isEditing ? 'save' : 'create'} task &bull; <b>Shift + Enter</b> for new line
              </span>
            )}
          </div>
          <div className="task-modal-footer-actions">
            <button
              type="button"
              className="task-modal-btn task-modal-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="task-modal-btn task-modal-btn-primary"
              onClick={isEditing ? onSaveCard : onAddCard}
              disabled={!canSubmit}
            >
              {isEditing ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskInputModal;
