import React from 'react';
import PlusIcon from 'mdi-react/PlusIcon';
import LabelMultipleIcon from 'mdi-react/LabelMultipleIcon';
import CogIcon from 'mdi-react/CogIcon';
import NotificationClearAllIcon from 'mdi-react/NotificationClearAllIcon';

export function ActionButtons({
  theme,
  onClearAllDone,
  onToggleInput,
  onToggleLabels,
  onOpenSettings,
  inputExpanded,
  labelsListExpanded,
  showSettings,
}) {
  return (
    <div className="toolbar-actions">
      <div
        className={`toolbar-btn ${inputExpanded ? 'toolbar-btn-active' : ''}`}
        onClick={onToggleInput}
        title="Add task (Space)"
      >
        <PlusIcon color={theme.accent} size={18} />
      </div>
      <div
        className={`toolbar-btn ${labelsListExpanded ? 'toolbar-btn-active' : ''}`}
        onClick={onToggleLabels}
        title="Manage labels (L)"
      >
        <LabelMultipleIcon color={theme.accent} size={18} />
      </div>
      <div
        className={`toolbar-btn ${showSettings ? 'toolbar-btn-active' : ''}`}
        onClick={onOpenSettings}
        title="Settings (S)"
      >
        <CogIcon color={theme.accent} size={18} />
      </div>
      <div
        className="toolbar-btn toolbar-btn-danger"
        onClick={onClearAllDone}
        title="Clear all done tasks"
      >
        <NotificationClearAllIcon color={theme.accent} size={18} />
      </div>
    </div>
  );
}

export default ActionButtons;
