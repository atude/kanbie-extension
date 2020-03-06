/*global chrome*/
import React, { useState, useEffect } from 'react';
import './App.css';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import CheckboxMarkedCircleOutlineIcon from 'mdi-react/CheckboxMarkedCircleOutlineIcon';
import CheckboxMarkedCircleIcon from 'mdi-react/CheckboxMarkedCircleIcon';
import ProgressCheckIcon from 'mdi-react/ProgressCheckIcon';
import DeleteForeverIcon from 'mdi-react/DeleteForeverIcon';
import PlusIcon from 'mdi-react/PlusIcon';
import LabelMultipleIcon from 'mdi-react/LabelMultipleIcon';

import initColumns from './constants/InitColumns';
import KanbieLogo from './assets/kanbie-logo.svg';
import uuid from 'uuid';
import OutsideClickHandler from 'react-outside-click-handler';
import { columnBorderColor, columnBgColor, cardBgActiveCol, cardBgCol, delActiveCol, delCol } from './constants/Colors';
import { MentionsInput, Mention } from 'react-mentions'

const maxItems = 10;
const columnIconProps = {
  size: 24,
  color: "#fff",
  style: {marginBottom: "8px"}
};

const labelsData = [{display: "impactio", id: "yes"}, {display: "smth", id: "no"}];

function App() {
  const [columns, setColumns] = useState();
  const [labels, setLabels] = useState(labelsData);
  const [isInput, setInput] = useState(false);
  const [inputText, setInputText] = useState("");
  const [labelsListExpanded, setLabelsListExpanded] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load data
  useEffect(() => {
    let getColumns;
    try {
      chrome.storage.sync.get("columns", function(data) {
        if (!chrome.runtime.error) {
          getColumns = data.columns;
        }
  
        if(!getColumns || getColumns === "undefined") {
          setColumns(initColumns);
        } else {
          setColumns(getColumns);
        }
    
        setLoaded(true);
      });
    } catch (error) {
      console.warn("Error syncing with chrome extensions. Are you using this as a webapp?");
      console.error(error);

      setColumns(initColumns);
      setLoaded(true);
    }

    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        handleClickAdd(); 
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveColumns = (columns) => {
    try {
      chrome.storage.sync.set({
        "columns": columns
      }, function() {
        if (chrome.runtime.error) {
          console.log("Runtime error. Failed to save data");
        }
      });
    } catch (error) {
      console.warn("Error syncing with chrome extensions. Are you using this as a webapp?");
      console.error(error);
    }
  }

  const onDragEnd = (result) => {
    const { source, destination } = result;
    const currColumns = [...columns];

    if(!destination) return;

    //Delete
    if(destination.droppableId === "trash") {
      const sourceItems = currColumns.filter((column => column.title === source.droppableId))[0].items;
      sourceItems.splice(source.index, 1);
    } else {
      //Different column
      if(source.droppableId !== destination.droppableId) {
        const sourceItems = currColumns.filter((column => column.title === source.droppableId))[0].items;
        const destItems = currColumns.filter((column => column.title === destination.droppableId))[0].items;
        if(destItems.length >= maxItems) return;
        const [removed] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, removed);
      } else {
        //Same column
        const sourceItems = currColumns.filter((column => column.title === source.droppableId))[0].items;
        const [removed] = sourceItems.splice(source.index, 1);
        sourceItems.splice(destination.index, 0, removed);
      }
    }

    saveColumns(currColumns);
  }

  const renderInputBox = () => (
    <OutsideClickHandler 
      onOutsideClick={() => {
        setInput(false);
        setInputText("");
      }}
    >
      <MentionsInput 
        value={inputText} 
        onChange={e => setInputText(e.target.value)}
        placeholder="New task..."
        className="mentions input-add"
        onKeyDown={e => onAddCard(e)}
        autoFocus
        maxLength={100}
      >
        <Mention
          className="mentions__mention"
          trigger="#"
          data={labelsData}
          displayTransform={() => ""}
        />
      </MentionsInput>
    </OutsideClickHandler>
  )

  const renderLabelsList = () => (
    <OutsideClickHandler onOutsideClick={() => setLabelsListExpanded(false)}>
      <div className="labels-list">
        {labels.map(label => (
          <div className="label-item"> 
            {label.display}
          </div>
        ))}
      </div>
    </OutsideClickHandler>
  )

  const handleClickAdd = () => {
    if(!isInput) {
      setInput(true);
    }
  }

  const onAddCard = (e) => {
    if(e.key === "Enter" && inputText !== "") {
      columns[0].items.push({
        id: uuid(),
        content: inputText
      });

      setInput(false);
      saveColumns(columns);
      setInputText("");
    }

    return;
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
          {columns.map(column => (
            <div>
              <div className="column-header-container">
                <div className="column-heading">{column.title}</div>
                {column.title === "To-do" && <CheckboxMarkedCircleOutlineIcon {...columnIconProps}/>}
                {column.title === "Doing" && <ProgressCheckIcon {...columnIconProps}/>}
                {column.title === "Done" && <CheckboxMarkedCircleIcon {...columnIconProps}/>}
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
                    {column.items.map((item, i) => (
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
                          >
                            {item.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
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

                }}
                className="droppable-container droppable-trash"
              > 
                <DeleteForeverIcon color="#fff" className="delete-icon"/>
              </div>
            )}  
          </Droppable>
        </DragDropContext>
        <div 
          className="add-button-container droppable-container"
          onClick={() => handleClickAdd()}
        >
          <PlusIcon color="#fff" className="add-icon"/>
          {!!isInput && renderInputBox()}
        </div>
        <div 
          className="labels-button-container droppable-container"
          onClick={() => setLabelsListExpanded(!labelsListExpanded)}
        >
          <LabelMultipleIcon color="#fff" className="add-icon"/>
          {!!labelsListExpanded && renderLabelsList()}
        </div>
      </div>
      }
    </div>
  );
}

export default App;
