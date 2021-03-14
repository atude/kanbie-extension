/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateBoardInput = {
  id?: string | null,
};

export type ModelBoardConditionInput = {
  and?: Array< ModelBoardConditionInput | null > | null,
  or?: Array< ModelBoardConditionInput | null > | null,
  not?: ModelBoardConditionInput | null,
};

export type Board = {
  __typename: "Board",
  id?: string,
  columns?:  Array<TaskColumn > | null,
  createdAt?: string,
  updatedAt?: string,
};

export type TaskColumn = {
  __typename: "TaskColumn",
  id?: string,
  name?: string,
  tasks?:  Array<Task > | null,
  createdAt?: string,
  updatedAt?: string,
};

export type Task = {
  __typename: "Task",
  id?: string,
  content?: string,
  createdAt?: string,
  updatedAt?: string,
};

export type UpdateBoardInput = {
  id: string,
};

export type DeleteBoardInput = {
  id?: string | null,
};

export type CreateTaskColumnInput = {
  id?: string | null,
  name: string,
};

export type ModelTaskColumnConditionInput = {
  name?: ModelStringInput | null,
  and?: Array< ModelTaskColumnConditionInput | null > | null,
  or?: Array< ModelTaskColumnConditionInput | null > | null,
  not?: ModelTaskColumnConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type UpdateTaskColumnInput = {
  id: string,
  name?: string | null,
};

export type DeleteTaskColumnInput = {
  id?: string | null,
};

export type CreateTaskInput = {
  id?: string | null,
  content: string,
};

export type ModelTaskConditionInput = {
  content?: ModelStringInput | null,
  and?: Array< ModelTaskConditionInput | null > | null,
  or?: Array< ModelTaskConditionInput | null > | null,
  not?: ModelTaskConditionInput | null,
};

export type UpdateTaskInput = {
  id: string,
  content?: string | null,
};

export type DeleteTaskInput = {
  id?: string | null,
};

export type CreateSettingsInput = {
  id?: string | null,
  theme: Theme,
  hideKanbieText: boolean,
};

export enum Theme {
  dark = "dark",
  light = "light",
}


export type ModelSettingsConditionInput = {
  theme?: ModelThemeInput | null,
  hideKanbieText?: ModelBooleanInput | null,
  and?: Array< ModelSettingsConditionInput | null > | null,
  or?: Array< ModelSettingsConditionInput | null > | null,
  not?: ModelSettingsConditionInput | null,
};

export type ModelThemeInput = {
  eq?: Theme | null,
  ne?: Theme | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type Settings = {
  __typename: "Settings",
  id?: string,
  theme?: Theme,
  hideKanbieText?: boolean,
  createdAt?: string,
  updatedAt?: string,
};

export type UpdateSettingsInput = {
  theme?: Theme | null,
  hideKanbieText?: boolean | null,
};

export type DeleteSettingsInput = {
  id?: string | null,
};

export type ModelBoardFilterInput = {
  id?: ModelIDInput | null,
  and?: Array< ModelBoardFilterInput | null > | null,
  or?: Array< ModelBoardFilterInput | null > | null,
  not?: ModelBoardFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelBoardConnection = {
  __typename: "ModelBoardConnection",
  items?:  Array<Board | null > | null,
  nextToken?: string | null,
};

export type ModelTaskColumnFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  and?: Array< ModelTaskColumnFilterInput | null > | null,
  or?: Array< ModelTaskColumnFilterInput | null > | null,
  not?: ModelTaskColumnFilterInput | null,
};

export type ModelTaskColumnConnection = {
  __typename: "ModelTaskColumnConnection",
  items?:  Array<TaskColumn | null > | null,
  nextToken?: string | null,
};

export type ModelTaskFilterInput = {
  id?: ModelIDInput | null,
  content?: ModelStringInput | null,
  and?: Array< ModelTaskFilterInput | null > | null,
  or?: Array< ModelTaskFilterInput | null > | null,
  not?: ModelTaskFilterInput | null,
};

export type ModelTaskConnection = {
  __typename: "ModelTaskConnection",
  items?:  Array<Task | null > | null,
  nextToken?: string | null,
};

export type ModelSettingsFilterInput = {
  theme?: ModelThemeInput | null,
  hideKanbieText?: ModelBooleanInput | null,
  and?: Array< ModelSettingsFilterInput | null > | null,
  or?: Array< ModelSettingsFilterInput | null > | null,
  not?: ModelSettingsFilterInput | null,
};

export type ModelSettingsConnection = {
  __typename: "ModelSettingsConnection",
  items?:  Array<Settings | null > | null,
  nextToken?: string | null,
};

export type CreateBoardMutationVariables = {
  input?: CreateBoardInput,
  condition?: ModelBoardConditionInput | null,
};

export type CreateBoardMutation = {
  createBoard?:  {
    __typename: "Board",
    id: string,
    columns?:  Array< {
      __typename: "TaskColumn",
      id: string,
      name: string,
      tasks?:  Array< {
        __typename: "Task",
        id: string,
        content: string,
        createdAt: string,
        updatedAt: string,
      } > | null,
      createdAt: string,
      updatedAt: string,
    } > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateBoardMutationVariables = {
  input?: UpdateBoardInput,
  condition?: ModelBoardConditionInput | null,
};

export type UpdateBoardMutation = {
  updateBoard?:  {
    __typename: "Board",
    id: string,
    columns?:  Array< {
      __typename: "TaskColumn",
      id: string,
      name: string,
      tasks?:  Array< {
        __typename: "Task",
        id: string,
        content: string,
        createdAt: string,
        updatedAt: string,
      } > | null,
      createdAt: string,
      updatedAt: string,
    } > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteBoardMutationVariables = {
  input?: DeleteBoardInput,
  condition?: ModelBoardConditionInput | null,
};

export type DeleteBoardMutation = {
  deleteBoard?:  {
    __typename: "Board",
    id: string,
    columns?:  Array< {
      __typename: "TaskColumn",
      id: string,
      name: string,
      tasks?:  Array< {
        __typename: "Task",
        id: string,
        content: string,
        createdAt: string,
        updatedAt: string,
      } > | null,
      createdAt: string,
      updatedAt: string,
    } > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateTaskColumnMutationVariables = {
  input?: CreateTaskColumnInput,
  condition?: ModelTaskColumnConditionInput | null,
};

export type CreateTaskColumnMutation = {
  createTaskColumn?:  {
    __typename: "TaskColumn",
    id: string,
    name: string,
    tasks?:  Array< {
      __typename: "Task",
      id: string,
      content: string,
      createdAt: string,
      updatedAt: string,
    } > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateTaskColumnMutationVariables = {
  input?: UpdateTaskColumnInput,
  condition?: ModelTaskColumnConditionInput | null,
};

export type UpdateTaskColumnMutation = {
  updateTaskColumn?:  {
    __typename: "TaskColumn",
    id: string,
    name: string,
    tasks?:  Array< {
      __typename: "Task",
      id: string,
      content: string,
      createdAt: string,
      updatedAt: string,
    } > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteTaskColumnMutationVariables = {
  input?: DeleteTaskColumnInput,
  condition?: ModelTaskColumnConditionInput | null,
};

export type DeleteTaskColumnMutation = {
  deleteTaskColumn?:  {
    __typename: "TaskColumn",
    id: string,
    name: string,
    tasks?:  Array< {
      __typename: "Task",
      id: string,
      content: string,
      createdAt: string,
      updatedAt: string,
    } > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateTaskMutationVariables = {
  input?: CreateTaskInput,
  condition?: ModelTaskConditionInput | null,
};

export type CreateTaskMutation = {
  createTask?:  {
    __typename: "Task",
    id: string,
    content: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateTaskMutationVariables = {
  input?: UpdateTaskInput,
  condition?: ModelTaskConditionInput | null,
};

export type UpdateTaskMutation = {
  updateTask?:  {
    __typename: "Task",
    id: string,
    content: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteTaskMutationVariables = {
  input?: DeleteTaskInput,
  condition?: ModelTaskConditionInput | null,
};

export type DeleteTaskMutation = {
  deleteTask?:  {
    __typename: "Task",
    id: string,
    content: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateSettingsMutationVariables = {
  input?: CreateSettingsInput,
  condition?: ModelSettingsConditionInput | null,
};

export type CreateSettingsMutation = {
  createSettings?:  {
    __typename: "Settings",
    id: string,
    theme: Theme,
    hideKanbieText: boolean,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateSettingsMutationVariables = {
  input?: UpdateSettingsInput,
  condition?: ModelSettingsConditionInput | null,
};

export type UpdateSettingsMutation = {
  updateSettings?:  {
    __typename: "Settings",
    id: string,
    theme: Theme,
    hideKanbieText: boolean,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteSettingsMutationVariables = {
  input?: DeleteSettingsInput,
  condition?: ModelSettingsConditionInput | null,
};

export type DeleteSettingsMutation = {
  deleteSettings?:  {
    __typename: "Settings",
    id: string,
    theme: Theme,
    hideKanbieText: boolean,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetBoardQueryVariables = {
  id?: string,
};

export type GetBoardQuery = {
  getBoard?:  {
    __typename: "Board",
    id: string,
    columns?:  Array< {
      __typename: "TaskColumn",
      id: string,
      name: string,
      tasks?:  Array< {
        __typename: "Task",
        id: string,
        content: string,
        createdAt: string,
        updatedAt: string,
      } > | null,
      createdAt: string,
      updatedAt: string,
    } > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListBoardsQueryVariables = {
  filter?: ModelBoardFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListBoardsQuery = {
  listBoards?:  {
    __typename: "ModelBoardConnection",
    items?:  Array< {
      __typename: "Board",
      id: string,
      columns?:  Array< {
        __typename: "TaskColumn",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      } > | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetTaskColumnQueryVariables = {
  id?: string,
};

export type GetTaskColumnQuery = {
  getTaskColumn?:  {
    __typename: "TaskColumn",
    id: string,
    name: string,
    tasks?:  Array< {
      __typename: "Task",
      id: string,
      content: string,
      createdAt: string,
      updatedAt: string,
    } > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListTaskColumnsQueryVariables = {
  filter?: ModelTaskColumnFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTaskColumnsQuery = {
  listTaskColumns?:  {
    __typename: "ModelTaskColumnConnection",
    items?:  Array< {
      __typename: "TaskColumn",
      id: string,
      name: string,
      tasks?:  Array< {
        __typename: "Task",
        id: string,
        content: string,
        createdAt: string,
        updatedAt: string,
      } > | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetTaskQueryVariables = {
  id?: string,
};

export type GetTaskQuery = {
  getTask?:  {
    __typename: "Task",
    id: string,
    content: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListTasksQueryVariables = {
  filter?: ModelTaskFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTasksQuery = {
  listTasks?:  {
    __typename: "ModelTaskConnection",
    items?:  Array< {
      __typename: "Task",
      id: string,
      content: string,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetSettingsQueryVariables = {
  id?: string,
};

export type GetSettingsQuery = {
  getSettings?:  {
    __typename: "Settings",
    id: string,
    theme: Theme,
    hideKanbieText: boolean,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListSettingssQueryVariables = {
  filter?: ModelSettingsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListSettingssQuery = {
  listSettingss?:  {
    __typename: "ModelSettingsConnection",
    items?:  Array< {
      __typename: "Settings",
      id: string,
      theme: Theme,
      hideKanbieText: boolean,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type OnCreateBoardSubscription = {
  onCreateBoard?:  {
    __typename: "Board",
    id: string,
    columns?:  Array< {
      __typename: "TaskColumn",
      id: string,
      name: string,
      tasks?:  Array< {
        __typename: "Task",
        id: string,
        content: string,
        createdAt: string,
        updatedAt: string,
      } > | null,
      createdAt: string,
      updatedAt: string,
    } > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateBoardSubscription = {
  onUpdateBoard?:  {
    __typename: "Board",
    id: string,
    columns?:  Array< {
      __typename: "TaskColumn",
      id: string,
      name: string,
      tasks?:  Array< {
        __typename: "Task",
        id: string,
        content: string,
        createdAt: string,
        updatedAt: string,
      } > | null,
      createdAt: string,
      updatedAt: string,
    } > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteBoardSubscription = {
  onDeleteBoard?:  {
    __typename: "Board",
    id: string,
    columns?:  Array< {
      __typename: "TaskColumn",
      id: string,
      name: string,
      tasks?:  Array< {
        __typename: "Task",
        id: string,
        content: string,
        createdAt: string,
        updatedAt: string,
      } > | null,
      createdAt: string,
      updatedAt: string,
    } > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateTaskColumnSubscription = {
  onCreateTaskColumn?:  {
    __typename: "TaskColumn",
    id: string,
    name: string,
    tasks?:  Array< {
      __typename: "Task",
      id: string,
      content: string,
      createdAt: string,
      updatedAt: string,
    } > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateTaskColumnSubscription = {
  onUpdateTaskColumn?:  {
    __typename: "TaskColumn",
    id: string,
    name: string,
    tasks?:  Array< {
      __typename: "Task",
      id: string,
      content: string,
      createdAt: string,
      updatedAt: string,
    } > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteTaskColumnSubscription = {
  onDeleteTaskColumn?:  {
    __typename: "TaskColumn",
    id: string,
    name: string,
    tasks?:  Array< {
      __typename: "Task",
      id: string,
      content: string,
      createdAt: string,
      updatedAt: string,
    } > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateTaskSubscription = {
  onCreateTask?:  {
    __typename: "Task",
    id: string,
    content: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateTaskSubscription = {
  onUpdateTask?:  {
    __typename: "Task",
    id: string,
    content: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteTaskSubscription = {
  onDeleteTask?:  {
    __typename: "Task",
    id: string,
    content: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateSettingsSubscription = {
  onCreateSettings?:  {
    __typename: "Settings",
    id: string,
    theme: Theme,
    hideKanbieText: boolean,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateSettingsSubscription = {
  onUpdateSettings?:  {
    __typename: "Settings",
    id: string,
    theme: Theme,
    hideKanbieText: boolean,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteSettingsSubscription = {
  onDeleteSettings?:  {
    __typename: "Settings",
    id: string,
    theme: Theme,
    hideKanbieText: boolean,
    createdAt: string,
    updatedAt: string,
  } | null,
};
