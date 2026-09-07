import React from 'react';
import CloseIcon from 'mdi-react/CloseIcon';
import KanbieLogo from '../assets/kanbie-logo.svg';
import { themes } from '../constants/Colors';

const currYear = new Date().getFullYear();

export function SettingsModal({ settings, setSettings, onClose, theme }) {
  return (
    <div className="settings-container">
      <div className="settings-content-container">
        <div className="header-container">
          <img alt="logo" src={KanbieLogo} width={60} className="kanbie-logo" />
          <div className="header settings-header">kanbie</div>
        </div>
        <div className="close-button" onClick={onClose}>
          <CloseIcon color={theme.delCol} size={30} />
        </div>
        <span className="copyright-header">atude (Mozamel Anwary) © {currYear}</span>

        <div className="settings-shortcuts-container">
          <p className="settings-subheader">Shortcuts</p>
          <div className="shortcut-item">
            <span><i>alt+k / opt+k</i></span>
            <span>Open Kanbie</span>
          </div>
          <div className="shortcut-item">
            <span><i>space</i></span>
            <span>Create a new task</span>
          </div>
          <div className="shortcut-item">
            <span><i>l</i></span>
            <span>Create a new label</span>
          </div>
          <div className="shortcut-item">
            <span><i>s</i></span>
            <span>Open/close settings</span>
          </div>
          <div className="shortcut-item">
            <span><i>#</i></span>
            <span>Add a label to a task (while typing)</span>
          </div>
          <div className="shortcut-item">
            <span><i>t: / d:</i></span>
            <span>Add a due time/day to a task (while typing)</span>
          </div>
          <div className="shortcut-item">
            <span><i>double click</i></span>
            <span>Edit task or column header</span>
          </div>
        </div>

        <div className="settings-themes-container">
          <p className="settings-subheader">Themes</p>
          <div className="settings-select-content">
            {Object.keys(themes).map((themeName) => (
              <span
                key={themeName}
                className={themeName === settings.theme ? 'select-item select-item-selected' : 'select-item'}
                onClick={() => setSettings((curr) => ({ ...curr, theme: themeName }))}
              >
                {themeName}
              </span>
            ))}
          </div>
        </div>

        <div className="settings-hidelogo-container">
          <p className="settings-subheader">Hide Kanbie Text</p>
          <div className="settings-select-content">
            <span
              className={settings.hideKanbieText ? 'select-item select-item-selected' : 'select-item'}
              onClick={() => setSettings((curr) => ({ ...curr, hideKanbieText: true }))}
            >
              yes
            </span>
            <span
              className={!settings.hideKanbieText ? 'select-item select-item-selected' : 'select-item'}
              onClick={() => setSettings((curr) => ({ ...curr, hideKanbieText: false }))}
            >
              no
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;

