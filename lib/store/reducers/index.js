import { combineReducers } from 'redux';
import { commonReducer } from './common-reducer';
import { usersReducer } from './user-reducer';


export const rootReducer = combineReducers({
    users: usersReducer,
    commons: commonReducer,
})

