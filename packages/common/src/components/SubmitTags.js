import React, { useEffect } from 'react';
import { drizzleReactHooks } from '@drizzle/react-plugin';

import { Spinner } from './shared';

const SubmitTags = (props) => {
    const { useCacheSend } = drizzleReactHooks.useDrizzle();

    const { tagsToAdd, tagsToRemove, txCallback, setTxCallback, setErrors, id } = props;

    const addTag = useCacheSend('DocumentInfo', 'addTag');
    const removeTag = useCacheSend('DocumentInfo', 'removeTag');
            if (oldTags) {
            tags.map(tag => addTag(id, tag));
        }
        else {
            const tagsToAdd = tags.filter(tag => !oldTags.includes(tag));
            const tagsToRemove = oldTags.filter(tag => !tags.includes(tag));

            tagsToAdd.map(tag => addTag(id, tag));
            tagsToRemove.map(tag => removeTag(id, tag));
        }

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
    // const addTag = useCacheSend('DocumentInfo', 'addTag');

    // useEffect(() => {
    //     if (txCallback.info && txCallback.hash) {
    //         tags.forEach((tag) => {
    //             if (!txCallback.tags || !txCallback.tags[tag]) {
    //                 addTag.send(txCallback.info.id, tag);
    //             }
    //         });
    //     }
    // }, [txCallback]);

    // const addTagTx = addTag.TXObjects

    // useEffect(() => {
    //     if (addTagTx && addTagTx.length === tags.length) {
    //         let txFinished = true;
    //         addTagTx.forEach(tag => tag ? null : txFinished = false)

    //         if (txFinished) {
    //             const tagsTxInfo = tags.reduce(
    //                 (tagObj, tag, i) => (tagObj[tag] = txHandler(tag, addTagTx, i).txInfo[tag], tagObj), {}
    //             );

    //             const getTagErrors = () => {
    //                 for (let i = 0; i < tags.length; i++) {
    //                     const errors = txHandler(tags[i], addTagTx, i).errors[tags[i]];
    //                     if (errors.message) {
    //                         return errors;
    //                     }
    //                 }
    //             }
    //             const tagErrors = getTagErrors();

    //             Object.keys(tagsTxInfo).length !== 0 ? setTxCallback({...txCallback, tags: tagsTxInfo}): null;
    //             tagErrors ? setErrors({...txCallback, tags: tagErrors}) : null;
    //             // history.push(`/content/${txCallback.info.id + 1}`);
    //         }
    //     }
    // }, [addTagTx.join(',')]);

    return (
        <Spinner/>
    )
}

export default SubmitTags;