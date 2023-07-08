/*global chrome*/

/* 
  MAINTENANCE

  - Refactor -> abstract functions, components, etx
  - Clean up styles, use scss or variables, remove unused styles
  - Fix up mutations -> make sure functions are not mutating/using ref instead of copy
  - Use reducers to clean up logic
  - Convert to TS
*/

import React, { useState, useEffect } from 'react';
import './App.css';
import './Settings.css';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import initColumns from './constants/InitColumns';
import initSettings from './constants/InitSettings';

import uuid from 'uuid';
import OutsideClickHandler from 'react-outside-click-handler';
import { themes } from './constants/Colors';
import { MentionsInput, Mention } from 'react-mentions'

import KanbieLogo from './assets/kanbie-logo.svg';
import CheckboxMarkedCircleOutlineIcon from 'mdi-react/CheckboxMarkedCircleOutlineIcon';
import CheckboxMarkedCircleIcon from 'mdi-react/CheckboxMarkedCircleIcon';
import ProgressCheckIcon from 'mdi-react/ProgressCheckIcon';
import DeleteForeverIcon from 'mdi-react/DeleteForeverIcon';
import CloseCirleIcon from 'mdi-react/CloseCircleIcon';
import PlusIcon from 'mdi-react/PlusIcon';
import LabelMultipleIcon from 'mdi-react/LabelMultipleIcon';
import CloseIcon from 'mdi-react/CloseIcon';
import FormatColorFillIcon from 'mdi-react/FormatColorFillIcon';
import NotificationClearAllIcon from 'mdi-react/NotificationClearAllIcon';
import CogIcon from 'mdi-react/CogIcon';
import BellRingIcon from 'mdi-react/BellRingIcon';
import { filterString, labelRegex, maxItems } from './utils/generic';
import { allDays, allTimes } from './utils/time';
import moment from 'moment';
import { updateBadge } from './utils/badge';

const currYear = new Date().getFullYear();

