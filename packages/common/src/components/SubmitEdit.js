import React, { useEffect } from 'react';
import { drizzleReactHooks } from '@drizzle/react-plugin';

import { alert } from '../utils/Alert';

import { DEFAULT_GAS } from '../utils/connector';
import { resolveAddress } from '../utils/ens';
import { txHandler } from '../utils/errorHandler';
import { Spinner } from './shared';

const SubmitEdit = (props) => {
    const { useCacheSend } = drizzleReactHooks.useDrizzle();
    const { title, oldTitle, index, setShowModal } = props;
    const drizzleState = drizzleReactHooks.useDrizzleState(drizzleState => ({
        account: drizzleState.accounts[0]
    }));

    const editTitle = useCacheSend('DocumentInfo', 'editTitle');
    const editTitleStatus = editTitle.TXObjects && editTitle.TXObjects[0] && editTitle.TXObjects[0].status;

    useEffect(() => {
        const sendEdit = async () => {
            if (title !== oldTitle) {
                editTitle.send(index, title, { gas: DEFAULT_GAS, from: await resolveAddress(drizzleState.account) });
            }
        }

        sendEdit();
    }, []);

    useEffect(() => {
        const { errors }= txHandler('edit', editTitle.TXObjects);
        setShowModal(false)
        if (Object.keys(errors).length !== 0) {
            Object.keys(errors).forEach((key) => {
                alert({
                    content: errors[key],
                    duration: 3000, 
                })
            });
        }
    }, [editTitleStatus]);

    return (
        <Spinner color={'gray'} middle center text={'Sending transaction...'}/>
    )
}
export default SubmitEdit