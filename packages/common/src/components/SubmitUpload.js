import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from '../utils/Router';
import { drizzleReactHooks } from '@drizzle/react-plugin';

import { DEFAULT_GAS } from '../utils/connector';
import { txHandler } from '../utils/errorHandler';
import { requestUpload } from '../redux/content/contentActions';
import { Spinner } from './shared';

const SubmitUpload = (props) => {
    const { useCacheSend } = drizzleReactHooks.useDrizzle();

    const { title, setErrors, txCallback, setTxCallback } = props;
    const [ ipfsHash, setIpfsHash ] = useState('');

    const [ status, setStatus ] = useState('');

    const history = useHistory();
    const dispatch = useDispatch();
    const upload = useSelector(state => state.content.upload);

    // no callback means the transaction has not been reverted before,
    // so it is a new document not yet uploaded to ipfs
    useEffect(() => {
        if (Object.keys(txCallback).length === 0) {
            dispatch(requestUpload());
        }
    }, []);

    const uploadHash = useCacheSend('ProofOfExistence', 'uploadDocument');
    const uploadInfo = useCacheSend('DocumentInfo', 'createDocument');

    useEffect(() => {
        switch(upload.status) {
            case 'uploading':
                setStatus('uploading');
                break;
            case 'success':
                setIpfsHash(upload.value[0].hash);
                break;
            case 'error':
                setErrors({upload: {message: upload.error}});
        }
    }, [upload.status]);

    useEffect(() => {
        if (ipfsHash) {
            setStatus('sendingTX');
            // if transaction callback contains a hash, transaction succeeded for this upload before
            // in that case, don't duplicate transaction
            if (!txCallback.hash) {
                uploadHash.send(ipfsHash, {gas: DEFAULT_GAS});
            }

            if (!txCallback.info) {
                uploadInfo.send(ipfsHash, title, {gas: DEFAULT_GAS});
            }
        }
    }, [ipfsHash]);

    const hashTXObjects = uploadHash.TXObjects;
    const infoTXObjects = uploadInfo.TXObjects;

    console.log(hashTXObjects, infoTXObjects);
    console.log(status);

    const hashStatus = hashTXObjects && hashTXObjects[hashTXObjects.length - 1] && hashTXObjects[hashTXObjects.length - 1].status;
    const infoStatus = infoTXObjects && infoTXObjects[infoTXObjects.length - 1] && infoTXObjects[infoTXObjects.length - 1].status;

    useEffect(() => {
        const hashTx = txHandler('hash', hashTXObjects, hashTXObjects.length - 1);
        const infoTx = txHandler('info', infoTXObjects, infoTXObjects.length - 1);

        const txStatus = {
            ...hashTx.txInfo,
            ...infoTx.txInfo,
        }

        const errors = {
            ...hashTx.errors,
            ...infoTx.errors,
        }

        if (txStatus.info) {
            const event = infoTXObjects[0].receipt.events['DocumentCreated'];
            const id = event.returnValues.documentIndex;
            txStatus.info.id = parseInt(id);
        }
        
        setTxCallback({...txCallback, ...txStatus});
        setErrors(errors);
    }, [hashStatus, infoStatus]);

    useEffect(() => {
        if (txCallback.info && txCallback.hash) {
            history.push(`content/${txCallback.info.id + 1}`);
        }
    }, [txCallback])

    if (status === 'uploading') {
        return (
            <Spinner middle center color={'gray'} text={'Uploading content to IPFS...'}/>
        );
    }

    if (status === 'sendingTX') {
        <Spinner middle center color={'gray'} text={'Sending transactions to smart contract...'}/>
    }

    return (
        <Spinner color={'gray'}/>
    );
}

export default SubmitUpload;