import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useLocation, useHistory } from '../utils/Router';

import { Modal } from '../utils/Modal';
import { FontAwesome } from '../utils/FontAwesome';
import { faCamera, faUser, faHome, faCheck } from '@fortawesome/free-solid-svg-icons';

import TitleForm from './TitleForm';
import VerifyBar from './VerifyBar';
import { Uploader, ContentPreview, selectContent, clearPreview } from '../utils/Uploader';
import { Block, Text, Button } from './shared';
import { theme } from '../assets/constants';

const Layout = (props) => {
    const location = useLocation();
    const history = useHistory();

    const [ preview, setPreview ] = useState('');
    const [ fileType, setFileType ] = useState('')
    const [ showModal, setShowModal ] = useState(false);

    useEffect(() => showModal ? undefined : clearPreview(), [showModal]);

    function renderCamera() {
        return (
            <Button color={'transparent'} onPress={() => selectContent(setPreview, setFileType, setShowModal)}>
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
            <Button onPress={() => history.push(`/${iconName}`)} color={'transparent'}>
                <FontAwesome
                    icon={icons[iconName]}
                    color={currentPath(iconName) ? theme.colors.black : theme.colors.gray2}
                    style={{ marginRight: theme.sizes.padding }}
                    size={theme.sizes.h2}
                />
            </Button>
        ));
    }

    function renderModal() {
        return (
            <Modal visible={showModal} animationType='slide'>
                <Block padding={theme.sizes.padding / 2} flex={-1} style={styles.upload}>
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
                <VerifyBar/>
            </Block>
        );
    }

    function renderFooter() {
        return (
            <Block color={'transparent'} row flex={false} middle space='between' style={styles.footer}>
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
            <Block color={theme.colors.background} style={{ paddingTop: theme.sizes.padding }}>
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
    upload: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: theme.colors.gray2,
    },
});
