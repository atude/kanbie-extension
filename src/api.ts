/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateTaskColumnsInput = {
  id?: string | null,
  name: string,
};

export type ModelTaskColumnsConditionInput = {
  name?: ModelStringInput | null,
  and?: Array< ModelTaskColumnsConditionInput | null > | null,
  or?: Array< ModelTaskColumnsConditionInput | null > | null,
  not?: ModelTaskColumnsConditionInput | null,
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

export type TaskColumns = {
  __typename: "TaskColumns",
  id?: string,
  name?: string,
  tasks?:  Array<Task | null > | null,
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

export type UpdateTaskColumnsInput = {
  id: string,
  name?: string | null,
};

export type DeleteTaskColumnsInput = {
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

export type ModelTaskColumnsFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  and?: Array< ModelTaskColumnsFilterInput | null > | null,
  or?: Array< ModelTaskColumnsFilterInput | null > | null,
  not?: ModelTaskColumnsFilterInput | null,
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

export type ModelTaskColumnsConnection = {
  __typename: "ModelTaskColumnsConnection",
  items?:  Array<TaskColumns | null > | null,
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

export type CreateTaskColumnsMutationVariables = {
  input?: CreateTaskColumnsInput,
  condition?: ModelTaskColumnsConditionInput | null,
};

export type CreateTaskColumnsMutation = {
  createTaskColumns?:  {
    __typename: "TaskColumns",
    id: string,
    name: string,
    tasks?:  Array< {
      __typename: "Task",
      id: string,
      content: string,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateTaskColumnsMutationVariables = {
  input?: UpdateTaskColumnsInput,
  condition?: ModelTaskColumnsConditionInput | null,
};

export type UpdateTaskColumnsMutation = {
  updateTaskColumns?:  {
    __typename: "TaskColumns",
    id: string,
    name: string,
    tasks?:  Array< {
      __typename: "Task",
      id: string,
      content: string,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteTaskColumnsMutationVariables = {
  input?: DeleteTaskColumnsInput,
  condition?: ModelTaskColumnsConditionInput | null,
};

export type DeleteTaskColumnsMutation = {
  deleteTaskColumns?:  {
    __typename: "TaskColumns",
    id: string,
    name: string,
    tasks?:  Array< {
      __typename: "Task",
      id: string,
      content: string,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
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

export type GetTaskColumnsQueryVariables = {
  id?: string,
};

export type GetTaskColumnsQuery = {
  getTaskColumns?:  {
    __typename: "TaskColumns",
    id: string,
    name: string,
    tasks?:  Array< {
      __typename: "Task",
      id: string,
      content: string,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListTaskColumnssQueryVariables = {
  filter?: ModelTaskColumnsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTaskColumnssQuery = {
  listTaskColumnss?:  {
    __typename: "ModelTaskColumnsConnection",
    items?:  Array< {
      __typename: "TaskColumns",
      id: string,
      name: string,
      tasks?:  Array< {
        __typename: "Task",
        id: string,
        content: string,
        createdAt: string,
        updatedAt: string,
      } | null > | null,
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

export type OnCreateTaskColumnsSubscription = {
  onCreateTaskColumns?:  {
    __typename: "TaskColumns",
    id: string,
    name: string,
    tasks?:  Array< {
      __typename: "Task",
      id: string,
      content: string,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateTaskColumnsSubscription = {
  onUpdateTaskColumns?:  {
    __typename: "TaskColumns",
    id: string,
    name: string,
    tasks?:  Array< {
      __typename: "Task",
      id: string,
      content: string,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteTaskColumnsSubscription = {
  onDeleteTaskColumns?:  {
    __typename: "TaskColumns",
    id: string,
    name: string,
    tasks?:  Array< {
      __typename: "Task",
      id: string,
      content: string,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
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
