import React, { useEffect } from 'react';
import { drizzleReactHooks } from '@drizzle/react-plugin';

import { Spinner } from './shared';

const SubmitTags = (props) => {
    const { useCacheSend } = drizzleReactHooks.useDrizzle();

    const { tagsToAdd, tagsToRemove, txCallback, setTxCallback, setErrors, id } = props;

    const addTag = useCacheSend('DocumentInfo', 'addTag');
    const removeTag = useCacheSend('DocumentInfo', 'removeTag');

    useEffect(() => {
        if (tagsToAdd) {
            tagsToAdd.forEach(tag => addTag.send(id, tag));
        }

        if (tagsToRemove) {
            tagsToRemove.forEach(tag => removeTag.send(id, tag));            
        }
    }, []);

    useEffect(() => {
        addTag.TXObject.map(txObj => {
            if (txObj) {

            }
        });
    }, [addTag.TXObject, removeTag.TXObject])
    return (
        <Spinner/>
    )
}

export default SubmitTags;