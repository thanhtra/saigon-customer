import produce from 'immer';
import {
    POPUP_FILTER_OPEN,
    POPUP_FILTER_HIDE,
    COMMON_URL_REDIRECT_LOGIN,
    POPUP_POST_FREE_OPEN,
    POPUP_POST_FREE_HIDE
} from '../type/common-type';

const initialState = {
    isPopupFilterOpen: false,
    isPopupPostFree: false,
    urlRedirectLogin: '',
};

export const commonReducer = (state = initialState, action) =>
    produce(state, (draft) => {
        switch (action.type) {
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
