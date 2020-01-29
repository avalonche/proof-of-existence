import React, { useMemo } from 'react'
import { Dimensions, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useHistory } from '../utils/Router';

import { ContentPreview } from '../utils/Uploader';

import { Block, Text, Spinner } from '../components/shared';
import { theme } from '../assets/constants';

const { width, height } = Dimensions.get('window');

const Home = () => {
  const history = useHistory();
  const content = useSelector(state => state.content.allContent);

  function loadContent() {
    const loading = content.loading;

    return loading && !content.files ? (
      <Spinner middle center color={'gray'} text={'Fetching content from IPFS...'}/>
    ) : (
      renderContent()
    )
  }

  function renderImage(content, index) {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => history.push(`content/${index + 1}`)}
        style={styles.content}
      >
        <ContentPreview
          preview={content.url}
          fileType={content.fileType}
          style={styles.content}
        />
      </TouchableOpacity>
    )
  }

  function renderContent() {
    const filePreviews = content.filePreviews
    const mainContent = filePreviews && filePreviews.length > 0 ? filePreviews[0] : null;

    return (
      mainContent ? (
        <Block style={{ marginBottom: height / 3 }}>
          <TouchableOpacity
            style={[ styles.content, styles.mainContent ]}
            onPress={() => history.push('content/1')}
          >
            <ContentPreview
              preview={mainContent.url}
              fileType={mainContent.fileType}
              style={[styles.content, styles.mainContent]}
            />
          </TouchableOpacity>
          <Block row space='between' wrap>
            {
              filePreviews.slice(1).map((img, index) => renderImage(img, index))
            }
          </Block>
        </Block>
      ) : (
        <Block middle center padding={theme.sizes.padding}>
          <Text gray light>
            No Uploads Yet
          </Text>
        </Block>
      )
    );
  }
 
  return (
    <Block style={{minWidth: theme.sizes.minWidth}}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.contentContainer}>
        {useMemo(() => loadContent(), [content.filePreviews])}
      </ScrollView>
    </Block>
  )
}

export default Home;

const styles = StyleSheet.create({
  contentContainer: {
    marginHorizontal: theme.sizes.padding * 1.25,
  },
  content: {
    minHeight: 100,
    maxHeight: 130,
    maxWidth: width - (theme.sizes.padding * 2.5),
    marginBottom: theme.sizes.base,
    borderRadius: 4,
    shadowColor: 'transparent',
  },
  mainContent: {
    minWidth: width - (theme.sizes.padding * 2.5),
    minHeight: width - (theme.sizes.padding * 2.5),
    alignItems: 'center',
  },
});
