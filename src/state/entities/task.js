/* Task */
import uuid from "uuid/v1";
import {
  createActions,
  createReducer,
  r,
  standardObjectActions
} from "./../util";

import db, { applyDB } from "../../dataStore/index";
export const initialState = { completed: false, value: 1 };

export const actors = applyDB(
  {
    create: ({ text = r`todo text`, value = 1 }) => () => ({
      ...initialState,
      id: uuid(),
      text,
      value: parseInt(value)
    }),
    toggleComplete: task => () =>
      standardObjectActions.toggle("completed")(task)
  },
  {
    create: db.createTask,
    toggleComplete: db.updateTask
  }
);

export const actions = createActions(actors);
export default createReducer(actors, initialState);

export const getId = t => t.id;
export const getText = t => t.text;
export const getValue = t => t.value;
export const isCompleted = t => t.completed;
