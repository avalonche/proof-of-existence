import { UPLOAD_REQUESTED, GET_ALL_CONTENT, GET_ONE_CONTENT } from '../actionTypes';

export const requestUpload = () => {
    return {
        type: UPLOAD_REQUESTED
    }
}

export const requestAllContent = (files) => {
    return {
        type: GET_ALL_CONTENT,
        files: files,
    }
}

export const requestOneContent = (file) => {
    return {
        type: GET_ONE_CONTENT,
        file: file,
    }
}