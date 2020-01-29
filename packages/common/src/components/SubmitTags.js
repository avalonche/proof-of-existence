import React, { useEffect } from 'react';
import { drizzleReactHooks } from '@drizzle/react-plugin';

import { DEFAULT_GAS } from '../utils/connector';
import { resolveAddress } from '../utils/ens';
import { txHandler } from '../utils/errorHandler';
import { Spinner } from './shared';

const SubmitTags = (props) => {
    const { useCacheSend } = drizzleReactHooks.useDrizzle();
    const drizzleState = drizzleReactHooks.useDrizzleState(drizzleState => ({
        account: drizzleState.accounts[0]
    }));

    const { tags, oldTags, index, setShowModal } = props;

    const addTag = useCacheSend('DocumentInfo', 'addTag');
    const removeTag = useCacheSend('DocumentInfo', 'removeTag');
    
    const tagsToAdd = tags.filter(tag => !oldTags.includes(tag));
    const tagsToRemove = oldTags.filter(tag => !tags.includes(tag));

    useEffect(() => {
        tagsToAdd.forEach(async(tag) =>
            addTag.send(index, tag, { gas: DEFAULT_GAS, from: await resolveAddress(drizzleState.account) }));
        tagsToRemove.forEach(async(tag) =>
            removeTag.send(index, tag, { gas: DEFAULT_GAS, from: await resolveAddress(drizzleState.account) }));

        addTags();
        removeTags()
        setShowModal(false);
    }, []);

    const addTagTx = addTag.TXObjects;
    const removeTagTx = removeTag.TXObjects;

    useEffect(() => {
        const getErrors = (txObject, tags) => {
            if (txObject && txObject.length === tags.length) {
                let txFinished = true;
                txObject.forEach(tag => tag ? null : txFinished = false)

                if (txFinished) {
                    for (let i = 0; i < tags.length; i++) {
                        const errors = txHandler(tags[i], addTagTx, i).errors[tags[i]];
                        if (errors) {
                            return errors;
                        }
                    }
                }
            }
        }
        // alerts
        const addTagErrors = getErrors(addTagTx, tagsToAdd);
        const removeTagErrors = getErrors(removeTagTx, tagsToRemove);
    }, [addTagTx.join(','), removeTagTx.join(',')]);

    return (
        <Spinner middle center color={'gray'} text={'Sending Transaction...'}/>
    )
}

export default SubmitTags;