import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { drizzleReactHooks } from '@drizzle/react-plugin';
import { useParams, useHistory } from '../utils/Router';
import { requestOneContent } from '../redux/content/contentActions';

import { FontAwesomeIcon } from '../utils/FontAwesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import NotFound from './NotFound';
import { ContentPreview } from '../utils/Uploader';
import { Spinner, Block, Button } from '../components/shared';
import { theme } from '../assets/constants';

const Content = () => {
    const { useCacheCall } = drizzleReactHooks.useDrizzle();

    const content = useSelector(state => state.content.oneContent);
    const dispatch = useDispatch();
    const history = useHistory();
    // error handling incase they request bad id
    const { id } = useParams();
    const contentInfo = useCacheCall('DocumentInfo', 'getDocument', id - 1);

    useEffect(() => {
        if (typeof contentInfo !== 'undefined') {
            contentInfo == null ? null : dispatch(requestOneContent(contentInfo))
        }
    }, [contentInfo]);

    function renderContent() {
        const filePreview = content.filePreview;

        return (
            filePreview ? (
                <ContentPreview
                    preview={filePreview.url}
                    fileType={filePreview.fileType}
                />
            ) : (
                null // error
            )
        )
    }

    function renderHeader() {
        return (
            <Block row flex={-1} style={{ paddingLeft: theme.sizes.padding / 2 }}>
                <Button flex={-1} onPress={() => history.push('/home')}>
                    <FontAwesomeIcon
                        icon={faChevronLeft}
                        color={theme.colors.gray2}
                        size='1x'
                    />
                </Button>
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
                {renderHeader()}
                {renderContent()}
            </Block>
        )
    );
}

export default Content;
