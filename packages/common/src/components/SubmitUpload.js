import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from '../utils/Router';
import { drizzleReactHooks } from '@drizzle/react-plugin';

import { DEFAULT_GAS } from '../utils/connector';
import { resolveAddress } from '../utils/ens';
import { txHandler } from '../utils/errorHandler';
import { requestUpload } from '../redux/content/contentActions';
import { Spinner, Block, Text, Button } from './shared';
import { theme } from '../assets/constants';

const SubmitUpload = (props) => {
    const { useCacheSend } = drizzleReactHooks.useDrizzle();
    const drizzleState = drizzleReactHooks.useDrizzleState(drizzleState => ({
        transactions: drizzleState.transactions,
        account: drizzleState.accounts[0]
    }))

    const { title, setErrors, txCallback, setTxCallback, setShowModal } = props;
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
                setErrors({ upload: upload.error });
        }
    }, [upload.status]);

    useEffect(() => {
        const sendTx = async () => {
            if (ipfsHash) {
                setStatus('sendingTX');
                // if transaction callback contains a hash, transaction succeeded for this upload before
                // in that case, don't duplicate transaction
                if (!txCallback.hash) {
                    uploadHash.send(ipfsHash, { gas: DEFAULT_GAS, from: await resolveAddress(drizzleState.account) });
                }

                if (!txCallback.info) {
                    uploadInfo.send(ipfsHash, title, { gas: DEFAULT_GAS, from: await resolveAddress(drizzleState.account)} );
                }
            }
        }

        sendTx();
    }, [ipfsHash]);

    const hashTXObjects = uploadHash.TXObjects;
    const infoTXObjects = uploadInfo.TXObjects;

    const hashStatus = hashTXObjects && hashTXObjects[0] && hashTXObjects[0].status;
    const infoStatus = infoTXObjects && infoTXObjects[0] && infoTXObjects[0].status;

    useEffect(() => {
        const hashTx = txHandler('hash', hashTXObjects);
        const infoTx = txHandler('info', infoTXObjects);

        const txStatus = {
            ...hashTx.txInfo,
            ...infoTx.txInfo,
        }

        const errors = {
            ...hashTx.errors,
            ...infoTx.errors,
        }

        setTxCallback({...txCallback, ...txStatus});
        setErrors(errors);
    }, [hashStatus, infoStatus]);

    useEffect(() => {

    }, [txCallback])

    function handleOk(index) {
        setShowModal(false);
        history.push(`/content/${parseInt(index) + 1}`);
    }

    if (txCallback.info && txCallback.hash) {
        console.log(txCallback.info)
        const event = drizzleState.transactions[txCallback.info].receipt.events['DocumentCreated'];
        const index = event.returnValues.documentIndex;

        const infoGas = drizzleState.transactions[txCallback.info].receipt.gasUsed;
        const hashGas = drizzleState.transactions[txCallback.hash].receipt.gasUsed;
        return (
            <Block middle center space='around' padding={theme.sizes.padding}>
                <Text bold h2>Transaction Success!</Text>
                
                <Block space='between' padding={theme.sizes.padding}>
                    <Text center bold>Transation Hashes: </Text>
                    <Block>
                        <Text gray center light numberOfLines={1}>
                            {txCallback.info}
                        </Text>
                        <Text gray center light numberOfLines={1}>
                            {txCallback.hash}
                        </Text>
                    </Block>
                </Block>
                
                <Block row space='between' padding={theme.sizes.pad}>
                    <Text gray bold>Culmutive Gas Used:    </Text>
                    <Text gray light>{infoGas + hashGas}</Text>
                </Block>
                <Button onPress={() => handleOk(index)} color={'transparent'}>
                    <Text gray small center style={{ textDecorationLine: 'underline' }}>
                        OK
                    </Text>
                </Button>

            </Block>
        )
    }

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