function App() {
  const [columns, setColumns] = useState(initColumns);
  const [labels, setLabels] = useState([]);
  const [settings, setSettings] = useState(initSettings);
	const [alarms, setAlarms] = useState({});
  const [currLabels, setCurrLabels] = useState({});
	const [currDateAlarm, setCurrDateAlarm] = useState();
	const [currTimeAlarm, setCurrTimeAlarm] = useState();
  const [inputExpanded, setInputExpanded] = useState(false);
  const [inputText, setInputText] = useState("");
  const [labelsListExpanded, setLabelsListExpanded] = useState(false);
  const [labelText, setLabelText] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [isEditingId, setEditingId] = useState();
  const [startedEditing, setStartedEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Load data
  useEffect(() => {
		const initLoad = async () => {
			try {
				const getColumns = await chrome.storage.sync.get("columns");
				const getLabels = await chrome.storage.sync.get("labels");
				const getSettings = await chrome.storage.sync.get("settings");
				const getAlarms = await chrome.storage.sync.get("alarms");

				if (chrome.runtime.error) {
					throw Error("runtime error");
				}

				if (getColumns.columns && getColumns.columns !== "undefined") {
					setColumns(getColumns.columns);
				}
	
				if (getLabels.labels && getLabels.labels !== "undefined") {
					setLabels(getLabels.labels);
				}
	
				if (getSettings.settings && getSettings.settings !== "undefined") {
					setSettings(getSettings.settings);
				}
	
				if (getAlarms.alarms && getAlarms.alarms !== "undefined") {
					setAlarms(getAlarms.alarms);
				}
	
				setLoaded(true);
			} catch (error) {
				console.warn("Error syncing with chrome API. Are you using this as a webapp?");
				setLoaded(true);
			}
		}

		initLoad();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  

  const theme = settings?.theme ? themes[settings?.theme] : themes.dark;
  const columnIconProps = {
    size: 24,
    color: theme.accent,
    style: { marginBottom: "8px" }
  };

  // Set CSS theme variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg1', theme.background);
    root.style.setProperty('--bg2', theme.backgroundSecondary);
    root.style.setProperty('--bg3', theme.backgroundGrey);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--accentColored', theme.accentColored);
    root.style.setProperty('--accentColoredBright', theme.accentColoredBright);
    root.style.setProperty('--accentColoredDark', theme.accentColoredDark);
    root.style.setProperty('--accentDelete', theme.delCol);
    root.style.setProperty('--shadow', theme.shadow);
		root.style.setProperty('--kanbie-logo-hue-rotate', theme.kanbieLogoHueRotate);
		root.style.setProperty('--kanbie-logo-grayscale', theme.kanbieLogoGrayscale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  useEffect(() => {
		// Pull items. Only pull if initial load succeeded to prevent bad overrides.
		if (loaded) {
			try {
				chrome.storage.sync.set({
					"columns": columns,
					"labels": labels,
					"settings": settings,
					"alarms": alarms,
				}, () => {
					if (chrome.runtime.error) {
						console.warn("Runtime error. Failed to save data");
					}
				});
			} catch (error) {
				console.warn("Error syncing storage with chrome extensions.");
			}
		}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, labels, settings, alarms]);

	useEffect(() => {
		updateAlarms();
		updateBadge(alarms);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [columns]);

	useEffect(() => {
		syncAlarms();
		updateBadge(alarms);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [alarms]);

	// Keypress listener
  useEffect(() => {
    document.addEventListener("keydown", keyShortcutHandler);
    return () => {
      document.removeEventListener('keydown', keyShortcutHandler);
    };
  });

	// Reupdate alarms whenever a card is modified
	const updateAlarms = () => {
		let newAlarms = {};
		columns.forEach((column) => [
			column.items.forEach((card) => {
				if (alarms[card.id]) {
					newAlarms[card.id] = alarms[card.id]; 
				}
			})
		]);
		setAlarms(newAlarms);
	}

	const syncAlarms = async () => {
		try {
			// Clear all alarms and recreate them
			await chrome.alarms.clearAll();
			// Note that alarmId and cardId are the same
			Object.keys(alarms).forEach((alarmId) => {
				if (!alarms[alarmId].notified) {
					chrome.alarms.create(
						alarmId,
						{ when: new Date(alarms[alarmId].alarmDue).getTime() },
					)
				}
			});
    } catch (error) {
      console.warn("Error syncing alarms with chrome extensions.", error);
    }
	}

  const setEditing = (item) => {
    setEditingId(item.id);
    setInputText(item.content);
  };

  const saveAndResetEditing = () => {
    onEditTask();
		resetInput();
  };

  const saveAndResetEditingHeader = () => {
    onEditHeader();
		resetInput();
  };

	const resetInput = () => {
		setEditingId();
    setInputText("");
    setCurrLabels({});
		clearCurrAlarm();
    setStartedEditing(false);
	}

  const keyShortcutHandler = (e) => {
    if (e.code === "Space" && !labelsListExpanded && !inputExpanded && !isEditingId && !showSettings) {
      setInputExpanded(!inputExpanded);
      setTimeout(() => setInputText(""), 0);
    } else if (e.code === "KeyL" && !labelsListExpanded && !inputExpanded && !isEditingId && !showSettings) {
      setLabelsListExpanded(!labelsListExpanded);
      setTimeout(() => setLabelText(""), 0);
    } else if (e.code === "Backspace" && !isEditingId) {
      if(labelsListExpanded && labelText === "") {
        setLabelsListExpanded(!labelsListExpanded);
      } else if (inputExpanded && filterString(inputText) === "") {
				resetInput();
        setInputExpanded(!inputExpanded);
      }
    } else if (e.code === "KeyS" && !labelsListExpanded && !inputExpanded && !isEditingId) {
      setShowSettings((currSettings) => !currSettings);
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    const currColumns = [...columns];
    if (!destination) {
      return;
    }
    // Delete
    if (destination.droppableId === "trash") {
      const sourceItems = currColumns.filter((column => column.title === source.droppableId))[0].items;
      const removedCard = sourceItems.splice(source.index, 1)[0];
			// Remove associated alarm if exists
			if (alarms[removedCard.id]) {
				const { [removedCard.id]: deletedAlarm, ...remainingAlarms } = alarms;
				setAlarms(remainingAlarms);
			}
    } else {
      // Different column
      if (source.droppableId !== destination.droppableId) {
        const sourceItems = currColumns.filter((column => column.title === source.droppableId))[0].items;
        const destItems = currColumns.filter((column => column.title === destination.droppableId))[0].items;
        if (destItems.length >= maxItems) {
          return;
        }
        const [removed] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, removed);
      } else {
        //Same column
        const sourceItems = currColumns.filter((column => column.title === source.droppableId))[0].items;
        const [removed] = sourceItems.splice(source.index, 1);
        sourceItems.splice(destination.index, 0, removed);
      }
    }
    setColumns(currColumns);
  };

  // Clear all from done
  const onDeleteAllDone = () => {
    const currColumns = [...columns];
    const sourceItems = currColumns[2].items;
		// Delete items and set
    sourceItems.splice(0, sourceItems.length);
    setColumns(currColumns);
  };

  const onEditTask = () => {
    const currColumns = columns
      .map(x => ({ ...x }))
      .map(column => {
        return {
          ...column,
          items: column.items.map(task => {
            if (task.id === isEditingId) {
              if (inputText) {
                return {
                  ...task,
                  content: inputText,
                };
              }
              return undefined;
            }
            return task;
          }).filter(task => task !== undefined),
        }
      });
		
		addOrEditCurrAlarmToAlarms(isEditingId);
    setColumns(currColumns);
  };

  const onEditHeader = () => {
    const currColumns = columns
      .map(x => ({ ...x }))
      .map(column => {
        if (column.title === isEditingId) {
          return {
            ...column,
            newTitle: inputText ?? "",
          }
        }
        return column;
      });
    setColumns(currColumns);
  };

  const addCurrLabel = (id, display) => {
    setCurrLabels({ ...currLabels, [id]: display });
  };

	const removeCurrLabel = (id) => {
		const { [id]: existingLabel, ...currLabelsEdited } = currLabels;
    setCurrLabels(currLabelsEdited);
		// Remove label from text content too
		setInputText(inputText.replace(`@[${existingLabel}](${id})`, ""));
  };

	const addDateToCurrAlarm = (id, display) => {
		const dateRaw = id.replace("__DATE: ", "");
		setCurrDateAlarm(dateRaw);
		if (!currTimeAlarm) {
			setCurrTimeAlarm("00:00");
		}
	}

	const addTimeToCurrAlarm = (id, display) => {
		// setInputText(inputText.replace(`@[${display}](${id})`, ""));
		const timeRaw = id.replace("__TIME: ", "");
		setCurrTimeAlarm(timeRaw);
		if (!currDateAlarm) {
			setCurrDateAlarm(moment().format("DD/MM/YYYY"))
		}
	}

	const clearCurrAlarm = () => {
		setCurrDateAlarm();
		setCurrTimeAlarm();
	}

	const renderMentionsComponent = (placeholderText, className, onKeyFunction) => (
		<MentionsInput 
			value={inputText} 
			onChange={e => setInputText(e.target.value)}
			placeholder={placeholderText}
			className={`mentions ${className}`}
			onKeyDown={e => onKeyFunction(e)}
			autoFocus
			allowSpaceInQuery
		>
			<Mention
				className="mentions__mention"
				trigger="#"
				data={labels.filter((label => !currLabels[label.id]))}
				displayTransform={() => ""}
				onAdd={(id, display) => addCurrLabel(id, display)}
			/>
			<Mention 
				className="mentions__mention"
				trigger="t:"
				data={allTimes}
				onAdd={(id, display) => addTimeToCurrAlarm(id, display)}
			/>
			<Mention 
				className="mentions__mention"
				trigger="d:"
				data={allDays}
				onAdd={(id, display) => addDateToCurrAlarm(id, display)}
			/>
		</MentionsInput>
	);

  const renderInputBox = () => (
    <OutsideClickHandler 
      onOutsideClick={() => {
        setInputExpanded(false);
        setInputText("");
        setCurrLabels({});
				clearCurrAlarm();
      }}
    >
      <div className="input-container">
				{renderMentionsComponent("New task...", "input-add", onAddCard)}
        {!!Object.values(currLabels).length && 
          <div className="curr-labels-container">
            {Object.keys(currLabels).map((keyLabel) => (
              <span 
                className="curr-label-item"
                style={{backgroundColor: labels.find(label => label.id === keyLabel).color}}
                key={keyLabel}
              >
                {currLabels[keyLabel]}
              </span>
            ))}
          </div>
        }
				{(currDateAlarm && currTimeAlarm) && 
					<div className="curr-labels-container curr-time-container">
						<span className="curr-label-item">
							<BellRingIcon size={16} style={{ marginRight: "6px" }} />
							{moment(`${currDateAlarm} ${currTimeAlarm}`, "DD/MM/YYYY HH:mm").format("dddd DD/MM, h:mmA")}
						</span>
					</div>
				}
      </div>
    </OutsideClickHandler>
  );

  const renderLabelsList = () => (
    <OutsideClickHandler onOutsideClick={() => setLabelsListExpanded(!labelsListExpanded)}>
      <div className="labels-list">
        <input 
          className="mentions__input"
          type="text"
          pattern="[a-zA-Z0-9\s]+"
          style={{ backgroundColor: "transparent" }}
          placeholder="Add label..."
          maxLength={24}
          autoFocus
          value={labelText}
          // Dont allow brackets since its needed for label puller
          // eslint-disable-next-line no-useless-escape
          onChange={e => setLabelText(e.target.value.replace(/[\[\]\(\)]/g, ""))}
          onKeyDown={e => onAddLabel(e)}
        />
        {labels.map((label) => (
          <div className="label-item" key={label.id}> 
            <span 
              className="label-item-text" 
              style={{backgroundColor: label.color}}
            >
              {label.display}
            </span>
            <span className="label-item-action-container">
              <FormatColorFillIcon 
                onClick={() => shiftLabelColor(label.id)} 
                style={{color: "grey", marginTop: "6px"}}
                className="button-icon"
              />
              <CloseIcon 
                onClick={() => deleteLabel(label.id)} 
                style={{color: "grey"}}
                className="button-icon"
              />
            </span>
          </div>
        ))}
      </div>
    </OutsideClickHandler>
  );

  const renderSettings = () => (
    <div className="settings-container">
      <div className="settings-content-container">
        <div className="header-container">
          <img alt="logo" src={KanbieLogo} width={60} className="kanbie-logo"/>
          <div className="header settings-header">
            kanbie
          </div>
        </div>
        <div className="close-button" onClick={() => setShowSettings(false)}>
          <CloseIcon color={theme.delCol} size={30}/>
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
            {Object.keys(themes).map(themeName => (
              <span 
                className={themeName === settings.theme ? 
                  "select-item select-item-selected" : 
                  "select-item"
                }
                onClick={() => setSettings((currSettings) => ({
                  ...currSettings,
                  theme: themeName,
                }))}
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
              className={
                settings.hideKanbieText ? 
                  "select-item select-item-selected" : 
                  "select-item"
              }
              onClick={() => setSettings((currSettings) => ({
                ...currSettings,
                hideKanbieText: true,
              }))}
            >
              yes
            </span>
            <span 
              className={
                !settings.hideKanbieText ? 
                  "select-item select-item-selected" : 
                  "select-item"
              }
              onClick={() => setSettings((currSettings) => ({
                ...currSettings,
                hideKanbieText: false,
              }))}
            >
              no
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const deleteLabel = (labelId) => {
    const remainingLabels = [...labels].filter(label => label.id !== labelId);
    setLabels(remainingLabels);
  };

  const shiftLabelColor = (labelId) => {
    const labelsCopy = [...labels];
    const labelIndex = labelsCopy.findIndex(label => label.id === labelId);
    labelsCopy[labelIndex].color = theme.panelColors[
      theme.panelColors.findIndex(panelColor => panelColor === labelsCopy[labelIndex].color)
    + 1] || theme.panelColors[0];

    setLabels(labelsCopy);
  };

	const addOrEditCurrAlarmToAlarms = (cardId) => {
		if (currDateAlarm && currTimeAlarm) {
			// Add alarm
			const alarmDue = moment(`${currDateAlarm} ${currTimeAlarm}`, "DD/MM/YYYY HH:mm");
			if (alarmDue.isValid) {
				const alarmIsoString = alarmDue.toISOString(false);
				setAlarms({
					...alarms,
					[cardId]: {
						alarmDue: alarmIsoString,
						notified: false,
					}
				})
			} else {
				console.warn(`Invalid time: ${alarmDue}`);
			}
		} else {
			// Remove alarm if exists
			const { [cardId]: currAlarm, ...remainingAlarms } = alarms;
			setAlarms(remainingAlarms);
		}
	}

  const onAddCard = (e) => {
    if (e.key === "Enter" && filterString(inputText) !== "") {
			const cardId = uuid();
      const columnsCopy = [...columns];
      columnsCopy[0].items.push({
        id: cardId,
        content: inputText
      });

			addOrEditCurrAlarmToAlarms(cardId);
			// Reset inputting
      setColumns(columnsCopy);
      setInputExpanded(false);
      setInputText("");
      setCurrLabels({});
			clearCurrAlarm();
    }
  };

  const onKeypressEditCard = (e) => {
    if (e.key === "Enter" && filterString(inputText) !== "") {
      saveAndResetEditing();
    }
  };

  const onKeypressEditHeader = (e) => {
    if (e.key === "Enter" && filterString(inputText) !== "") {
      saveAndResetEditingHeader();
    }
  };

  const onAddLabel = (e) => {
    if(e.key === "Enter" && labelText !== "") {
      labels.push({
        id: uuid(),
        display: labelText,
        color: theme.panelColors[Math.floor(Math.random() * theme.panelColors.length)]
      });

      setLabelText("");
    }
  }

  const getLabelsFromCard = (cardText) => {
    const filteredLabels = cardText.match(labelRegex);
    if (!filteredLabels) {
      return;
    }

    return (
      <div className="card-label-container">
        {filteredLabels.reverse().map(filteredLabel => (
          labels.find(label => 
            label.id === filteredLabel.replace(labelRegex, "$2")
          ) && 
            <span 
              key={filteredLabel}
              className="card-label-item"
              style={{backgroundColor: 
                labels.find(label => 
                  label.id === filteredLabel.replace(labelRegex, "$2")
                )?.color || theme.backgroundDark
              }}
            >
              {filteredLabel.replace(labelRegex, "$1")}
            </span>
          ))}
      </div>
    );
  }

	const getAlarmForCard = (cardId) => {
		if (alarms[cardId]) {
			const dueTime = moment(alarms[cardId].alarmDue);
			return (
				<div 
					className="curr-labels-container curr-time-container card-time-container"
					style={{ backgroundColor: dueTime.isBefore() ? theme.delCol : theme.accentColored }}
				>
					<span className="curr-label-item">
						<BellRingIcon size={16} style={{ marginRight: "6px" }} />
						Due {dueTime.fromNow()}
					</span>
				</div>
			);
		} else {
			return <></>;
		}
	};

  return (
    <div>
      <div className="header-container">
        <img 
          alt="logo" 
          src={KanbieLogo} 
          width={28} 
          className={
						settings?.hideKanbieText ? "header kanbie-logo-color" : "kanbie-logo kanbie-logo-color"
					}
        />
        {!settings?.hideKanbieText && (
          <div className="header">
            kanbie
          </div>
        )}
      </div>
      {!!loaded && 
      <div className="main-container">
        <DragDropContext
          onDragEnd={onDragEnd}
        >
          {columns.map((column, colNum) => (
            <div key={column.title}>
              <div className="column-header-container">
                {(isEditingId === column.title) ? (
                  <OutsideClickHandler onOutsideClick={() => saveAndResetEditingHeader()}>
                    <input 
                      className="column-heading-editing"
                      autoFocus
                      onKeyDown={e => onKeypressEditHeader(e)}
                      onChange={e => setInputText(e.target.value)}
                      value={inputText}
                      maxLength={14}
                    />
                  </OutsideClickHandler>
                ) : (
                  <div 
                    className="column-heading"
                    onDoubleClick={() => {
                      setInputText(column.newTitle || column.title);
                      setEditingId(column.title);
                    }}
                  >
                    {column?.newTitle || column.title}
                  </div>
                )}
                {colNum === 0 && <CheckboxMarkedCircleOutlineIcon {...columnIconProps}/>}
                {colNum === 1 && <ProgressCheckIcon {...columnIconProps}/>}
                {colNum === 2 && <CheckboxMarkedCircleIcon {...columnIconProps}/>}
              </div>
              <Droppable droppableId={column.title}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      borderColor: theme.columnBorderColor,
                      borderWidth: snapshot.isDraggingOver ? "2px" : 0,
                      backgroundColor: theme.columnBgColor,
                    }}
                    className="droppable-container column-container"
                  > 
                    {column.items.map((item, i) => {
                      if (isEditingId === item.id) {
                        if (!startedEditing) {
													// Set curr labels
                          const itemLabels = {};
                          const itemLabelsRaw = item.content.match(labelRegex);
                          const itemLabelIds = itemLabelsRaw?.map(label => label.match(/\(.*\)/)[0].slice(1, -1))
                          if (itemLabelIds?.length) {
                            itemLabelIds.reverse().forEach((labelId) => {
                              if (labels.find((lbl) => lbl.id === labelId)) {
                                itemLabels[labelId] = labels.find((lbl) => lbl.id === labelId)?.display
                              }
                            });
                          }
                          setCurrLabels(itemLabels ?? {});
                          setStartedEditing(true);
													// Set curr alarm
													const currAlarm = alarms[item.id];
													if (currAlarm) {
														setCurrDateAlarm(moment(currAlarm.alarmDue).format("DD/MM/YYYY"));
														setCurrTimeAlarm(moment(currAlarm.alarmDue).format("HH:mm"));
													}
                        }
                        return (
                          <OutsideClickHandler 
                            key={item.id}
                            onOutsideClick={() => saveAndResetEditing()}
                          >
                            <div className="input-container-inplace">
															{renderMentionsComponent("Edit task...", "input-add-inplace", onKeypressEditCard)}
                              {!!Object.values(currLabels).length && 
                                <div className="curr-labels-container">
                                  {Object.keys(currLabels).map((keyLabel) => (
                                    <span 
                                      className="curr-label-item"
                                      style={{backgroundColor: labels.find(label => label.id === keyLabel).color}}
                                      key={keyLabel}
                                    >
                                      {currLabels[keyLabel]}
																			<CloseCirleIcon 
																				onClick={() => removeCurrLabel(keyLabel)} 
																				className="remove-label-icon"
																			/>
                                    </span>
                                  ))}
                                </div>
                              }
															{(currDateAlarm && currTimeAlarm) && 
                                <div className="curr-labels-container curr-time-container">
																	<span className="curr-label-item">
																		<BellRingIcon size={16} style={{ marginRight: "6px" }} />
																		{moment(`${currDateAlarm} ${currTimeAlarm}`, "DD/MM/YYYY HH:mm").format("dddd DD/MM, h:mmA")}
																		<CloseCirleIcon 
																			onClick={() => clearCurrAlarm()} 
																			className="remove-label-icon"
																		/>
																	</span>
                                </div>
                              }
                            </div>
                          </OutsideClickHandler>
                        );
                      } else {
                        return (
                          <Draggable key={item.id} draggableId={item.content + item.id} index={i}>
                            {(provided, snapshot) => (
                              <div 
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                style={{
                                  userSelect: 'none',
                                  backgroundColor: snapshot.isDragging ? theme.cardBgActiveCol : theme.cardBgCol,
                                  ...provided.draggableProps.style,
                                }}
                                className="draggable-card"
                                onDoubleClick={() => setEditing(item)}
                              >
                                {item.content.replace(labelRegex, '')}
                                {getLabelsFromCard(item.content)}
																{getAlarmForCard(item.id)}
                              </div>
                            )}
                          </Draggable>
                        );
                      }
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
          <Droppable droppableId="trash">
            {(provided, snapshot) => (
							<div className="droppable-trash-parent">
								<div
									{...provided.droppableProps}
									ref={provided.innerRef}
									className="droppable-container droppable-trash"
								/>
								{/* Dummy placeholder */}
								<div
									style={{
										background: snapshot.isDraggingOver ? theme.delActiveCol : theme.delCol,
										width: snapshot.isDraggingOver ? "200px" : "20px",
										height: snapshot.isDraggingOver ? "200px" : "23px",
									}}
									className="droppable-trash-placeholder"
								> 
									<DeleteForeverIcon color={theme.accent} className="delete-icon"/>
									<span 
										className={`delete-me-text ${snapshot.isDraggingOver ? "transitioner" : ""}`}
									>
										Remove task
									</span>
								</div>
							</div>
            )}  
          </Droppable>
        </DragDropContext>
        <div
          className="droppable-container droppable-clear-all button-icon"
          onClick={() => onDeleteAllDone()}
        > 
          <NotificationClearAllIcon color={theme.accent} className="delete-all-icon"/>
        </div>
        <div 
          className="add-button-container droppable-container"
          onClick={() => setInputExpanded(!inputExpanded)}
        >
          <PlusIcon color={theme.accent} className="add-icon"/>
        </div>
        <div 
          className="labels-button-container droppable-container"
          onClick={() => setLabelsListExpanded(!labelsListExpanded)}
        >
          <LabelMultipleIcon color={theme.accent} className="add-icon"/>
        </div>
        <div 
          className="settings-button-container droppable-container"
          onClick={() => setShowSettings(true)}
        >
          <CogIcon color={theme.accent} className="add-icon"/>
        </div>
        {!!inputExpanded && renderInputBox()}
        {!!labelsListExpanded && renderLabelsList()}
        {!!showSettings && renderSettings()}
      </div>
      }
    </div>
  );
}

export default App;
