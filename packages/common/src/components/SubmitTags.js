import React, { useEffect } from 'react';
import { drizzleReactHooks } from '@drizzle/react-plugin';

import { alert } from '../utils/Alert';

import { DEFAULT_GAS } from '../utils/connector';
import { txHandler } from '../utils/errorHandler';
import { Spinner } from './shared';

const SubmitTags = (props) => {
    const { useCacheSend } = drizzleReactHooks.useDrizzle();

    const { tags, oldTags, index, setShowModal } = props;

    const addTag = useCacheSend('DocumentInfo', 'addTag');
    const removeTag = useCacheSend('DocumentInfo', 'removeTag');
    
    const tagsToAdd = tags.filter(tag => !oldTags.includes(tag));
    const tagsToRemove = oldTags.filter(tag => !tags.includes(tag));

    useEffect(() => {
        tagsToAdd.forEach((tag) =>
            addTag.send(index, tag, { gas: DEFAULT_GAS }));
        tagsToRemove.forEach(async(tag) =>
            removeTag.send(index, tag, { gas: DEFAULT_GAS }));
    }, []);

    const addTagTx = addTag.TXObjects;
    const removeTagTx = removeTag.TXObjects;

    useEffect(() => {
        const showErrors = (txObject, tags) => {
            if (txObject && txObject.length === tags.length) {
                let txFinished = true;
                txObject.forEach(tag => tag ? null : txFinished = false)

                if (txFinished) {
                    setShowModal(false)
                    for (let i = 0; i < tags.length; i++) {
                        const { errors } = txHandler(tags[i], txObject, i);
                        if (Object.keys(errors).length !== 0) {
                            Object.keys(errors).forEach((key) => {
                                alert({
                                    content: errors[key],
                                    duration: 3000, 
                                })
                            });
                        }
                    }
                }
            }
        }
        // alerts
        showErrors(addTagTx, tagsToAdd);
        showErrors(removeTagTx, tagsToRemove);
    }, [addTagTx.join(','), removeTagTx.join(',')]);

    // console.error(removeTagTx)

    return (
        <Spinner middle center color={'gray'} text={'Sending Transaction...'}/>
    )
}

export default SubmitTags;