import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, Platform, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { drizzleReactHooks } from '@drizzle/react-plugin';
import { useParams, useHistory } from '../utils/Router';
import { requestOneContent } from '../redux/content/contentActions';
import { getCurrentProvider } from '../utils/connector';

import { FontAwesome } from '../utils/FontAwesome';
import { faChevronLeft, faChevronRight, faTags, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Modal } from '../utils/Modal';

import NotFound from './NotFound';
import TitleForm from '../components/TitleForm';
import TagsForm from '../components/TagsForm';
import { ContentPreview } from '../utils/Uploader';
import { alert } from '../utils/Alert';
import { Spinner, Block, Text, Button, Copy } from '../components/shared';
import { theme } from '../assets/constants';

const Content = () => {
    const { useCacheCall } = drizzleReactHooks.useDrizzle();
    const [ showEditModal, setShowEditModal ] = useState(false);
    const [ showTagsModal, setShowTagsModal ] = useState(false);

    const content = useSelector(state => state.content.oneContent);
    const dispatch = useDispatch();
    const history = useHistory();
    // error handling incase they request bad id
    const { id } = useParams();
    const contentId = parseInt(id);
    const web3 = getCurrentProvider();

    const contentInfo = useCacheCall('DocumentInfo', 'getDocument', String(contentId - 1));
    const documentNum = useCacheCall('DocumentInfo', 'getNumberOfDocuments');
    const tags = useCacheCall(['DocumentInfo'], call => {
        const tagsRes = [];
        for (let i = 0; call('DocumentInfo', 'validTagIndex', String(contentId - 1), i); i++) {
            const tagInfo = call('DocumentInfo', 'getTagByIndex', String(contentId - 1), i)
            if (tagInfo && tagInfo.exists) {
                tagsRes.push(web3.utils.hexToUtf8(tagInfo.tag));
            }
        }
        return tagsRes;
    });

    useEffect(() => {
        if (typeof contentInfo !== 'undefined') {
            contentInfo == null ? null : dispatch(requestOneContent(contentInfo))
        }
    }, [contentInfo]);

    function renderHeader() {
        return (
            <Block row center flex={-1}>
                <Block style={{ padding: theme.sizes.base / 2 }}>
                    <Text h3 bold center>{contentInfo._title}</Text>
                </Block>

                <Block row style={styles.icons}>
                    <Button
                        color={'transparent'}
                        style={{ padding: theme.sizes.base / 2 }}
                        onPress={() => setShowEditModal(true)}
                    >
                        <FontAwesome
                            icon={faEdit}
                            size={theme.sizes.h4}
                        />
                    </Button>

                    <Button
                        color={'transparent'}
                        style={{ padding: theme.sizes.base / 2 }}
                        onPress={() => setShowTagsModal(true)}
                    >
                        <FontAwesome
                            icon={faTags}
                            size={theme.sizes.h4}
                        />
                    </Button>
                </Block>
            </Block>
        )
    }

    function renderContent() {
        const filePreview = content.filePreview;
        
        return (
            filePreview ? (
                <Block center middle space='between' row flex={-1} style={{ flexShrink: 0 }}>
                    <ContentPreview
                        preview={filePreview.url}
                        fileType={filePreview.fileType}
                        style={styles.preview}
                    />
                </Block>
            ) : (
                // error getting content, show alert
                alert({content: 'Error fetching content. Please refresh the page or try again later'})
            )
        )
    }
    
    function renderTags() {
        const tagContainers = tags.map((tag, i) => (
            <Block key={`tag-${i}`} shadow row style={styles.tagContainer}>
                <Text center style={styles.tagText} small>{tag}</Text>
            </Block>
        ));

        return (
            <Block row wrap right padding={[0, theme.sizes.padding]}>
                {tagContainers}
            </Block>
        );
    }

    function renderHome() {
        return (
            <Block style={{ paddingLeft: theme.sizes.padding / 2 }}>
                <Button color={'transparent'} flex={-1} onPress={() => history.push('/home')}>
                    <FontAwesome
                        icon={faChevronLeft}
                        color={theme.colors.gray}
                    />
                </Button>
            </Block>
        )
    }

    function renderArrows() {
        const back = () => {
            return (
                contentId - 1 > 0 ? (
                    <Button style={[styles.buttons, { left: 20 }]} onPress={(() => history.push(`/content/${contentId - 1}`))}>
                        <FontAwesome
                            icon={faChevronLeft}
                            color={theme.colors.gray2}
                            style={{ paddingRight: 2 }}
                        />
                    </Button>
                ) : (
                        null
                    )
            )
        }

        const forward = () => {
            return (
                contentId + 1 <= documentNum ? (
                    <Button style={[styles.buttons, { right: 20 }]} onPress={(() => history.push(`/content/${contentId + 1}`))}>
                        <FontAwesome
                            icon={faChevronRight}
                            color={theme.colors.gray2}
                            style={{ paddingRight: 2 }}
                        />
                    </Button>
                ) : (
                        null
                    )
            )
        }

        return (
            <>
            {forward()}
            {back()}
            </>
        )
    }

    if (typeof contentInfo === 'undefined') {
        return (
            <Spinner middle center color={'gray'} text={'Loading content...'} />
        )
    }

    if (contentInfo == null) {
        return (
            <NotFound/>
        );
    }

    return (
        content.loading ? (
            <Spinner middle center color={'gray'} text={'Loading content...'}/>
        ) : (
            <Block middle>
                {Platform.OS !== 'web' ? renderHome() : null}
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Block style={styles.mainContainer}>

                        <Modal
                            visible={showEditModal}
                            style={{ content: { top: 80, bottom: 'none' }}}
                            animationType={'fade'}
                            transparent
                        >
                            <TitleForm setShowModal={setShowEditModal} title={contentInfo._title} index={contentId - 1}/>
                        </Modal>
                        <Modal
                            visible={showTagsModal}
                            style={{ content: { top: 80, bottom: 'none' }}}
                            animationType={'fade'}
                            transparent
                        >
                            <TagsForm setShowModal={setShowTagsModal} tags={tags} index={contentId - 1}/>
                        </Modal>
                        
                        {renderHeader()}
                        {renderContent()}
                        {renderTags()}
                        <Block style={styles.container}>
                            <Block>
                                <Block row padding={theme.sizes.padding}>
                                    <Text bold style={{ paddingRight: theme.sizes.padding }}>IPFS Hash: </Text>
                                    <Text light gray center numberOfLines={1} style={{ flex: 1 }}>{contentInfo._ipfsHash}</Text>
                                    <Copy content={contentInfo._ipfsHash}/>
                                </Block>
                            </Block>
                        </Block>
                    </Block>
                </ScrollView>
                {renderArrows()}
            </Block>
            )
    );
}

