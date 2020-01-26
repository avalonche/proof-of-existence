import React, { useState } from 'react';

import { Keyboard, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '../utils/FontAwesome';
import { faPlus, faTimes, faTags } from '@fortawesome/free-solid-svg-icons';

import SubmitUpload from './SubmitUpload';
import SubmitEdit from './SubmitEdit';
import { Input, Block, Text, Button } from '../components/shared';
import { theme } from '../assets/constants';

const ContentForm = (props) => {
    const { setVisible } = props;
    const [ title, setTitle ] = useState(props.title || '');
    const [ description, setDescription ] = useState(props.description || '');
    const [ editingTag, setEditingTag ] = useState('');
    const [ tags, setTags ] = useState(props.tags || []);
    const [ errors, setErrors ] = useState({});
    const [ txCallback, setTxCallback ] = useState({});
    const [ submitted, setSubmitted ] = useState(false);
    console.log(txCallback);
    // use effect to create alert notifications for upload and tx errors 
    // which is everything other than title, description, tag related errors

    function handleSubmit() {
        const currentErrors = {};

        Keyboard.dismiss();

        if (!title) {
            currentErrors.title = { message: "Title must not be empty" };
        }

        if (Object.keys(currentErrors).length === 0) {
            setSubmitted(true);
        }
        setErrors(currentErrors);
    }

    function handleCancel() {
        setVisible(false);
    }

    function submitForm() {
        const formProps = {
            title: title,
            tags: tags,
            description: description,
            setErrors: setErrors,
            txCallback: txCallback,
            setTxCallback: setTxCallback,
        }

        // no props.title means we are uploading a new file
        return (
            props.title ? (
                <SubmitEdit
                    {...formProps}
                    id={props.id}
                    oldTitle={props.title}
                    oldDescription={props.description}
                    oldTags={props.tags}
                />
            ) : (
                <SubmitUpload
                    {...formProps}
                />
            )
        );
    }

    function addTag() {
        const currentErrors = {};

        if (!editingTag) {
            currentErrors.tags = { message: "Tag must not be empty" };
        }

        if (tags.length >= 10) {
            currentErrors.tags = { message: "Tag limit reached" };
        }

        if (Object.keys(currentErrors).length === 0) {
            setTags(tags.concat([editingTag]));
        }

        setEditingTag('');
        setErrors(currentErrors);
    }

    function removeTag(i) {
        const newTags = [...tags.slice(0, i), ...tags.slice(i + 1)];

        setTags(newTags);
    }

    function renderTags() {
        const isDisabled = (i) => txCallback['tags'].tags[i] ? styles.disabled : null;
        const tagButtons = tags.map((tag, i) => (
            <Block key={i} shadow row style={[styles.tagContainer, isDisabled(i)]} disabled={() => isDisabled(i)}>
                <Text center style={styles.tagText} small>{tag}</Text>
                <Button style={styles.removeTag} onPress={() => removeTag(i)}>
                    <FontAwesomeIcon
                        icon={faTimes}
                        color={theme.colors.black}
                        style={{ fontSize: theme.sizes.caption, opacity: 0.8 }}
                    />
                </Button>
            </Block>
        ));

        return (
            <Block row wrap>
                {tagButtons}
            </Block>
        );
    }

    function inputProps(type) {
        const hasErrors = (key) => errors[key] ? styles.hasErrors : null;
        const notEditable = (key) => txCallback[key] || txCallback['info'] ? styles.disabled : null;

        let label = '';
        let placeholder = '';
        let maxLength = 0;
        let limit = 0;
        let style = null;
        let editable = true;
        switch (type) {
            case 'title':
                label = 'Title';
                placeholder = 'Add a title...';
                maxLength = 32;
                limit = 32;
                editable = notEditable('title') ? false : true;
                break;
            case 'description':
                label = 'Description';
                placeholder = 'Add a description...';
                maxLength = 255;
                limit = 255
                editable = notEditable('description') ? false : true;
                style = styles.description
                break;
            case 'tags':
                placeholder = 'Add a tag...';
                maxLength = 32;
                limit = 10
                style = styles.tags;
                break;
            default:
                return;
        }

        return {
            label: label,
            autoCapitalize: 'default',
            autoComplete: 'on',
            autoCorrect: true,
            showLimit: true,
            maxLength: maxLength,
            limit: limit,
            editable: editable,
            error: hasErrors(type),
            style: [styles.input, style, hasErrors(type), notEditable(type)],
            placeholder: hasErrors(type) ? null : placeholder,
            placeholderTextColor: theme.colors.gray2,
            errorText: errors[type] && errors[type].message,
            clearButtonMode: 'white-editing',
        }
    }

    return (
        submitted && Object.keys(errors).length === 0 ? (
            submitForm()
        ) : (
                <>
                    <Input
                        {...inputProps('title')}
                        required
                        currValue={title.length}
                        value={title}
                        onChangeText={text => setTitle(text)}
                    />

                    <Input
                        {...inputProps('description')}
                        currValue={description.length}
                        value={description}
                        onChangeText={text => setDescription(text)}
                        multiline={true}
                    />

                    {renderTags()}

                    <Input
                        {...inputProps('tags')}
                        currValue={tags.length}
                        value={editingTag}
                        onKeyPress={e => e.nativeEvent.key === ' ' ? addTag() : null}
                        onChangeText={text => setEditingTag(text.replace(/\s/g, ''))}
                        onSubmitEditing={addTag}
                        onRightPress={addTag}
                        rightStyle={styles.addTag}
                        rightLabel={
                            editingTag.length ? <FontAwesomeIcon
                                icon={faPlus}
                                color={theme.colors.secondary}
                                style={{ fontSize: theme.sizes.caption }}
                            /> : null
                        }
                        leftStyl={{ backgroundColor: 'transparent' }}
                        leftLabel={
                            <FontAwesomeIcon
                                icon={faTags}
                                color={theme.colors.gray2}
                            />
                        }
                    />

                    <Block>
                        <Button
                            color={'primary'}
                            style={styles.submit}
                            onPress={() => handleSubmit()}>
                                <Text bold white center>Submit</Text>
                        </Button>

                        <Button onPress={() => handleCancel()}>
                            <Text gray small center style={{ textDecorationLine: 'underline' }}>
                                Cancel
                        </Text>
                        </Button>
                    </Block>
                </>
            )
    );
}

export default ContentForm;

const styles = StyleSheet.create({
    input: {
        borderRadius: 0,
        borderWidth: 0,
        borderBottomColor: theme.colors.gray2,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    description: {
        minHeight: theme.sizes.base * 6,
        paddingVertical: theme.sizes.base,
    },
    tags: {
        paddingLeft: theme.sizes.base * 2,
    },
    tagText: {
        padding: theme.sizes.base / 4,
        paddingTop: theme.sizes.base / 8,
        marginHorizontal: theme.sizes.base / 8,
    },
    tagContainer: {
        flex: -1, 
        borderRadius: theme.sizes.radius / 2,
        borderColor: 'rgba(1, 168, 202, 0.3)',
        borderWidth: StyleSheet.hairlineWidth,
        margin: theme.sizes.base / 2,
        backgroundColor: theme.colors.primary,
    },
    removeTag: {
        backgroundColor: 'transparent',
        height: theme.sizes.base / 2,
        paddingRight: theme.sizes.base / 4,
        alignSelf: 'center',
    },
    addTag: {
        top: 'auto',
        bottom: theme.sizes.base / 3,
        width: 'auto',
        paddingLeft: theme.sizes.base / 3,
        backgroundColor: 'transparent'
    },
    submit: {
        maxWidth: theme.sizes.maxWidth,
        minWidth: theme.sizes.minWidth,
        width: '100%',
        alignSelf: 'center',
    },
    hasErrors: {
        borderBottomColor: theme.colors.accent,
    },
    disabled: {
        opacity: 0.5,
    },
})