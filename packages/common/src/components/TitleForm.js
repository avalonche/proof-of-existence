import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, StyleSheet } from 'react-native';

import SubmitUpload from './SubmitUpload';
import SubmitEdit from './SubmitEdit';
import { Input, Block, Text, Button } from './shared';
import { theme } from '../assets/constants';

const TitleForm = (props) => {
    const { setShowModal } = props;
    const [ title, setTitle ] = useState(props.title || '');
    const [ errors, setErrors ] = useState({});
    const [ txCallback, setTxCallback ] = useState({});
    const [ submitted, setSubmitted ] = useState(false);

    // use effect to create alert notifications for upload and tx errors (not title errors)

    function handleSubmit() {
        const currentErrors = {};

        Keyboard.dismiss();

        if (!title) {
            currentErrors.title = "Title must not be empty";
        }

        if (Object.keys(currentErrors).length === 0) {
            setSubmitted(true);
        }
        setErrors(currentErrors);
    }

    function handleCancel() {
        setShowModal(false);
    }

    function submitForm() {
        const formProps = {
            title: title,
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
                />
            ) : (
                <SubmitUpload
                    {...formProps}
                />
            )
        );
    }

    return (
        submitted && Object.keys(errors).length === 0 ? (
            submitForm()
        ) : (
                <KeyboardAvoidingView style={styles.form} behavior='padding'>
                    <Block flex={-1} padding={theme.sizes.padding}>
                        <Input
                            label='Title'
                            autoCapitalize={'sentences'}
                            autoCorrect={true}
                            value={title}
                            onChangeText={text => setTitle(text)}
                            required
                            showLimit
                            maxLength={32}
                            currValue={title.length}
                            limit={32}
                            error={errors.title ? styles.hasErrors : null}
                            style={[styles.input, errors.title ? styles.hasErrors : null]}
                            placeholder={'Add a title...'}
                            placeholderTextColor={theme.colors.gray2}
                            errorText={errors.title}
                            clearButtonMode={'while-editing'}
                        />
                    </Block>

                <Block flex={-1} padding={[theme.sizes.padding, theme.sizes.padding, 0]}>
                    <Button
                        color={'primary'}
                        style={styles.submit}
                        onPress={() => handleSubmit()}>
                        <Text bold white center>Submit</Text>
                    </Button>

                    <Button onPress={() => handleCancel()} color={'transparent'}>
                        <Text gray small center style={{ textDecorationLine: 'underline' }}>
                            Cancel
                        </Text>
                    </Button>

                </Block>
            </KeyboardAvoidingView>
        )
    );
}

export default TitleForm;

const styles = StyleSheet.create({
    form: {
        flex: 1,
        justifyContent: 'space-between',
    },
    input: {
        borderRadius: 0,
        borderWidth: 0,
        borderBottomColor: theme.colors.gray2,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    submit: {
        maxWidth: theme.sizes.maxWidth,
        minWidth: theme.sizes.minWidth,
        height: theme.sizes.base * 2.5,
        flex: -1,
    },
    hasErrors: {
        borderBottomColor: theme.colors.accent,
    },
});