export default Content;

const styles = StyleSheet.create({
    mainContainer: {
        maxWidth: theme.sizes.maxWidth,
        borderColor: theme.colors.gray2,
        borderWidth: StyleSheet.hairlineWidth,
        marginVertical: theme.sizes.base,
        paddingHorizontal: theme.sizes.padding,
        alignSelf: 'center',
        backgroundColor: theme.colors.white,
        flexShrink: 0,
        flex: -1,
        overflow: 'hidden',
        borderRadius: theme.sizes.borderRadius,
        width: '100%',
    },
    container: {
        borderTopColor: theme.colors.gray2,
        borderTopWidth: StyleSheet.hairlineWidth,
        flex: -1,
    },
    preview: {
        paddingRight: 0,
        paddingLeft: 0,
        borderRadius: 0,
        alignItems: 'center',
    },
    buttons: {
        height: theme.sizes.base * 2,
        width: theme.sizes.base * 2,
        borderRadius: theme.sizes.base,
        backgroundColor: theme.colors.background,
        opacity: 0.5,
        position: 'absolute',
        alignItems: 'center',
    },
    icons: {
        position: 'absolute',
        right: 0,
        top: 0,
    },
    tagContainer: {
        flex: -1, 
        borderRadius: theme.sizes.radius / 2,
        borderColor: theme.colors.gray2,
        borderWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: theme.sizes.padding / 4,
        justifyContent: 'center',
        margin: theme.sizes.base / 2,
        marginTop: 0,
        backgroundColor: theme.colors.white,
    },
    tagText: {
        padding: theme.sizes.base / 4,
        paddingTop: theme.sizes.base / 8,
        marginHorizontal: theme.sizes.base / 8,
    },
})