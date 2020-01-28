import React from 'react';
import { StyleSheet } from 'react-native';
import { useHistory } from '../utils/Router';
import { Block, Text, Button } from '../components/shared';
import { theme } from '../assets/constants';

export default function NotFound() {
    const history = useHistory();
    return (
        <Block middle center margin={theme.sizes.padding * 2}>
            <Text h1 black light>
                Page Not Found
            </Text>
            <Block flex={false} margin={theme.sizes.padding}>
                <Text gray light small>
                    The content you requested was not found or does not exist
                </Text>
            </Block>
            <Button shadow white style={styles.button} onPress={() => history.push('/home')}>
                <Text size={theme.sizes.base / 1.5} bold black style={styles.text}>
                    Back to Home
                </Text> 
            </Button>
        </Block>
    )
}

const styles = StyleSheet.create({
    text: {
        marginHorizontal: theme.sizes.padding / 2,
    },
    button: {
        height: theme.sizes.base * 2,
        marginVertical: theme.sizes.padding / 2,
    },
})