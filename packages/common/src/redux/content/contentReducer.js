import {
    UPLOAD_REQUESTED,
    UPLOAD_SUCCESS,
    UPLOAD_FAIL,
    GET_ALL_CONTENT_SUCCESS,
    GET_ALL_CONTENT_FAIL,
    GET_ALL_CONTENT,
    GET_ONE_CONTENT,
    GET_ONE_CONTENT_SUCCESS,
    GET_ONE_CONTENT_FAIL,
} from '../actionTypes';
import produce from 'immer';
import { faBreadSlice } from '@fortawesome/free-solid-svg-icons';

const initialState = {
    upload: { status: '', value: null, error: null},
    allContent: { loading: false, error: null, filePreviews: []},
    oneContent: { loading: false, error: null, filePreview: {}}
}

const contentReducer = (state = initialState, action) =>
    produce(state, draft => {
        switch (action.type) {
            case UPLOAD_REQUESTED:
                draft.upload.status = 'uploading';
                break;
            case UPLOAD_SUCCESS:
                draft.upload = {
                    status: 'success',
                    value: action.result,
                    error: null,
                }
                break;
            case UPLOAD_FAIL:
                draft.upload = {
                    status: 'error',
                    value: null,
                    error: action.message,
                }
                break;
            case GET_ALL_CONTENT:
                draft.allContent.loading = true;
                break;
            case GET_ALL_CONTENT_SUCCESS:
                draft.allContent = {
                    loading: false,
                    error: null,
                    filePreviews: action.files,
                }
                break;
            case GET_ALL_CONTENT_FAIL:
                draft.allContent = {
                    loading: false,
                    error: action.message,
                    filePreviews: [],
                }
                break;
            case GET_ONE_CONTENT:
                draft.oneContent.loading = true;
                break;
            case GET_ONE_CONTENT_SUCCESS:
                draft.oneContent = {
                    loading: false,
                    error: null,
                    filePreview: action.file,
                }
                break;
            case GET_ONE_CONTENT_FAIL:
                draft.oneContent = {
                    loading: false,
                    error: action.message,
                    filePreview: {}
                }
                break;
            default:
                return draft
        }
    });

    export default contentReducer;
