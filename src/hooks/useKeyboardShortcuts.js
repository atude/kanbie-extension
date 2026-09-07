import { useEffect } from 'react';
import { filterString } from '../utils/generic';

export function useKeyboardShortcuts({
  isEditingId,
  showSettings,
  setShowSettings,
  inputExpanded,
  setInputExpanded,
  inputText,
  resetInput,
  labelsListExpanded,
  setLabelsListExpanded,
  labelText,
  setLabelText,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger global shortcuts if actively editing a card or column
      if (isEditingId) return;

      const isInputOpen = inputExpanded;
      const isLabelsOpen = labelsListExpanded;

      // Space: Toggle New Task
      if (e.code === 'Space' && !isLabelsOpen && !isInputOpen && !showSettings) {
        e.preventDefault();
        setInputExpanded(true);
        resetInput();
        return;
      }

      // Key L: Toggle Labels Drawer
      if (e.code === 'KeyL' && !isLabelsOpen && !isInputOpen && !showSettings) {
        e.preventDefault();
        setLabelsListExpanded(true);
        if (setLabelText) setLabelText('');
        return;
      }

      // Key S: Toggle Settings Modal
      if (e.code === 'KeyS' && !isLabelsOpen && !isInputOpen) {
        e.preventDefault();
        setShowSettings((prev) => !prev);
        return;
      }

      // Escape: Dismiss open modal, drawer, or input
      if (e.code === 'Escape') {
        if (showSettings) {
          setShowSettings(false);
          return;
        }
        if (isLabelsOpen) {
          setLabelsListExpanded(false);
          return;
        }
        if (isInputOpen) {
          resetInput();
          setInputExpanded(false);
          return;
        }
      }

      // Backspace: Dismiss empty open input or label drawer
      if (e.code === 'Backspace') {
        if (isLabelsOpen && labelText === '') {
          setLabelsListExpanded(false);
        } else if (isInputOpen && filterString(inputText) === '') {
          resetInput();
          setInputExpanded(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    isEditingId,
    showSettings,
    setShowSettings,
    inputExpanded,
    setInputExpanded,
    inputText,
    resetInput,
    labelsListExpanded,
    setLabelsListExpanded,
    labelText,
    setLabelText,
  ]);
}

export default useKeyboardShortcuts;

