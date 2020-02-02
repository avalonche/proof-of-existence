import React from 'react';
import { Clipboard, StyleSheet } from 'react-native';

import { FontAwesome } from '../../utils/FontAwesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

import { Button } from '../shared';
import { theme } from '../../assets/constants';

const Copy = (props) => {
    const { content } = props;

    async function copyString() {
        await Clipboard.setString(content);
    }

    return (
        <Button middle style={styles.copy} onPress={() => copyString()} {...props}>
            <FontAwesome
                icon={faCopy}
                color={theme.colors.gray}
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