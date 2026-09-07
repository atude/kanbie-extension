import React from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import BellRingIcon from 'mdi-react/BellRingIcon';
import CloseCircleIcon from 'mdi-react/CloseCircleIcon';
import moment from 'moment';
import { MentionsInput, Mention } from './MentionsInput';
import { allDays, allTimes } from '../utils/time';

export function TaskInputModal({
  inputText,
  setInputText,
  labels,
  currLabels,
  addCurrLabel,
  removeCurrLabel,
  currDateAlarm,
  currTimeAlarm,
  clearCurrAlarm,
  addDateToCurrAlarm,
  addTimeToCurrAlarm,
  onAddCard,
  onClose,
}) {
  return (
    <OutsideClickHandler onOutsideClick={onClose}>
      <div className="input-container">
        <MentionsInput
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="New task... (#label, t:time, d:day)"
          className="mentions input-add"
          onKeyDown={onAddCard}
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
                  {removeCurrLabel && (
                    <CloseCircleIcon
                      size={14}
                      onClick={() => removeCurrLabel(keyLabel)}
                      className="remove-label-icon"
                    />
                  )}
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
              {clearCurrAlarm && (
                <CloseCircleIcon
                  size={14}
                  onClick={clearCurrAlarm}
                  className="remove-label-icon"
                />
              )}
            </span>
          </div>
        )}
      </div>
    </OutsideClickHandler>
  );
}

export default TaskInputModal;
