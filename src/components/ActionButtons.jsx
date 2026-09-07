import React from 'react';
import NotificationClearAllIcon from 'mdi-react/NotificationClearAllIcon';
import PlusIcon from 'mdi-react/PlusIcon';
import LabelMultipleIcon from 'mdi-react/LabelMultipleIcon';
import CogIcon from 'mdi-react/CogIcon';

export function ActionButtons({
  theme,
  onClearAllDone,
  onToggleInput,
  onToggleLabels,
  onOpenSettings,
}) {
  return (
    <>
      <div
        className="droppable-container droppable-clear-all button-icon"
        onClick={onClearAllDone}
        title="Clear all done tasks"
      >
        <NotificationClearAllIcon color={theme.accent} className="delete-all-icon" />
      </div>
      <div
        className="add-button-container droppable-container"
        onClick={onToggleInput}
        title="Add task"
      >
        <PlusIcon color={theme.accent} className="add-icon" />
      </div>
      <div
        className="labels-button-container droppable-container"
        onClick={onToggleLabels}
        title="Manage labels"
      >
        <LabelMultipleIcon color={theme.accent} className="add-icon" />
      </div>
      <div
        className="settings-button-container droppable-container"
        onClick={onOpenSettings}
        title="Settings"
      >
        <CogIcon color={theme.accent} className="add-icon" />
      </div>
    </>
  );
}

export default ActionButtons;

