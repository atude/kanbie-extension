import { Board } from "../api";

export const initBoardState: Board = {
	
}

export const boardReducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
};

export default boardReducer;
