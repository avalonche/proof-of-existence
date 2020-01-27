import React, { useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useHistory } from '../utils/Router';

import { FontAwesome } from '../utils/FontAwesome';
import { faCheck, faCertificate } from '@fortawesome/free-solid-svg-icons';
import { Block, Input } from './shared';
import { theme } from '../assets/constants';

const VerifyBar = () => {
    const [ hashString, setHashString ] = useState('');
    const searchBar = new Animated.Value(0.3);
    const history = useHistory();

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

export default VerifyBar;

const styles = StyleSheet.create({
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