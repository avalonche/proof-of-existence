import React, { useCallback } from 'react';
import { drizzleReactHooks } from '@drizzle/react-plugin';
import { Block } from './shared';
import { Spinner } from './shared';
const SubmitEdit = (props) => {
    const { useCacheSend } = drizzleReactHooks.useDrizzle();
    const { title, oldTitle, description, oldDescription, tags, oldTags, id, txCall} = props;

    const { editTitle, editTitleTX } = useCacheSend('DocumentInfo', 'editTitle');
    const { editDescription, editDescriptionTX } = useCacheSend('DocumentInfo', 'editDescription');
    const { addTag, addTagTX } = useCacheSend('DocumentInfo', 'addTag');
    const { removeTag, removeTagTx } = useCacheSend('DocumentInfo', 'removeTag');

    useCallback(() => {
        title !== oldTitle ? editTitle(id, title) : null;
        description !== oldDescription ? editDescription(id, description) : null;
        
        if (oldTags) {
            tags.map(tag => addTag(id, tag));
        }
        else {
            const tagsToAdd = tags.filter(tag => !oldTags.includes(tag));
            const tagsToRemove = oldTags.filter(tag => !tags.includes(tag));

            tagsToAdd.map(tag => addTag(id, tag));
            tagsToRemove.map(tag => removeTag(id, tag));
        }
    }, []);

    return (
        <Block>
        <Spinner text={editTitleTX.map(t => t.status)}/>
        <Spinner text={editDescriptionTX.map(t => t.status)}/>
        <Spinner text={addTag.map(t => t.status)}/>
        <Spinner text={removeTagTx.map(t => t.status)}/>
        </Block>
    )
}
export default SubmitEdit;