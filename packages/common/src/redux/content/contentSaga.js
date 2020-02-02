import { call, put, all, takeLatest } from 'redux-saga/effects';
import { Platform } from 'react-native';
import ipfs from '../../utils/ipfs';
import { getFileBuffer } from '../../utils/Uploader';

import {
    GET_ALL_CONTENT,
    GET_ALL_CONTENT_SUCCESS,
    GET_ALL_CONTENT_FAIL,
    UPLOAD_REQUESTED,
    UPLOAD_SUCCESS,
    UPLOAD_FAIL,
    GET_ONE_CONTENT,
    GET_ONE_CONTENT_SUCCESS,
    GET_ONE_CONTENT_FAIL,
} from '../actionTypes'
/**
 * Fetch Content
 */
function* fetchFromIpfs(ipfsHash) {
    const url = `https://gateway.ipfs.io/ipfs/${ipfsHash}`
    const response = yield call(fetch, url, { method: 'HEAD'});
    return {
        url: url,
        fileType: response.headers.get('Content-type'),
    }
}

function* fetchOne(action) {
    try {
        const { _ipfsHash } = action.file;
        const file = yield call(fetchFromIpfs, _ipfsHash);
        yield put({type: GET_ONE_CONTENT_SUCCESS, file: file});
    } catch(e) {
        yield put({type: GET_ONE_CONTENT_FAIL, message: e.message});
    }
}

function* fetchAll(action) {
    try {
        const files = yield all(action.files.map(({_ipfsHash}) => call(fetchFromIpfs, _ipfsHash)));
        yield put({type: GET_ALL_CONTENT_SUCCESS, files: files})
    } catch (e) {
        yield put({type: GET_ALL_CONTENT_FAIL, message: e.message})
    }

}
/**
 * Upload to IPFS
 */

function* uploadToIpfs() {
    try {
        const file = yield call(getFileBuffer);
        const result = Platform.OS === 'web' ? yield call(ipfs.add, file) : [{hash: JSON.parse(file.data).Hash}];
        yield put({type: UPLOAD_SUCCESS, result: result});
    } catch(e) {
        yield put({type: UPLOAD_FAIL, message: e.message});
    }
}



function* contentSaga() {
    yield takeLatest(UPLOAD_REQUESTED, uploadToIpfs);
    yield takeLatest(GET_ALL_CONTENT, fetchAll);
    yield takeLatest(GET_ONE_CONTENT, fetchOne);
}

export default contentSaga;