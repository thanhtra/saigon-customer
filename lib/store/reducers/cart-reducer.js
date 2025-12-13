import produce from 'immer';
import { addCart } from 'lib/utils';

import {
    CART_ADD_ITEM_REQUEST,
    CART_HIDE_POPUP_REQUEST,
    CART_REMOVE_ALL_ITEM,
    CART_RE_BUY,
    CART_UPDATE_ITEM_REQUEST
} from '../type/cart-type';
import { REHYDRATE } from 'redux-persist';

const initialCart = {
    cartItems: [],
    showPopupCart: false
}

export const cartReducer = (state = initialCart, action) => {
    return produce(state, draft => {
        switch (action.type) {
            case REHYDRATE:
                return {
                    ...state,
                    ...action.payload?.carts
                }


            case CART_ADD_ITEM_REQUEST: {
                draft.cartItems = addCart(state.cartItems, action.payload);
                draft.showPopupCart = true;

                break;
            }

            case CART_HIDE_POPUP_REQUEST: {
                draft.showPopupCart = false

                break;
            }

            case CART_UPDATE_ITEM_REQUEST: {
                draft.cartItems = action.payload;

                break;
            }

            case CART_REMOVE_ALL_ITEM: {
                draft.cartItems = [];

                break;
            }

            case CART_RE_BUY: {
                draft.cartItems = action.payload;

                break;
            }

            default: break
        }
    })
}
