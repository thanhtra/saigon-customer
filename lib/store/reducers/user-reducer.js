import produce from 'immer';
import {
  LOGIN_SUCCESS,
  UPDATE_USER,
  REMOVE_USER
} from '../type/user-type';
import { REHYDRATE } from 'redux-persist';
import { HYDRATE } from 'next-redux-wrapper';

const initialUser = {
  user: {},
  error: null
}

export const usersReducer = (state = initialUser, action) =>
  produce(state, draft => {
    switch (action.type) {
      case REHYDRATE:
        return {
          ...state,
          ...action.payload?.users
        }

      case LOGIN_SUCCESS: {
        draft.user = action.payload

        break;
      }

      case UPDATE_USER: {
        draft.user = action.payload;

        break;
      }

      case REMOVE_USER: {
        draft.user = {};

        break;
      }



      default: break
    }
  })
