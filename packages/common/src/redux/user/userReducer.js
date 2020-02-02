import { SET_PROVIDER, LOG_OUT } from '../actionTypes';
import produce from 'immer';

const initialState = {
    loginMethod: '',
};

const userReducer = (state = initialState, action) =>
    produce(state, draft => {
        switch (action.type) {
            case SET_PROVIDER:
                draft.loginMethod = action.provider;
                break;
            case LOG_OUT:
                draft = initialState;
                break;
           default:
                return draft;
        }
    })

export default userReducer;
