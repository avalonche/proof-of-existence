import { SET_PROVIDER } from '../actionTypes';

export const setProvider = (provider) => {
    return {
        type: SET_PROVIDER,
        provider: provider,
    }
}
