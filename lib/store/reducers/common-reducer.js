import produce from 'immer';
import {
    POPUP_OPEN,
    POPUP_HIDE,
    POPUP_ADD_ADDRESS_OPEN,
    POPUP_ADD_ADDRESS_HIDE,
    POPUP_FILTER_OPEN,
    POPUP_FILTER_HIDE,
    COMMON_URL_REDIRECT_LOGIN,
    POPUP_POST_FREE_OPEN,
    POPUP_POST_FREE_HIDE
} from '../type/common-type';

const initialState = {
    isPopupOpen: false,
    isPopupFilterOpen: false,
    isPopupAddAddressOpen: false,
    isPopupPostFree: false,
    urlRedirectLogin: '',
};

export const commonReducer = (state = initialState, action) =>
    produce(state, (draft) => {
        switch (action.type) {
            case POPUP_OPEN:
                draft.isPopupOpen = true;
                break;

            case POPUP_HIDE:
                draft.isPopupOpen = false;
                break;

            case POPUP_ADD_ADDRESS_OPEN:
                draft.isPopupAddAddressOpen = true;
                break;

            case POPUP_ADD_ADDRESS_HIDE:
                draft.isPopupAddAddressOpen = false;
                break;

            case POPUP_FILTER_OPEN:
                draft.isPopupFilterOpen = true;
                break;

            case POPUP_FILTER_HIDE:
                draft.isPopupFilterOpen = false;
                break;

            case POPUP_POST_FREE_OPEN:
                draft.isPopupPostFree = true;
                break;

            case POPUP_POST_FREE_HIDE:
                draft.isPopupPostFree = false;
                break;

            case COMMON_URL_REDIRECT_LOGIN:
                draft.urlRedirectLogin = action.payload || '';
                break;

            default:
                break;
        }
    });
