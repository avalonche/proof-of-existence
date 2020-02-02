import React, { useState, useEffect } from 'react';
import { Keyboard, KeyboardAvoidingView, StyleSheet } from 'react-native';

import { alert } from '../utils/Alert';

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

    // use effect to create alert notifications for upload and tx errors
    useEffect(() => {
        if (Object.keys(errors).length !== 0 && !errors.title) {
            Object.keys(errors).forEach((key) => {
                console.log(errors)
                alert({
                    content: errors[key],
                    duration: 3000, 
                })
            });
        }
    }, [errors])

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

    function submitForm() {
        const formProps = {
            title: title,
            setShowModal: setShowModal,

        }

        // no props.title means we are uploading a new file
        return (
            props.title ? (
                <SubmitEdit
                    {...formProps}
                    index={props.index}
                    oldTitle={props.title}
                />
            ) : (
                <SubmitUpload
                    {...formProps}
                    txCallback={txCallback}
                    setTxCallback={setTxCallback}
                    setErrors={setErrors}
                />
            )
        );
    }

    return (
        submitted && Object.keys(errors).length === 0 ? (
            submitForm()
        ) : (
            <KeyboardAvoidingView
                style={[styles.form, props.title ? { backgroundColor: theme.colors.overlay } : null]}
                behavior='padding'
            >
                <Block padding={theme.sizes.padding} color={'white'} flex={props.title ? -1 : 1}>
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

                <Block padding={[0, theme.sizes.padding]} flex={-1} color={'white'}>
                    <Button
                        color={'primary'}
                        style={styles.submit}
                        onPress={() => handleSubmit()}>
                        <Text bold white center>Submit</Text>
                    </Button>

                    <Button onPress={() => setShowModal(false)} color={'transparent'}>
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
        justifyContent: 'center',
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
        width: '100%',
        alignSelf: 'center',
    },
    hasErrors: {
        borderBottomColor: theme.colors.accent,
    },
});
