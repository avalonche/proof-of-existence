import React, { useEffect, useState } from 'react';
import { ScrollView, Platform, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { drizzleReactHooks } from '@drizzle/react-plugin';
import { useParams, useHistory } from '../utils/Router';
import { requestOneContent } from '../redux/content/contentActions';

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
    const [ contentId, setContentId ] = useState()
    const [ showEditModal, setShowEditModal ] = useState(false);
    const [ showTagsModal, setShowTagsModal ] = useState(false);

    const content = useSelector(state => state.content.oneContent);
    const dispatch = useDispatch();
    const history = useHistory();
    // error handling incase they request bad id
    const { id } = useParams();
    useEffect(() => {
        setContentId(parseInt(id));
    }, [])

    const contentInfo = useCacheCall('DocumentInfo', 'getDocument', contentId - 1);
    const documentNum = useCacheCall('DocumentInfo', 'getNumberOfDocuments');
    const tagInfo = useCacheCall(['DocumentInfo'], call => {
        const tags = [];
        for (let i = 0; call('DocumentInfo', 'validTagIndex', contentId - 1, i); i++) {
            const tag = call('DocumentInfo', 'getTagByIndex', contentId - 1, i)
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

    function renderHeader() {
        return (
            <Block row center flex={-1}>
                <Block style={{ padding: theme.sizes.base / 2 }}>
                    <Text h3 bold center>{contentInfo._title}</Text>
                </Block>

                <Block row style={styles.icons}>
                    <Button color={'transparent'} onPress={() => setShowEditModal(true)}>
                        <FontAwesome
                            icon={faEdit}
                            size={theme.sizes.h4}
                            style={{ padding: theme.sizes.base / 2 }}
                        />
                    </Button>

                    <Button color={'transparent'} onPress={() => setShowTagsModal(true)}>
                        <FontAwesome
                            icon={faTags}
                            size={theme.sizes.h4}
                            style={{ padding: theme.sizes.base / 2 }}
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

    function renderHome() {
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

    function renderArrows() {
        const back = () => {
            return (
                contentId - 1 > 0 ? (
                    <Button style={[styles.buttons, { left: 20 }]} onPress={(() => history.push(`/content/${previous}`))}>
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
                    <Button style={[styles.buttons, { right: 20 }]} onPress={(() => history.push(`/content/${next}`))}>
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
            <Spinner middle center gray text={'Loading content...'}/>
        ) : (
            <Block middle>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Block style={styles.mainContainer}>
                        {Platform.OS !== 'web' ? renderHome() : null}

                        <Modal setShowModal={setShowEditModal} title={contentInfo._title} index={contentId - 1}>
                            <TitleForm/>
                        </Modal>
                        <Modal setShowModal={setShowTagsModal} tags={tagInfo} index={contentId - 1}>
                            <TagsForm/>
                        </Modal>
                        
                        {renderHeader()}
                        {renderContent()}
                        <Block margin={[0, theme.sizes.base]} style={styles.container}>
                            <Block padding={theme.sizes.padding} flex={-1}>
                                <Block row space='between'>
                                    <Text bold>IPFS Hash: </Text>
                                    <Text light gray numberOfLine={1}>{contentInfo._ipfsHash}</Text>
                                    <Copy content={contentInfo._ipfsHash} />
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
        maxWidth: theme.sizes.maxWidth * 1.5,
        minWidth: theme.sizes.minWidth * 3,
        borderColor: theme.colors.gray2,
        borderWidth: StyleSheet.hairlineWidth,
        marginVertical: theme.sizes.base,
        alignSelf: 'center',
        backgroundColor: theme.colors.white,
        flexShrink: 0,
        flex: -1,
        overflow: 'hidden',
        borderRadius: theme.sizes.borderRadius
    },
    container: {
        borderTopColor: theme.colors.gray2,
        borderTopWidth: StyleSheet.hairlineWidth,
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
    }
})