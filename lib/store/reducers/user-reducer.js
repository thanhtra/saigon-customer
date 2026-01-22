import produce from 'immer';
import {
  LOGIN_SUCCESS,
  UPDATE_USER,
  REMOVE_USER,
} from '../type/user-type';

const initialState = {
  user: null,
  isAuthenticated: false,
  isAuthInitialized: false
};

export const usersReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case LOGIN_SUCCESS: {
        draft.user = action.payload;
        draft.isAuthenticated = true;
        draft.isAuthInitialized = true;
        break;
      }

      case UPDATE_USER: {
        draft.user = action.payload;
        break;
      }

      case REMOVE_USER: {
        draft.user = null;
        draft.isAuthenticated = false;
        draft.isAuthInitialized = true;
        break;
      }

      default:
        break;
    }
  });
