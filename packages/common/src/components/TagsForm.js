import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';

import { FontAwesome } from '../utils/FontAwesome';
import { faTimes, faPlus, faTags } from '@fortawesome/free-solid-svg-icons';

import SubmitTags from './SubmitTags';
import { Block, Text, Button, Input } from './shared';
import { theme } from '../assets/constants';

const TagsForm = (props) => {
    const { setShowModal } = props;
    const [ tags, setTags ] = useState(props.tags);
    const [ editingTag, setEditingTag ] = useState('');
    const [ submitted, setSubmitted ] = useState(false);
    const [ errors, setErrors ] = useState({});

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
        const tagButtons = tags.map((tag, i) => (
            <Block key={i} shadow row style={styles.tagContainer}>
                <Text center style={styles.tagText} small>{tag}</Text>
                <Button style={styles.removeTag} onPress={() => removeTag(i)}>
                    <FontAwesome
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

    const hasErrors = () => errors['tags'] ? styles.hasErrors : null;

    return (
        submitted && Object.keys(errors).length === 0 ? (
            <SubmitTags
                tags={tags}
                oldTags={props.tags}
                index={props.index}
                setShowModal={setShowModal}
            />
        ) : (
            <KeyboardAvoidingView behavior={'padding'}>
                <Block flex={-1} padding={[theme.sizes.padding, theme.sizes.padding, 0]}>
                    {renderTags()}
                    <Input
                        label={'Press space to add a tag'}
                        autoCapitalize={'sentences'}
                        autoComplete={'on'}
                        autoCorrect={true}
                        showLimit
                        maxLength={32}
                        limit={10}
                        error={hasErrors()}
                        style={[styles.input, styles.tags, hasErrors()]}
                        placeholder={hasErrors() ? '' : 'Add a tag...'}
                        placeholderTextColor={theme.colors.gray2}
                        errorText={errors['tags']}
                        clearButtonMode={'while-editing'}
                        currValue={tags.length}
                        value={editingTag}
                        onKeyPress={e => e.nativeEvent.key === ' ' ? addTag() : null}
                        onChangeText={text => setEditingTag(text.replace(/\s/g, ''))}
                        onSubmitEditing={addTag}
                        onRightPress={addTag}
                        rightStyle={styles.addTag}
                        rightLabel={
                            editingTag.length ?
                                <FontAwesome
                                    icon={faPlus}
                                    color={theme.colors.secondary}
                                    style={{ fontSize: theme.sizes.caption }}
                                /> : null
                        }
                        leftStyl={{ backgroundColor: 'transparent' }}
                        leftLabel={
                            <FontAwesome
                                icon={faTags}
                                color={theme.colors.gray2}
                            />
                        }
                    />
                    <Block row space='between' style={{ paddingTop: theme.sizes.padding }}>
                        <Button onPress={() => setShowModal(false)}>
                            <Text gray style={{ textDecorationLine: 'underline' }}>Cancel</Text>
                        </Button>
                        <Button onPress={() => setSubmitted(true)} color={'primary'} style={{ paddingHorizontal: theme.sizes.padding}}>
                            <Text white bold>Save</Text>
                        </Button>
                    </Block>
                </Block>
            </KeyboardAvoidingView>
        )
    )
}

export default TagsForm;

const styles = StyleSheet.create({
    input: {
        borderRadius: 0,
        borderWidth: 0,
        borderBottomColor: theme.colors.gray2,
        borderBottomWidth: StyleSheet.hairlineWidth,
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
    hasErrors: {
        borderBottomColor: theme.colors.accent,
    },
})