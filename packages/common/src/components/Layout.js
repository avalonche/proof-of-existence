import React, { useState } from 'react';
import { Platform, StyleSheet, Animated } from 'react-native';
import { useLocation, useHistory } from '../utils/Router';

import { Modal } from '../utils/Modal';
import { FontAwesome } from '../utils/FontAwesome';
import { faCamera, faUser, faHome, faCheck, faCertificate } from '@fortawesome/free-solid-svg-icons';

import TitleForm from './TitleForm'
import { Uploader, ContentPreview, selectContent } from '../utils/Uploader';
import { Block, Text, Input, Button, Divider } from './shared';
import { theme } from '../assets/constants';

// web header:
const Layout = (props) => {
    const location = useLocation();
    const history = useHistory();

    const [ preview, setPreview ] = useState('');
    const [ fileType, setFileType ] = useState('')
    const [ showModal, setShowModal ] = useState(false);

    function renderCamera() {
        return (
            <Button onPress={() => selectContent(setPreview, setFileType, setShowModal)}>
                <Uploader
                    icon={
                        <FontAwesome
                            icon={faCamera}
                            color={theme.colors.gray2}
                            style={{ marginRight: theme.sizes.padding }}
                            size={theme.sizes.h2}
                        />
                    }
                    setPreview={setPreview}
                    setFileType={setFileType}
                    setShowModal={setShowModal}
                />
            </Button>
        )
    }

    function renderIcons() {
        const iconNames = ['home', 'verify', 'account'];
        const icons = { home: faHome, verify: faCheck, account: faUser };
        const currentPath = (path) => path === location.pathname.replace('/', '');

        return iconNames.map((iconName) => (
            <Button onPress={() => history.push(`/${iconName}`)}>
                <FontAwesome
                    icon={icons[iconName]}
                    color={currentPath(iconName) ? theme.colors.black : theme.colors.gray2}
                    style={{ marginRight: theme.sizes.padding }}
                    size={theme.sizes.h2}
                />
            </Button>
        ));
    }

    const [ hashString, setHashString ] = useState('');
    const searchBar = new Animated.Value(0.3);

    function handleSearchFocus(status) {
        Animated.timing(
            searchBar,
            {
                toValue: status ? 1 : 0.3, // status === true, increase flex size
                duration: 150, // ms
            }).start();
    }

    function handleSearchSubmit(hashString) {
        history.push({
            pathname: `/verify`,
            search: `?${hashString}`
        });
    }

    function renderVerify() {
        const isEditing = searchBar && hashString;

        return (
            <Block animated middle flex={searchBar} style={styles.verify}>
                <Input
                    placeholder="Verify Hash..."
                    placeholderTextColor={theme.colors.gray2}
                    style={styles.verifyInput}
                    onFocus={() => handleSearchFocus(true)}
                    onBlur={() => handleSearchFocus(false)}
                    onChangeText={text => setHashString(text)}
                    value={hashString}
                    clearButtonMode="while-editing"
                    returnKeyType="verify"
                    onSubmitEditing={() => handleSearchSubmit(hashString)}
                    onRightPress={() => isEditing ? handleSearchSubmit(hashString) : null}
                    rightStyle={styles.verifyRight}
                    rightLabel={
                        <Block middle center style={styles.verifyIcon}>
                            <FontAwesome
                                icon={faCertificate}
                                color={theme.colors.gray2}
                                style={{ fontSize: theme.sizes.base * 1.2 }}
                            />
                            <FontAwesome
                                icon={faCheck}
                                style={{ position: 'absolute', fontSize: theme.sizes.base * 0.6 }}
                                color={theme.colors.white}
                            />
                        </Block>
                    }
                />
            </Block>
        )
    }

    function renderModal() {
        return (
            <Modal visible={showModal}>
                <Block padding={theme.sizes.padding / 2} style={styles.upload}>
                    <Text bold h2>Upload</Text>
                </Block>
                <Block middle center>
                    <ContentPreview preview={preview} fileType={fileType} />
                </Block>
                <TitleForm setShowModal={setShowModal} />
            </Modal>
        );
    }

    const icons = renderIcons();
    const home = icons[0];
    const verify = icons[1];
    const account = icons[2];
    const camera = renderCamera();

    function renderHeader() {
        return (
            <Block center row flex={-1} padding={theme.sizes.padding / 2} style={styles.header} space='between'>
                <Block row middle center flex={-1} style={{ paddingRight: theme.sizes.padding }}>
                    {home}
                    {camera}
                    {account}
                </Block>
                {renderVerify()}
            </Block>
        );
    }

    function renderFooter() {
        return (
            <Block row flex={false} middle space='between' style={styles.footer}>
                {home}
                {camera}
                {verify}
                {account}
            </Block>
        )
    }

    return (
        <Block style={{ minWidth: theme.sizes.minWidth * 2 }}>
            {Platform.OS === 'web' ? renderHeader() : null}
            <Block color={theme.colors.background}>
                {renderModal()}
                {props.children}
            </Block>
            {Platform.OS !== 'web' ? renderFooter() : null}
        </Block>
    )
}

export default Layout;

const styles = StyleSheet.create({
    header: {
        borderBottomColor: theme.colors.gray2,
        borderBottomWidth: StyleSheet.hairlineWidth,
        width: '100%',
    },
    footer: {
        borderTopColor: theme.colors.gray2,
        borderTopWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: theme.sizes.padding,
    },
    verify: {
        minWidth: theme.sizes.minWidth / 1.5,
        justifyContent: 'flex-end',
    },
    verifyInput: {
        fontSize: theme.sizes.caption,
        height: theme.sizes.base * 2,
        backgroundColor: 'rgba(142, 142, 147, 0.06)',
        borderColor: 'rgba(142, 142, 147, 0.06)',
        paddingLeft: theme.sizes.base / 1.333,
        paddingRight: theme.sizes.base * 1.5,
        margin: 0,
    },
    verifyRight: {
        top: 0,
        marginVertical: 0,
        backgroundColor: 'transparent'
    },
    verifyIcon: {
        position: 'absolute',
        right: theme.sizes.base / 1.333,
    },
    upload: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: theme.colors.gray2,
    },
});
