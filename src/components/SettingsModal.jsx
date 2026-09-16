import React from 'react';
import CloseIcon from 'mdi-react/CloseIcon';
import KanbieLogo from '../assets/kanbie-logo.svg';
import { themes } from '../constants/Colors';

const currYear = new Date().getFullYear();

export function SettingsModal({ settings, setSettings, onClose, theme }) {
  return (
    <div
      className="settings-container"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="settings-content-container">
        <div className="header-container" style={{ justifyContent: 'center', marginBottom: '4px' }}>
          <img alt="logo" src={KanbieLogo} width={32} className="kanbie-logo kanbie-logo-color" />
          <div className="header settings-header">kanbie</div>
        </div>
        <div className="close-button" onClick={onClose} title="Close (Esc / S)">
          <CloseIcon color={theme.accent} size={20} />
        </div>
        <div className="copyright-header" style={{ marginBottom: '20px' }}>
          atude (Mozamel Anwary) &copy; {currYear}
        </div>

        <div className="settings-shortcuts-container">
          <p className="settings-subheader">Shortcuts</p>
          <div className="shortcut-item">
            <span>Open Kanbie</span>
            <span><i>alt+k / opt+k</i></span>
          </div>
          <div className="shortcut-item">
            <span>Create a new task</span>
            <span><i>space</i></span>
          </div>
          <div className="shortcut-item">
            <span>Manage labels</span>
            <span><i>l</i></span>
          </div>
          <div className="shortcut-item">
            <span>Open/close settings</span>
            <span><i>s</i></span>
          </div>
          <div className="shortcut-item">
            <span>Add label (while typing)</span>
            <span><i>#</i></span>
          </div>
          <div className="shortcut-item">
            <span>Add due time/day (while typing)</span>
            <span><i>t: / d:</i></span>
          </div>
          <div className="shortcut-item">
            <span>Edit task or column header</span>
            <span><i>double click</i></span>
          </div>
          <div className="shortcut-item">
            <span>Cancel editing</span>
            <span><i>esc</i></span>
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
