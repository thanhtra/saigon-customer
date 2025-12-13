import { combineReducers } from 'redux'
import { usersReducer } from './user-reducer';
import { commonReducer } from './common-reducer';
import { cartReducer } from './cart-reducer';


export const rootReducer = combineReducers({
    users: usersReducer,
    commons: commonReducer,
    carts: cartReducer,
})

