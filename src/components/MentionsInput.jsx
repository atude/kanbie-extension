import React, { useState, useRef, useEffect, Children } from 'react';
import { labelRegex } from '../utils/generic';

export function Mention() {
  return null;
}

// Extract user-visible text by stripping @[display](id) mention tokens and preceding whitespace
const extractVisibleText = (val) => {
  return (val || '').replace(/\s*@\[([^\]]*)\]\(([^)]*)\)/g, '');
};

const extractMentionTokens = (val) => {
  return (val || '').match(labelRegex) || [];
};

export function MentionsInput({
  value = '',
  onChange,
  placeholder,
  className = '',
  onKeyDown,
  autoFocus,
  children,
}) {
  const containerRef = useRef(null);
  const textareaRef = useRef(null);
  const listRef = useRef(null);
  const activeTriggerRef = useRef(null);
  const isKeyboardNavRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const lastSentValueRef = useRef(value);

  const [text, setText] = useState(() => extractVisibleText(value));
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeTriggerInfo, setActiveTriggerInfo] = useState(null);

  // Sync text when value changes from outside
  useEffect(() => {
    if (value !== lastSentValueRef.current) {
      lastSentValueRef.current = value;
      const newText = extractVisibleText(value);
      setText(newText);
      if (autoFocus && textareaRef.current) {
        setTimeout(() => {
          if (textareaRef.current && document.activeElement === textareaRef.current) {
            const currentLen = textareaRef.current.value.length;
            textareaRef.current.setSelectionRange(currentLen, currentLen);
          }
        }, 0);
      }
    }
  }, [value, autoFocus]);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      const el = textareaRef.current;
      el.focus();
      const len = el.value.length;
      el.setSelectionRange(len, len);
      const timer = setTimeout(() => {
        if (document.activeElement === el) {
          const currentLen = el.value.length;
          el.setSelectionRange(currentLen, currentLen);
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  // Close suggestions if user clicks outside MentionsInput
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

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
      // Match trigger preceded by start of text or whitespace (case-insensitive)
      const match = textBeforeCursor.match(new RegExp('(?:^|\\s)(' + escaped + '[^\\s]*)$', 'i'));

      if (match) {
        const fullMatch = match[1];
        const query = fullMatch.slice(trigger.length);
        const matchStart = match.index + (match[0].length - fullMatch.length);
        const matchEnd = cursorPos;

        const filtered = data.filter((item) =>
          (item.display || '').toLowerCase().includes(query.toLowerCase())
        );

        if (filtered.length > 0) {
          const isSameTrigger =
            activeTriggerRef.current &&
            activeTriggerRef.current.trigger === trigger &&
            activeTriggerRef.current.start === matchStart &&
            activeTriggerRef.current.query === query;

          setSuggestions(filtered);
          if (!isSameTrigger) {
            setSelectedIndex(0);
          } else {
            setSelectedIndex((prev) => (prev >= filtered.length ? 0 : prev));
          }

          const newTriggerInfo = {
            child,
            trigger,
            query,
            start: matchStart,
            end: matchEnd,
          };
          activeTriggerRef.current = newTriggerInfo;
          setActiveTriggerInfo(newTriggerInfo);
          setIsOpen(true);
          return;
        }
      }
    }

    setIsOpen(false);
    activeTriggerRef.current = null;
    setActiveTriggerInfo(null);
    setSuggestions([]);
  };

  const handleInputChange = (e) => {
    const newText = e.target.value;
    const cursorPos = e.target.selectionStart;

    setText(newText);

    // Retain all existing metadata mentions (e.g. @[display](id))
    const existingMentions = extractMentionTokens(value);
    const cleanText = newText.trimEnd();
    const newFullValue = existingMentions.length > 0
      ? (cleanText ? `${cleanText} ${existingMentions.join(' ')}` : existingMentions.join(' '))
      : newText;

    lastSentValueRef.current = newFullValue;
    if (onChange) {
      onChange({ target: { value: newFullValue } });
    }

    checkTriggers(newText, cursorPos);
  };

  const selectSuggestion = (item) => {
    if (!activeTriggerInfo || !item) return;

    const { child, start, end } = activeTriggerInfo;
    const textBefore = text.slice(0, start);
    const textAfter = text.slice(end);

    let newCleanText = (textBefore + textAfter).replace(/\s{2,}/g, ' ');
    if (start === 0) {
      newCleanText = newCleanText.trimStart();
    }
    if (end >= text.length) {
      newCleanText = newCleanText.trimEnd();
    }

    const isLabel =
      child.props.isLabel ??
      (child.props.trigger === '#' || child.props.trigger.toLowerCase() === 'l:');

    const existingMentions = extractMentionTokens(value);
    const updatedMentions = [...existingMentions];

    if (isLabel) {
      const mentionToken = `@[${item.display}](${item.id})`;
      if (!updatedMentions.includes(mentionToken)) {
        updatedMentions.push(mentionToken);
      }
    }

    const cleanText = newCleanText.trimEnd();
    const newFullValue = updatedMentions.length > 0
      ? (cleanText ? `${cleanText} ${updatedMentions.join(' ')}` : updatedMentions.join(' '))
      : newCleanText;

    setText(newCleanText);
    lastSentValueRef.current = newFullValue;

    if (child.props.onAdd) {
      child.props.onAdd(item.id, item.display);
    }

    if (onChange) {
      onChange({ target: { value: newFullValue } });
    }

    setIsOpen(false);
    activeTriggerRef.current = null;
    setActiveTriggerInfo(null);
    setSuggestions([]);

    if (textareaRef.current) {
      textareaRef.current.focus();
      const nextPos = Math.min(start, newCleanText.length);
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
        isKeyboardNavRef.current = true;
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        isKeyboardNavRef.current = true;
        setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        e.stopPropagation();
        if (suggestions[selectedIndex]) {
          selectSuggestion(suggestions[selectedIndex]);
        }
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
          e.nativeEvent.stopImmediatePropagation();
        }
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

  const handleKeyUp = (e) => {
    if (
      ['ArrowDown', 'ArrowUp', 'Enter', 'Tab', 'Escape', 'Shift', 'Control', 'Alt', 'Meta'].includes(e.key)
    ) {
      return;
    }
    handleCursorCheck();
  };

  const handleMouseMove = (e) => {
    if (
      e.clientX !== lastMousePosRef.current.x ||
      e.clientY !== lastMousePosRef.current.y
    ) {
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      isKeyboardNavRef.current = false;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`mentions ${className} mentions__control`}
      style={{ position: 'relative' }}
    >
      <textarea
        ref={textareaRef}
        className="mentions__input"
        value={text}
        onChange={handleInputChange}
        onFocus={(e) => {
          const len = e.target.value.length;
          e.target.setSelectionRange(len, len);
        }}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onClick={handleCursorCheck}
        placeholder={placeholder}
        style={{
          width: '100%',
          resize: 'none',
          background: 'transparent',
          boxSizing: 'border-box',
          fontFamily: 'inherit',
          fontSize: 'inherit',
        }}
      />
      {isOpen && suggestions.length > 0 && (
        <div
          className="mentions__suggestions"
          onMouseMove={handleMouseMove}
          style={{
            position: 'absolute',
            top: '100%',
            left: '4px',
            right: '4px',
            zIndex: 1000,
            maxHeight: '160px',
            overflowY: 'auto',
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
                onMouseEnter={() => {
                  if (!isKeyboardNavRef.current) {
                    setSelectedIndex(idx);
                  }
                }}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {item.color && (
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
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

