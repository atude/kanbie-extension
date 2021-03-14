/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTaskColumns = /* GraphQL */ `
  query GetTaskColumns($id: ID!) {
    getTaskColumns(id: $id) {
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
export const listTaskColumnss = /* GraphQL */ `
  query ListTaskColumnss(
    $filter: ModelTaskColumnsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTaskColumnss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getTask = /* GraphQL */ `
  query GetTask($id: ID!) {
    getTask(id: $id) {
      id
      content
      createdAt
      updatedAt
    }
  }
`;
export const listTasks = /* GraphQL */ `
  query ListTasks(
    $filter: ModelTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTasks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        content
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
