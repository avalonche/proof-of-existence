import React, { useState } from 'react';
import { Platform, StyleSheet, Animated } from 'react-native';
import { useLocation, useHistory } from '../utils/Router';

import { FontAwesomeIcon } from '../utils/FontAwesome';
import { faCamera, faUser, faHome, faCheck, faCertificate } from '@fortawesome/free-solid-svg-icons';

import { Block, Input, Button } from './shared';
import { theme } from '../assets/constants';

// web header:
const Layout = (props) => {
    const location = useLocation();
    const history = useHistory();

    const [ searchString, setSearchString ] = useState('');
    const searchBar = new Animated.Value(0.3);
    const page = new Animated.Value(1);

    function renderIcons() {
        const iconNames = ['home', 'camera', 'verify', 'account'];
        const icons = { home: faHome, camera: faCamera, verify: faCheck, account: faUser };
        const currentPath = (path) => path === location.pathname.replace('/', '');

        return iconNames.map((iconName) => (
            <FontAwesomeIcon
                icon={icons[iconName]}
                color={currentPath(iconName) ? theme.colors.black : theme.colors.gray2}
                size={'lg'}
                style={{ marginRight: theme.sizes.padding }}
            />
        ));
    }

    function renderHeader() {
        const icons = renderIcons();
        return (
            <Block center row flex={-1} padding={theme.sizes.base} style={styles.header} space='between'>
                <Block row flex={-1} style={{ paddingRight: theme.sizes.padding }}>
                    <Button onPress={history.push('/home')}>
                        {icons[0]}
                    </Button>
                </Block>
                {renderVerify()}
            </Block>
        );
    }

    function handleSearchFocus(status) {
        Animated.parallel([
            Animated.timing(
                searchBar,
                {
                    toValue: status ? 1 : 0.3, // status === true, increase flex size
                    duration: 150, // ms
                }),
            Animated.timing(
                page,
                {
                    toValue: status ? 1 : 0,
                    duration: 150,
                })
        ]).start();
    }

    function handleSearchSubmit(searchString) {
        history.push({
            pathname: `/verify`,
            search: `?${searchString}`
        });
    }

    function renderVerify() {
        const isEditing = searchBar && searchString;

        return (
            <Block animated middle flex={searchBar} style={styles.verify}>
                <Input
                    placeholder="Verify Hash..."
                    placeholderTextColor={theme.colors.gray2}
                    style={styles.verifyInput}
                    onFocus={() => handleSearchFocus(true)}
                    onBlur={() => handleSearchFocus(false)}
                    onChangeText={text => setSearchString(text)}
                    value={searchString}
                    clearButtonMode="while-editing"
                    returnKeyType="verify"
                    onSubmitEditing={() => handleSearchSubmit(searchString)}
                    onRightPress={() => isEditing ? handleSearchSubmit(searchString) : null}
                    rightStyle={styles.verifyRight}
                    rightLabel={
                        <Block middle center style={styles.verifyIcon}>
                            <FontAwesomeIcon
                                icon={faCertificate}
                                color={theme.colors.gray2}
                                style={{ fontSize: theme.sizes.base * 1.2 }}
                            />
                            <FontAwesomeIcon
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

    return (
        Platform.OS === 'web' ? (
            <Block style={{minWidth: theme.sizes.minWidth * 2}}>
                {renderHeader()}
                {props.children}
            </Block>
        ) : (
            <Block>
            {/* {renderFooter()} */}
            </Block>
        )
    )
}

export default Layout;

const styles = StyleSheet.create({
    header : {
        borderBottomColor: theme.colors.gray2,
        borderBottomWidth: StyleSheet.hairlineWidth,
        width: '100%',
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
});
