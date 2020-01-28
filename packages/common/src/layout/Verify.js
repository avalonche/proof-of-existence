import React, { useState } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { drizzleReactHooks } from '@drizzle/react-plugin';

import { FontAwesome } from '../utils/FontAwesome';
import { faCheckCircle, faExclamationCircle, faCheck, faCertificate, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useHistory } from '../utils/Router';

import moment from 'moment';
import { Text, Block, Spinner, Button, Input } from '../components/shared';
import { theme } from '../assets/constants';

function Verify() {
    const { useCacheCall } = drizzleReactHooks.useDrizzle();

    const history = useHistory();
    const location = useLocation();

    const queryString = location.search.replace('?', '');
    const [ searchString, setSearchString ] = useState(queryString);
    
    
    const proof = useCacheCall('ProofOfExistence', 'verifyDocument', queryString);

    function getFormattedDate(timestamp) {
        const date = new Date(timestamp*1000);
        return moment(date).local().format('MMMM Do YYYY, h:mm:ss a');
    }

    function renderProof() {
        return (
            typeof proof === 'undefined' ? (
                <Spinner color={'gray'} center middle text={'Fetching data associated with hash from contract...'}/>
            ) : (
                <Block>
                    {renderResult()}
                </Block>
            )
        );
    }

    function renderResult()  {
        // null means transaction has reverted,hash not stored in contract
        return proof == null ? (
            <Block middle center style={styles.container}>
                <FontAwesome
                    icon={faExclamationCircle}
                    color={theme.colors.gray2}
                    size={theme.sizes.base * 5}
                />
                <Text h1 gray bold>
                    Hash Not Found
                </Text>
                <Text h4 gray light style={styles.body}>
                    The content with this hash has not been uploaded yet or the hash is invalid.
                </Text>
            </Block>
        ) : (
            <Block middle center style={styles.container}>
                <FontAwesome
                    icon={faCheckCircle}
                    color={theme.colors.primary}
                    size={theme.sizes.base * 5}
                />
                <Text h1 primary bold style={styles.body}>
                    Verified
                </Text>
                <Block flex={0.5}>
                    <Block row flex={-1} space={'between'} padding={theme.sizes.padding / 2}>
                        <Text h4 gray bold>Block Number: </Text>
                        <Text h4 gray light>{proof[0]}</Text>
                        <Text h4 gray bold>Time Uploaded: </Text>
                        <Text h4 gray light>{getFormattedDate(proof[1])}</Text>
                    </Block>
                    <Block row flex={-1} space={'between'} padding={theme.sizes.padding / 2}>
                        <Text h4 gray bold>Uploader Address: </Text>
                        <Text h4 gray light>{proof[2]}</Text>
                    </Block>
                </Block>
            </Block>
        )
    }

    function renderVerifyBar() {
        return (
            <Block middle padding={[0, theme.sizes.base]}>
                <Input
                    placeholder="Verify an IPFS Hash..."
                    placeholderTextColor={theme.colors.gray2}
                    style={styles.verifyInput}
                    onChangeText={text => setSearchString(text)}
                    value={searchString}
                    clearButtonMode="while-editing"
                    returnKeyType="verify"
                    onSubmitEditing={() => history.push(`/verify?${searchString}`)}
                    onRightPress={() => searchString ? history.push(`/verify?${searchString}`) : null}
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
        );
    }

    function renderBody() {
        return (
            <Block center padding={theme.sizes.padding}>
                <Text h4 light gray>
                    Input an IPFS Hash to verify that it has been uploaded before...
                </Text>
            </Block>
        )
    }
   
    return (
        <Block>
            <Block row center flex={-1}>
                {Platform.OS !== 'web' ? renderVerifyBar() : null}
            </Block>
        {queryString === '' ? renderBody() : renderProof()}
        </Block>
    );
}

export default Verify;

const styles = StyleSheet.create({
    verifyInput: {
        fontSize: theme.sizes.caption,
        height: theme.sizes.base * 2,
        backgroundColor: 'rgba(142, 142, 147, 0.06)',
        borderColor: 'rgba(142, 142, 147, 0.06)',
        paddingLeft: theme.sizes.base / 1.333,
        paddingRight: theme.sizes.base * 1.5,
    },
    container: {
        padding: theme.sizes.padding,
        minWidth: theme.sizes.minWdith,
    },
    body: {
        margin: theme.sizes.padding
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
    back: {
        height: theme.sizes.base,
        width: theme.sizes.base,
    }
});
