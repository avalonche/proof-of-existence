import React, { useEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { drizzleReactHooks } from '@drizzle/react-plugin';
import { useParams, useHistory } from '../utils/Router';
import { requestOneContent } from '../redux/content/contentActions';

import { FontAwesome } from '../utils/FontAwesome';
import { faChevronLeft, faChevronRight, faTag } from '@fortawesome/free-solid-svg-icons';

import NotFound from './NotFound';
import { ContentPreview } from '../utils/Uploader';
import { alert } from '../utils/Alert';
import { Spinner, Block, Text, Button, Copy } from '../components/shared';
import { theme } from '../assets/constants';

const Content = () => {
    const { useCacheCall } = drizzleReactHooks.useDrizzle();

    const content = useSelector(state => state.content.oneContent);
    const dispatch = useDispatch();
    const history = useHistory();
    // error handling incase they request bad id
    const { id } = useParams();
    const contentInfo = useCacheCall('DocumentInfo', 'getDocument', id - 1);
    const documentNum = useCacheCall('DocumentInfo', 'getNumberOfDocuments');
    const numTags = useCacheCall('DocumentInfo', 'getNumberOfTags', id - 1);
    const tagInfo = useCacheCall(['DocumentInfo'], call => {
        const tags = [];
        for (let i = 0; call('DocumentInfo', 'validTagIndex', id - 1, i); i++) {
            const tag = call('DocumentInfo', 'getTagByIndex', id - 1, i)
            if (tag && tag.exists) {
                tags.push(tag);
            }
            i++;
        }
        return tags;
    });

    useEffect(() => {
        if (typeof contentInfo !== 'undefined') {
            contentInfo == null ? null : dispatch(requestOneContent(contentInfo))
        }
    }, [contentInfo]);

    function renderContent() {
        const filePreview = content.filePreview;
        
        const back = () => {
            return (
                id - 1 > 0 ? (
                    <Button color={'transparent'} onPress={(() => history.push(`/content/${id - 1}`))}>
                        <FontAwesome
                            icon={faChevronLeft}
                            color={theme.colors.gray}
                            style={{ opacity: 0.5 }}
                        />
                    </Button>
                ) : (
                    null
                )
            )
        }

        const forward = () => {
            return (
                id < documentNum ? (
                    <Button color={'transparent'} onPress={(() => history.push(`/content/${id - 1}`))}>
                        <FontAwesome
                            icon={faChevronRight}
                            color={theme.colors.gray}
                            style={{ opacity: 0.5 }}
                        />
                    </Button>
                ) : (
                    null
                )
            )
        }

        return (
            filePreview ? (
                <Block center middle space='between' row>
                    {back()}
                    <ContentPreview
                        preview={filePreview.url}
                        fileType={filePreview.fileType}
                        style={{ borderRadius: 0 }}
                    />
                    {forward()}
                </Block>
            ) : (
                // error getting content, show alert
                alert({content: 'Error fetching content. Please refresh the page or try again later'})
            )
        )
    }

    function renderHeader() {
        return (
            <Block row flex={-1} style={{ paddingLeft: theme.sizes.padding / 2 }}>
                <Button color={'transparent'} flex={-1} onPress={() => history.push('/home')}>
                    <FontAwesome
                        icon={faChevronLeft}
                        color={theme.colors.gray2}
                    />
                </Button>
            </Block>
        )
    }

    function renderEdit() {
        <Block row right>

        </Block>
    }

    function renderInfo() {
        return (
            <Block padding={theme.sizes.padding}>
                <Text center gray light>{contentInfo._title}</Text>
                <Block row space='between'>
                    <Text bold>IPFS Hash: </Text>
                    <Text light gray numberOfLine={1}>{contentInfo._ipfsHash}</Text>
                    <Copy content={contentInfo._ipfsHash}/>
                </Block>
            </Block>
        )
    }

    if (typeof contentInfo === 'undefined') {
        return (
            <Spinner middle center color={'gray'} text={'Loading content...'}/>
        )
    }

    if (contentInfo == null) {
        return (
            <NotFound/>
        );
    }

    return (
        content.loading ? (
            <Spinner middle center gray text={'Loading content...'}/>
        ) : (
            <Block>
                {Platform.OS !== 'web' ? renderHeader() : null}
                {renderContent()}
                {renderInfo()}
            </Block>
        )
    );
}

export default Content;
