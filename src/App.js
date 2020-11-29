/*global chrome*/

/* 

  TODO

  - Add themes
 
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
import uuid from 'uuid';
import OutsideClickHandler from 'react-outside-click-handler';
import { 
  columnBorderColor, 
  columnBgColor, 
  cardBgActiveCol, 
  cardBgCol, 
  delActiveCol, 
  delCol,
  colorPanelColors
} from './constants/Colors';
import { MentionsInput, Mention } from 'react-mentions'

import KanbieLogo from './assets/kanbie-logo.svg';
import CheckboxMarkedCircleOutlineIcon from 'mdi-react/CheckboxMarkedCircleOutlineIcon';
import CheckboxMarkedCircleIcon from 'mdi-react/CheckboxMarkedCircleIcon';
import ProgressCheckIcon from 'mdi-react/ProgressCheckIcon';
import DeleteForeverIcon from 'mdi-react/DeleteForeverIcon';
import PlusIcon from 'mdi-react/PlusIcon';
import LabelMultipleIcon from 'mdi-react/LabelMultipleIcon';
import CloseIcon from 'mdi-react/CloseIcon';
import FormatColorFillIcon from 'mdi-react/FormatColorFillIcon';
import NotificationClearAllIcon from 'mdi-react/NotificationClearAllIcon';
import CogIcon from 'mdi-react/CogIcon';
import { filterString } from './utils';

const currYear = new Date().getFullYear();
const maxItems = 10;
const labelRegex = /@\[([^\]]*)\]\(([^)]*)\)/g;
const columnIconProps = {
  size: 24,
  color: "#fff",
  style: { marginBottom: "8px" }
};

function App() {
  const [columns, setColumns] = useState(initColumns);
  const [labels, setLabels] = useState([]);
  const [currLabels, setCurrLabels] = useState({});
  const [inputExpanded, setInputExpanded] = useState(false);
  const [inputText, setInputText] = useState("");
  const [labelsListExpanded, setLabelsListExpanded] = useState(false);
  const [labelText, setLabelText] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [isEditingId, setEditingId] = useState();
  const [startedEditing, setStartedEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const setEditing = (item) => {
    setEditingId(item.id);
    setInputText(item.content);
  };

  const saveAndResetEditing = () => {
    onEditTask();
    setEditingId();
    setInputText("");
    setCurrLabels({});
    setStartedEditing(false);
  };

  const saveAndResetEditingHeader = () => {
    onEditHeader();
    setEditingId();
    setInputText("");
    setCurrLabels({});
    setStartedEditing(false);
  };

  // Load data
  useEffect(() => {
    let getColumns;
    let getLabels;
    try {
      chrome.storage.sync.get("columns", function(data) {
        if (!chrome.runtime.error) {
          getColumns = data.columns;
        }
  
        if(getColumns && getColumns !== "undefined") {
          setColumns(getColumns);
        }
      });
      chrome.storage.sync.get("labels", function(data) {
        if (!chrome.runtime.error) {
          getLabels = data.labels;
        }
  
        if(getLabels && getLabels !== "undefined") {
          setLabels(getLabels);
        }
      });
      setLoaded(true);
    } catch (error) {
      console.warn("Error syncing with chrome extensions. Are you using this as a webapp?");
      setLoaded(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  

  useEffect(() => {
    // console.log(columns);
    try {
      chrome.storage.sync.set({
        "columns": columns,
        "labels": labels
      }, function() {
        if (chrome.runtime.error) {
          console.log("Runtime error. Failed to save data");
        }
      });
    } catch (error) {
      console.warn("Error syncing with chrome extensions. Are you using this as a webapp?");
    }
  }, [columns, labels])

  useEffect(() => {
    document.addEventListener("keydown", keyShortcutHandler);
    return () => {
      document.removeEventListener('keydown', keyShortcutHandler);
    };
  });

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
      } else if (inputExpanded && inputText === "") {
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
      sourceItems.splice(source.index, 1);
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
    setCurrLabels({...currLabels, [id]: display});
  };

  const renderInputBox = () => (
    <OutsideClickHandler 
      onOutsideClick={() => {
        setInputExpanded(false);
        setInputText("");
        setCurrLabels({});
      }}
    >
      <div className="input-container">
        <MentionsInput 
          value={inputText} 
          onChange={e => setInputText(e.target.value)}
          placeholder="New task..."
          className="mentions input-add"
          onKeyDown={e => onAddCard(e)}
          autoFocus
          maxLength={100}
          allowSpaceInQuery
        >
          <Mention
            className="mentions__mention"
            trigger="#"
            data={labels.filter((label => !currLabels[label.id]))}
            displayTransform={() => ""}
            onAdd={(id, display) => addCurrLabel(id, display)}
          />
        </MentionsInput>
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
          <CloseIcon color={delCol} size={30}/>
        </div>
        <span className="copyright-header">atude (Mozamel Anwary) © {currYear}</span>
        <div className="settings-shortcuts-container">
          <p className="shortcuts-header">Shortcuts</p>
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
            <span>Add a label to a task (when creating/editing task)</span>
          </div>
          <div className="shortcut-item">
            <span><i>double click</i></span>
            <span>Edit task or column header</span>
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
    labelsCopy[labelIndex].color = colorPanelColors[
      colorPanelColors.findIndex(panelColor => panelColor === labelsCopy[labelIndex].color)
    + 1] || colorPanelColors[0];

    setLabels(labelsCopy);
  };

  const onAddCard = (e) => {
    if (e.key === "Enter" && filterString(inputText) !== "") {
      const columnsCopy = [...columns];
      columnsCopy[0].items.push({
        id: uuid(),
        content: inputText
      });

      setColumns(columnsCopy);
      setInputExpanded(false);
      setInputText("");
      setCurrLabels({});
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
        color: colorPanelColors[Math.floor(Math.random() * colorPanelColors.length)]
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
                )?.color || "#000"
              }}
            >
              {filteredLabel.replace(labelRegex, "$1")}
            </span>
          ))}
      </div>
    );
  }

  return (
    <div>
      <div className="header-container">
        <img alt="logo" src={KanbieLogo} width={28} className="kanbie-logo"/>
        <div className="header">
          kanbie
        </div>
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
                      borderColor: columnBorderColor,
                      borderWidth: snapshot.isDraggingOver ? "2px" : 0,
                      backgroundColor: columnBgColor,
                    }}
                    className="droppable-container column-container"
                  > 
                    {column.items.map((item, i) => {
                      if (isEditingId === item.id) {
                        if (!startedEditing) {
                          const itemLabels = {};
                          const itemLabelsRaw = item.content.match(labelRegex);
                          const itemLabelIds = itemLabelsRaw?.map(label => label.match(/\(.*\)/)[0].slice(1, -1))
                          if (itemLabelIds?.length) {
                            itemLabelIds.reverse().forEach((labelId) => {
                              itemLabels[labelId] = labels.find((lbl) => lbl.id === labelId).display
                            });
                          }
                          setCurrLabels(itemLabels ?? {});
                          setStartedEditing(true);
                        }
                        return (
                          <OutsideClickHandler 
                            key={item.id}
                            onOutsideClick={() => saveAndResetEditing()}
                          >
                            <div className="input-container-inplace">
                              <MentionsInput 
                                value={inputText} 
                                onChange={e => setInputText(e.target.value)}
                                placeholder="Edit task..."
                                className="mentions input-add-inplace"
                                onKeyDown={e => onKeypressEditCard(e)}
                                autoFocus
                                maxLength={100}
                                allowSpaceInQuery
                              >
                                <Mention
                                  className="mentions__mention"
                                  trigger="#"
                                  data={labels.filter((label => !currLabels[label.id]))}
                                  displayTransform={() => ""}
                                  onAdd={(id, display) => addCurrLabel(id, display)}
                                />
                              </MentionsInput>
                              {!!Object.values(currLabels).length && 
                                <div className="curr-labels-container">
                                  {Object.keys(currLabels).map((keyLabel, i) => (
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
                                  backgroundColor: snapshot.isDragging ? cardBgActiveCol : cardBgCol,
                                  ...provided.draggableProps.style
                                }}
                                className="draggable-card"
                                onDoubleClick={() => setEditing(item)}
                              >
                                {item.content.replace(labelRegex, '')}
                                {getLabelsFromCard(item.content)}
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
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  background: snapshot.isDraggingOver ? delActiveCol : delCol,
                  width: snapshot.isDraggingOver ? "200px" : "20px"
                }}
                className="droppable-container droppable-trash"
              > 
                <DeleteForeverIcon color="#fff" className="delete-icon"/>
                <span 
                  className={`delete-me-text ${snapshot.isDraggingOver ? "transitioner" : ""}`}
                >
                  Delete me!
                </span>
              </div>
            )}  
          </Droppable>
        </DragDropContext>
        <div
          className="droppable-container droppable-clear-all button-icon"
          onClick={() => onDeleteAllDone()}
        > 
          <NotificationClearAllIcon color="#fff" className="delete-all-icon"/>
        </div>
        <div 
          className="add-button-container droppable-container"
          onClick={() => setInputExpanded(!inputExpanded)}
        >
          <PlusIcon color="#fff" className="add-icon"/>
        </div>
        <div 
          className="labels-button-container droppable-container"
          onClick={() => setLabelsListExpanded(!labelsListExpanded)}
        >
          <LabelMultipleIcon color="#fff" className="add-icon"/>
        </div>
        <div 
          className="settings-button-container droppable-container"
          onClick={() => setShowSettings(true)}
        >
          <CogIcon color="#fff" className="add-icon"/>
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
