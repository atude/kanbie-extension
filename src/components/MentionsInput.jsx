import React, { useState, useRef, useEffect, Children } from 'react';
import { labelRegex } from '../utils/generic';

export function Mention() {
  return null;
}

export function MentionsInput({
  value = '',
  onChange,
  placeholder,
  className = '',
  onKeyDown,
  autoFocus,
  children,
}) {
  const textareaRef = useRef(null);
  const listRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeTriggerInfo, setActiveTriggerInfo] = useState(null);

  // Extract user-visible text by stripping @[display](id) mention tokens
  const visibleText = (value || '').replace(labelRegex, '');

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  // Keep active suggestion visible while navigating with arrow keys
  useEffect(() => {
    if (isOpen && listRef.current) {
      const activeEl = listRef.current.children[selectedIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex, isOpen]);

  const checkTriggers = (currentText, cursorPos) => {
    const textBeforeCursor = currentText.slice(0, cursorPos);
    const mentionConfigs = Children.toArray(children).filter(
      (child) => child && child.props && child.props.trigger
    );

    for (const child of mentionConfigs) {
      const { trigger, data = [] } = child.props;
      const escaped = trigger.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Match trigger preceded by start of text or whitespace
      const match = textBeforeCursor.match(new RegExp('(?:^|\\s)(' + escaped + '[^\\s]*)$'));

      if (match) {
        const fullMatch = match[1];
        const query = fullMatch.slice(trigger.length);
        const matchStart = match.index + (match[0].length - fullMatch.length);
        const matchEnd = cursorPos;

        const filtered = data.filter((item) =>
          (item.display || '').toLowerCase().includes(query.toLowerCase())
        );

        if (filtered.length > 0) {
          setSuggestions(filtered);
          setSelectedIndex(0);
          setActiveTriggerInfo({
            child,
            trigger,
            start: matchStart,
            end: matchEnd,
          });
          setIsOpen(true);
          return;
        }
      }
    }

    setIsOpen(false);
    setActiveTriggerInfo(null);
    setSuggestions([]);
  };

  const handleInputChange = (e) => {
    const newVisibleText = e.target.value;
    const cursorPos = e.target.selectionStart;

    // Retain all existing metadata mentions (e.g. @[display](id))
    const existingMentions = (value || '').match(labelRegex) || [];
    const newFullValue = existingMentions.length > 0
      ? (newVisibleText + ' ' + existingMentions.join(' ')).trim()
      : newVisibleText;

    if (onChange) {
      onChange({ target: { value: newFullValue } });
    }

    checkTriggers(newVisibleText, cursorPos);
  };

  const selectSuggestion = (item) => {
    if (!activeTriggerInfo) return;

    const { child, start, end } = activeTriggerInfo;
    const textBefore = visibleText.slice(0, start);
    const textAfter = visibleText.slice(end);
    const rawClean = textBefore + textAfter;
    const newVisibleText = rawClean.replace(/\s{2,}/g, ' ');

    const existingMentions = (value || '').match(labelRegex) || [];
    const isLabel = child.props.trigger === '#';
    const updatedMentions = [...existingMentions];

    if (isLabel) {
      const mentionToken = `@[${item.display}](${item.id})`;
      if (!updatedMentions.includes(mentionToken)) {
        updatedMentions.push(mentionToken);
      }
    }

    const newFullValue = updatedMentions.length > 0
      ? (newVisibleText + ' ' + updatedMentions.join(' ')).trim()
      : newVisibleText;

    if (child.props.onAdd) {
      child.props.onAdd(item.id, item.display);
    }

    if (onChange) {
      onChange({ target: { value: newFullValue } });
    }

    setIsOpen(false);
    setActiveTriggerInfo(null);
    setSuggestions([]);

    if (textareaRef.current) {
      textareaRef.current.focus();
      const nextPos = textBefore.length;
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(nextPos, nextPos);
        }
      }, 0);
    }
  };

  const handleKeyDown = (e) => {
    if (isOpen && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        e.stopPropagation();
        selectSuggestion(suggestions[selectedIndex]);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        return;
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
    }

    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  const handleCursorCheck = () => {
    if (textareaRef.current) {
      checkTriggers(textareaRef.current.value, textareaRef.current.selectionStart);
    }
  };

  return (
    <div className={`mentions ${className} mentions__control`} style={{ position: 'relative' }}>
      <textarea
        ref={textareaRef}
        className="mentions__input"
        value={visibleText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onKeyUp={handleCursorCheck}
        onClick={handleCursorCheck}
        placeholder={placeholder}
        style={{
          width: '100%',
          minHeight: '80px',
          resize: 'none',
          background: 'transparent',
          boxSizing: 'border-box',
          fontFamily: "'Roboto', sans-serif",
          fontSize: 'smaller',
        }}
      />
      {isOpen && suggestions.length > 0 && (
        <div
          className="mentions__suggestions"
          style={{
            position: 'absolute',
            top: '100%',
            left: '4px',
            right: '4px',
            zIndex: 1000,
            maxHeight: '160px',
            overflowY: 'auto',
            borderRadius: '6px',
            backgroundColor: 'var(--bg1)',
            boxShadow: '0 4px 12px var(--shadow, rgba(0,0,0,0.15))',
          }}
        >
          <ul
            ref={listRef}
            className="mentions__suggestions__list"
            style={{ listStyle: 'none', margin: 0, padding: '4px 0' }}
          >
            {suggestions.map((item, idx) => (
              <li
                key={item.id || idx}
                className={`mentions__suggestions__item ${
                  idx === selectedIndex ? 'mentions__suggestions__item--focused' : ''
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectSuggestion(item);
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
                style={{
                  padding: '6px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {item.color && (
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: item.color,
                      flexShrink: 0,
                    }}
                  />
                )}
                <span>{item.display}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MentionsInput;

