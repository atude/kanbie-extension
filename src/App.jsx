import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { v4 as uuid } from 'uuid';
import moment from 'moment';

import './App.css';
import './Settings.css';

import initColumns from './constants/InitColumns';
import initSettings from './constants/InitSettings';
import { filterString, labelRegex, maxItems } from './utils/generic';
import { getStorageData, setStorageData } from './utils/storage';

import useTheme from './hooks/useTheme';
import useKanbanAlarms from './hooks/useKanbanAlarms';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';

import Header from './components/Header';
import Column from './components/Column';
import TrashDroppable from './components/TrashDroppable';
import ActionButtons from './components/ActionButtons';
import TaskInputModal from './components/TaskInputModal';
import LabelsDrawer from './components/LabelsDrawer';
import SettingsModal from './components/SettingsModal';

function App() {
  const [columns, setColumns] = useState(initColumns);
  const [labels, setLabels] = useState([]);
  const [settings, setSettings] = useState(initSettings);
  const [loaded, setLoaded] = useState(false);

  // Active interaction states
  const [inputExpanded, setInputExpanded] = useState(false);
  const [inputText, setInputText] = useState('');
  const [labelsListExpanded, setLabelsListExpanded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isEditingId, setEditingId] = useState();
  const [isDragging, setIsDragging] = useState(false);

  // Current task label & alarm draft states
  const [currLabels, setCurrLabels] = useState({});
  const [currDateAlarm, setCurrDateAlarm] = useState();
  const [currTimeAlarm, setCurrTimeAlarm] = useState();

  const theme = useTheme(settings);
  const {
    alarms,
    setAlarms,
    cleanOrphanedAlarms,
    addOrEditAlarm,
    removeAlarm,
  } = useKanbanAlarms();

  // Load initial data from Chrome sync storage
  useEffect(() => {
    const loadStoredData = async () => {
      const data = await getStorageData(['columns', 'labels', 'settings', 'alarms']);
      if (data.columns && data.columns !== 'undefined') setColumns(data.columns);
      if (data.labels && data.labels !== 'undefined') setLabels(data.labels);
      if (data.settings && data.settings !== 'undefined') setSettings(data.settings);
      if (data.alarms && data.alarms !== 'undefined') setAlarms(data.alarms);
      setLoaded(true);
    };
    loadStoredData();
  }, [setAlarms]);

  // Save data to Chrome sync storage whenever data changes
  useEffect(() => {
    if (loaded) {
      setStorageData({ columns, labels, settings, alarms });
    }
  }, [columns, labels, settings, alarms, loaded]);

  // Clean up alarms when columns are modified
  useEffect(() => {
    cleanOrphanedAlarms(columns);
  }, [columns, cleanOrphanedAlarms]);

  const resetInput = () => {
    setEditingId(undefined);
    setInputText('');
    setCurrLabels({});
    setCurrDateAlarm(undefined);
    setCurrTimeAlarm(undefined);
  };

  useKeyboardShortcuts({
    isEditingId,
    showSettings,
    setShowSettings,
    inputExpanded,
    setInputExpanded,
    inputText,
    resetInput,
    labelsListExpanded,
    setLabelsListExpanded,
  });

  const addCurrLabel = (id, display) => {
    setCurrLabels((prev) => ({ ...prev, [id]: display }));
  };

  const removeCurrLabel = (id) => {
    setCurrLabels((prev) => {
      const { [id]: removed, ...rest } = prev;
      if (removed) {
        setInputText((txt) => txt.replace(`@[${removed}](${id})`, ''));
      }
      return rest;
    });
  };

  const addDateToCurrAlarm = (id) => {
    const dateRaw = id.replace('__DATE: ', '');
    setCurrDateAlarm(dateRaw);
    if (!currTimeAlarm) {
      setCurrTimeAlarm('00:00');
    }
  };

  const addTimeToCurrAlarm = (id) => {
    const timeRaw = id.replace('__TIME: ', '');
    setCurrTimeAlarm(timeRaw);
    if (!currDateAlarm) {
      setCurrDateAlarm(moment().format('DD/MM/YYYY'));
    }
  };

  const clearCurrAlarm = () => {
    setCurrDateAlarm(undefined);
    setCurrTimeAlarm(undefined);
  };

  // Drag and drop handler
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const onDragEnd = (result) => {
    setIsDragging(false);
    const { source, destination } = result;
    if (!destination) return;

    if (destination.droppableId === 'trash') {
      const sourceCol = columns.find((col) => col.title === source.droppableId);
      if (!sourceCol) return;
      const removedCard = sourceCol.items[source.index];
      if (removedCard) {
        removeAlarm(removedCard.id);
      }
      setColumns((prev) =>
        prev.map((col) => {
          if (col.title !== source.droppableId) return col;
          return {
            ...col,
            items: col.items.filter((_, idx) => idx !== source.index),
          };
        })
      );
      return;
    }

    if (source.droppableId === destination.droppableId) {
      setColumns((prev) =>
        prev.map((col) => {
          if (col.title !== source.droppableId) return col;
          const nextItems = [...col.items];
          const [moved] = nextItems.splice(source.index, 1);
          nextItems.splice(destination.index, 0, moved);
          return { ...col, items: nextItems };
        })
      );
      return;
    }

    const destCol = columns.find((col) => col.title === destination.droppableId);
    if (destCol && destCol.items.length >= maxItems) {
      return;
    }

    setColumns((prev) => {
      let movedItem = null;
      const step1 = prev.map((col) => {
        if (col.title !== source.droppableId) return col;
        const nextItems = [...col.items];
        [movedItem] = nextItems.splice(source.index, 1);
        return { ...col, items: nextItems };
      });

      if (!movedItem) return prev;

      return step1.map((col) => {
        if (col.title !== destination.droppableId) return col;
        const nextItems = [...col.items];
        nextItems.splice(destination.index, 0, movedItem);
        return { ...col, items: nextItems };
      });
    });
  };

  const onDeleteAllDone = () => {
    setColumns((prev) =>
      prev.map((col, idx) => (idx === 2 ? { ...col, items: [] } : col))
    );
  };

  const onAddCard = (e) => {
    if (e.key === 'Enter' && filterString(inputText) !== '') {
      const cardId = uuid();
      const newCard = { id: cardId, content: inputText };

      setColumns((prev) =>
        prev.map((col, idx) =>
          idx === 0 ? { ...col, items: [...col.items, newCard] } : col
        )
      );

      addOrEditAlarm(cardId, currDateAlarm, currTimeAlarm);
      setInputExpanded(false);
      resetInput();
    }
  };

  const onStartEditingCard = (item) => {
    setEditingId(item.id);
    setInputText(item.content);

    const itemLabels = {};
    const itemLabelsRaw = item.content.match(labelRegex);
    const itemLabelIds = itemLabelsRaw?.map((lbl) => lbl.match(/\(.*\)/)[0].slice(1, -1));
    if (itemLabelIds?.length) {
      [...itemLabelIds].reverse().forEach((labelId) => {
        const matched = labels.find((lbl) => lbl.id === labelId);
        if (matched) {
          itemLabels[labelId] = matched.display;
        }
      });
    }
    setCurrLabels(itemLabels);

    const cardAlarm = alarms[item.id];
    if (cardAlarm?.alarmDue) {
      setCurrDateAlarm(moment(cardAlarm.alarmDue).format('DD/MM/YYYY'));
      setCurrTimeAlarm(moment(cardAlarm.alarmDue).format('HH:mm'));
    } else {
      setCurrDateAlarm(undefined);
      setCurrTimeAlarm(undefined);
    }
  };

  const onSaveEditingCard = () => {
    if (!isEditingId) return;

    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        items: col.items
          .map((task) =>
            task.id === isEditingId
              ? filterString(inputText) !== ''
                ? { ...task, content: inputText }
                : null
              : task
          )
          .filter(Boolean),
      }))
    );

    addOrEditAlarm(isEditingId, currDateAlarm, currTimeAlarm);
    resetInput();
  };

  const onKeypressEditCard = (e) => {
    if (e.key === 'Enter') {
      onSaveEditingCard();
    } else if (e.key === 'Escape') {
      resetInput();
    }
  };

  const onSaveEditingHeader = () => {
    if (!isEditingId) return;
    setColumns((prev) =>
      prev.map((col) =>
        col.title === isEditingId ? { ...col, newTitle: inputText || '' } : col
      )
    );
    resetInput();
  };

  const onKeypressEditHeader = (e) => {
    if (e.key === 'Enter' && filterString(inputText) !== '') {
      onSaveEditingHeader();
    } else if (e.key === 'Escape') {
      resetInput();
    }
  };

  return (
    <div className="app-root">
      <div className="toolbar">
        <Header hideKanbieText={settings?.hideKanbieText} />
        {loaded && (
          <ActionButtons
            theme={theme}
            onClearAllDone={onDeleteAllDone}
            onToggleInput={() => setInputExpanded((prev) => !prev)}
            onToggleLabels={() => setLabelsListExpanded((prev) => !prev)}
            onOpenSettings={() => setShowSettings(true)}
            inputExpanded={inputExpanded}
            labelsListExpanded={labelsListExpanded}
            showSettings={showSettings}
          />
        )}
      </div>

      {loaded && (
        <div className="main-container">
          <DragDropContext onDragStart={handleDragStart} onDragEnd={onDragEnd}>
            {columns.map((column, colIndex) => (
              <Column
                key={column.title}
                column={column}
                colIndex={colIndex}
                isEditingId={isEditingId}
                setEditingId={setEditingId}
                inputText={inputText}
                setInputText={setInputText}
                onKeypressEditHeader={onKeypressEditHeader}
                saveAndResetEditingHeader={onSaveEditingHeader}
                onStartEditingCard={onStartEditingCard}
                onSaveEditingCard={onSaveEditingCard}
                onKeypressEditCard={onKeypressEditCard}
                currLabels={currLabels}
                removeCurrLabel={removeCurrLabel}
                addCurrLabel={addCurrLabel}
                currDateAlarm={currDateAlarm}
                currTimeAlarm={currTimeAlarm}
                clearCurrAlarm={clearCurrAlarm}
                addDateToCurrAlarm={addDateToCurrAlarm}
                addTimeToCurrAlarm={addTimeToCurrAlarm}
                labels={labels}
                alarms={alarms}
                theme={theme}
              />
            ))}
            <TrashDroppable theme={theme} isDragging={isDragging} />
          </DragDropContext>

          {inputExpanded && (
            <TaskInputModal
              inputText={inputText}
              setInputText={setInputText}
              labels={labels}
              currLabels={currLabels}
              addCurrLabel={addCurrLabel}
              removeCurrLabel={removeCurrLabel}
              currDateAlarm={currDateAlarm}
              currTimeAlarm={currTimeAlarm}
              clearCurrAlarm={clearCurrAlarm}
              addDateToCurrAlarm={addDateToCurrAlarm}
              addTimeToCurrAlarm={addTimeToCurrAlarm}
              onAddCard={onAddCard}
              onClose={() => {
                setInputExpanded(false);
                resetInput();
              }}
            />
          )}

          {labelsListExpanded && (
            <LabelsDrawer
              labels={labels}
              setLabels={setLabels}
              onClose={() => setLabelsListExpanded(false)}
              theme={theme}
            />
          )}

          {showSettings && (
            <SettingsModal
              settings={settings}
              setSettings={setSettings}
              onClose={() => setShowSettings(false)}
              theme={theme}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
