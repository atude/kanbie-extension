/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTaskColumns = /* GraphQL */ `
  mutation CreateTaskColumns(
    $input: CreateTaskColumnsInput!
    $condition: ModelTaskColumnsConditionInput
  ) {
    createTaskColumns(input: $input, condition: $condition) {
      id
      name
      tasks {
        id
        content
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateTaskColumns = /* GraphQL */ `
  mutation UpdateTaskColumns(
    $input: UpdateTaskColumnsInput!
    $condition: ModelTaskColumnsConditionInput
  ) {
    updateTaskColumns(input: $input, condition: $condition) {
      id
      name
      tasks {
        id
        content
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteTaskColumns = /* GraphQL */ `
  mutation DeleteTaskColumns(
    $input: DeleteTaskColumnsInput!
    $condition: ModelTaskColumnsConditionInput
  ) {
    deleteTaskColumns(input: $input, condition: $condition) {
      id
      name
      tasks {
        id
        content
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const createTask = /* GraphQL */ `
  mutation CreateTask(
    $input: CreateTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    createTask(input: $input, condition: $condition) {
      id
      content
      createdAt
      updatedAt
    }
  }
`;
export const updateTask = /* GraphQL */ `
  mutation UpdateTask(
    $input: UpdateTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    updateTask(input: $input, condition: $condition) {
      id
      content
      createdAt
      updatedAt
    }
  }
`;
export const deleteTask = /* GraphQL */ `
  mutation DeleteTask(
    $input: DeleteTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    deleteTask(input: $input, condition: $condition) {
      id
      content
      createdAt
      updatedAt
    }
  }
`;
