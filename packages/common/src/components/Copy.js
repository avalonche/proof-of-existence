import React from 'react';
import { Clipboard, StyleSheet } from 'react-native';

import { FontAwesomeIcon } from '../utils/FontAwesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

import { Button } from './shared';
import { theme } from '../assets/constants';

const Copy = (props) => {
    const { content } = props;

    async function copyString() {
        await Clipboard.setString(content);
        // alert
    }

    return (
        <Button middle right flex={-1} style={styles.copy} onPress={() => copyString()} {...props}>
            <FontAwesomeIcon
                icon={faCopy}
                color={theme.colors.gray}
                size='1x'
            />
        </Button>
    );
}

export default Copy;

const styles = StyleSheet.create({
    copy: {
        width: theme.sizes.base,
        height: theme.sizes.base,
        marginRight: theme.sizes.padding / 4,
        marginLeft: theme.sizes.padding / 4,
    },
})