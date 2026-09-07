import React, { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import FormatColorFillIcon from 'mdi-react/FormatColorFillIcon';
import CloseIcon from 'mdi-react/CloseIcon';
import { v4 as uuid } from 'uuid';

export function LabelsDrawer({ labels, setLabels, onClose, theme }) {
  const [labelText, setLabelText] = useState('');

  const onAddLabel = (e) => {
    if (e.key === 'Enter' && labelText.trim() !== '') {
      const randomColor = theme.panelColors[Math.floor(Math.random() * theme.panelColors.length)];
      const newLabel = {
        id: uuid(),
        display: labelText.trim(),
        color: randomColor,
      };
      setLabels((prev) => [...prev, newLabel]);
      setLabelText('');
    }
  };

  const deleteLabel = (labelId) => {
    setLabels((prev) => prev.filter((label) => label.id !== labelId));
  };

  const shiftLabelColor = (labelId) => {
    setLabels((prev) =>
      prev.map((label) => {
        if (label.id !== labelId) return label;
        const currentIndex = theme.panelColors.indexOf(label.color);
        const nextColor = theme.panelColors[currentIndex + 1] || theme.panelColors[0];
        return { ...label, color: nextColor };
      })
    );
  };

  return (
    <OutsideClickHandler onOutsideClick={onClose}>
      <div className="labels-list">
        <input
          className="mentions__input label-input"
          type="text"
          pattern="[a-zA-Z0-9\s]+"
          placeholder="Add label..."
          maxLength={24}
          autoFocus
          value={labelText}
          onChange={(e) => setLabelText(e.target.value.replace(/[[\]()]/g, ''))}
          onKeyDown={onAddLabel}
        />
        {labels.map((label) => (
          <div className="label-item" key={label.id}>
            <span className="label-item-text" style={{ backgroundColor: label.color }}>
              {label.display}
            </span>
            <span className="label-item-action-container">
              <FormatColorFillIcon
                size={16}
                onClick={() => shiftLabelColor(label.id)}
                title="Change color"
                className="button-icon"
                style={{ color: theme.accent, opacity: 0.7 }}
              />
              <CloseIcon
                size={16}
                onClick={() => deleteLabel(label.id)}
                title="Delete label"
                className="button-icon"
                style={{ color: theme.delCol, opacity: 0.8 }}
              />
            </span>
          </div>
        ))}
      </div>
    </OutsideClickHandler>
  );
}

export default LabelsDrawer;
