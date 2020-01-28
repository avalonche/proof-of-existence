import React, { useEffect } from 'react';
import { drizzleReactHooks } from '@drizzle/react-plugin';
import { DEFAULT_GAS } from '../utils/connector';
import { txHandler } from '../utils/errorHandler';
import { Block } from './shared';
import { Spinner } from './shared';

const SubmitEdit = (props) => {
    const { useCacheSend } = drizzleReactHooks.useDrizzle();
    const { title, oldTitle,  id, txCallback, setTxCallback, setErrors, showModalForm} = props;

    const editTitle = useCacheSend('DocumentInfo', 'editTitle');

    useEffect(() => {
        title !== oldTitle ? editTitle.send(id, title, { gas: DEFAULT_GAS }) : setTxCallback({ edit: 'no change' });
    }, []);

    const editTitleStatus = editTitle.TXObjects && editTitle.TXObjects[0] && editTitle.TXObjects[0].status;

    useEffect(() => {
        const editTx = txHandler('edit', editTitle.TXObjects);

        setTxCallback(editTx.txInfo);
        setErrors(editTx.txInfo);
    }, [editTitleStatus])

    if (txCallback.edit) {
        showModalForm(false);
    } 

    return (
        <Block>
            <Spinner text={'Sending transaction...'}/>
        </Block>
    )
}
export default SubmitEdit;