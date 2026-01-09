import produce from 'immer';
import {
    COMMON_POPUP_OPEN,
    COMMON_POPUP_HIDE,
    POPUP_ADD_ADDRESS_OPEN,
    POPUP_ADD_ADDRESS_HIDE,
    COMMON_POPUP_FILTER_OPEN,
    COMMON_POPUP_FILTER_HIDE,
    COMMON_URL_REDIRECT_LOGIN,
} from '../type/common-type';

const initialState = {
    isPopupOpen: false,
    isPopupFilterOpen: false,
    isPopupAddAddressOpen: false,
    urlRedirectLogin: '',
};

export const commonReducer = (state = initialState, action) =>
    produce(state, (draft) => {
        switch (action.type) {
            case COMMON_POPUP_OPEN:
                draft.isPopupOpen = true;
                break;

            case COMMON_POPUP_HIDE:
                draft.isPopupOpen = false;
                break;

            case POPUP_ADD_ADDRESS_OPEN:
                draft.isPopupAddAddressOpen = true;
                break;

            case POPUP_ADD_ADDRESS_HIDE:
                draft.isPopupAddAddressOpen = false;
                break;

            case COMMON_POPUP_FILTER_OPEN:
                draft.isPopupFilterOpen = true;
                break;

            case COMMON_POPUP_FILTER_HIDE:
                draft.isPopupFilterOpen = false;
                break;

            case COMMON_URL_REDIRECT_LOGIN:
                draft.urlRedirectLogin = action.payload || '';
                break;

            default:
                break;
        }
    });
