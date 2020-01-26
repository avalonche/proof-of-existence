import React, { useState, useEffect, useMemo } from 'react'
import { Animated, Dimensions, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useSelector } from 'react-redux';
import { useHistory } from '../utils/Router';
import { FontAwesomeIcon } from '../utils/FontAwesome';
import { faCertificate, faCheck, faUserCircle, faCamera } from '@fortawesome/free-solid-svg-icons';

import { Modal } from '../utils/Modal';
import { Uploader, ContentPreview, selectContent, clearPreview } from '../utils/Uploader';

import ContentForm from '../components/ContentForm';
import { Input, Block, Text, Button, Spinner } from '../components/shared';
import { theme } from '../assets/constants';

const { width, height } = Dimensions.get('window');

const Home = () => {
  const [ searchString, setSearchString ] = useState('');
  const [ searchInFocus, setSearchInFocus ] = useState();
  const [ preview, setPreview ] = useState(null);
  const [ fileType, setfileType ] = useState(null);
  const [ visible, setVisible ] = useState(false);
  const history = useHistory();
  const content = useSelector(state => state.content.allContent);

  const searchBar = new Animated.Value(0.3);
  const page = new Animated.Value(1);

  const fadeOut = {
    opacity: page
  }

  useEffect(() => visible ? undefined : clearPreview(), [visible]);

  function handleSearchFocus(status) {
    Animated.parallel([
      Animated.timing(
      searchBar,
      {
        toValue: status ? 1 : 0.3, // status === true, increase flex size
        duration: 150, // ms
      }),
      Animated.timing(
      page,
      {
        toValue: status ? 0 : 1,
        duration: 150,
      })
    ]).start(() => setSearchInFocus(status));
  }

  function handleSearchSubmit(searchString) {
    history.push({
      pathname: `/verify`,
      search: `?${searchString}`
    });
  }

  function loadContent() {
    const loading = content.loading;

    return loading && !content.files ? (
      <Spinner middle center color={'gray'} text={'Fetching content from IPFS...'}/>
    ) : (
      renderContent()
    )
  }

  function renderVerify() {
    const isEditing = searchBar && searchString;
  
    return (
      <Block animated middle flex={searchBar} style={styles.verify}>
        <Input
          placeholder="Verify an IPFS Hash..."
          placeholderTextColor={theme.colors.gray2}
          style={styles.verifyInput}
          onFocus={() => handleSearchFocus(true)}
          onBlur={() => handleSearchFocus(false)}
          onChangeText={text => setSearchString(text)}
          value={searchString}
          clearButtonMode="while-editing"
          onSubmitEditing={() => handleSearchSubmit(searchString)}
          onRightPress={() => isEditing ? handleSearchSubmit(searchString) : null}
          rightStyle={styles.verifyRight}
          rightLabel={
            <Block middle center style={styles.verifyIcon}>
              <FontAwesomeIcon
                icon={faCertificate}
                color={theme.colors.gray2}
                style={{fontSize: theme.sizes.base * 1.2}}
              />
              <FontAwesomeIcon
                  icon={faCheck}
                  style={{position: 'absolute', fontSize: theme.sizes.base * 0.6}}
                  color={theme.colors.white}
              />
            </Block>          
          }
        />
      </Block>
    )
  }

  function renderImage(content, index) {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => history.push(`content/${index + 1}`)}
        disabled={searchInFocus}
      >
        <ContentPreview
          source={content.url}
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
            disabled={searchInFocus}
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
        null
      )
    );
  }

  function renderUpload() {
    return (
      <Block center animated style={[styles.upload, fadeOut]}>
        <Button
          shadow
          color={'primary'}
          style={{ borderRadius: height * 0.1 / 2}}
          onPress={() => selectContent()}
          disabled={searchInFocus}
         >
            <Uploader 
              icon={
                <FontAwesomeIcon
                  icon={faCamera}
                  style={{padding: theme.sizes.padding * 0.7}}
                  color={theme.colors.white}
                  size={'2x'}
                />
              }
              setPreview={setPreview}
              setVisible={setVisible}
              setFileType={setfileType}
            />
        </Button>
      </Block>
    )
  }

  function renderModalForm() {
    return (
      <Modal visible={visible}>
        <KeyboardAvoidingView style={styles.modal} behavior="padding">
          <Block padding={[0, theme.sizes.base * 2]}>
            <Block middle>
                <Block middle center flex={false}>
                  <ContentPreview preview={preview} fileType={fileType}/>
                </Block>
                <ContentForm
                  setVisible={setVisible}
                />
           </Block>
          </Block>
        </KeyboardAvoidingView>
      </Modal>
    );
  }

  function renderAccount() {
    return (
      <Block animated shadow flex={false} style={{opacity: page}}>
        <Button disabled={searchInFocus} onPress={() => history.push("/account")}>
          <FontAwesomeIcon
          icon={faUserCircle}
          color={theme.colors.gray2}
          size={20}
          />
        </Button>
      </Block>
    );
  }
 
  return (
    <Block style={{minWidth: theme.sizes.minWidth}}>
      {renderModalForm()}
      <Block flex={false} row center style={styles.header}>
        <Block style={styles.verifyContainer}>
          {renderVerify()}
        </Block>
        {renderAccount()}
      </Block>
      <Block animated style={fadeOut}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.contentContainer}>
          <Text center h1 light spacing={2}>Uploads</Text>
          {useMemo(() => loadContent(), [content.filePreviews])}
        </ScrollView>
      </Block>
      {renderUpload()}
    </Block>
  )
}

export default Home;

const styles = StyleSheet.create({
  header: {
    padding: theme.sizes.base * 2
  },
  verifyContainer: {
    position: 'absolute',
    bottom: 0,
    right: theme.sizes.base * 2,
    left: theme.sizes.base * 2,
    flexDirection: 'row-reverse',
  },
  verify: {
    width: width - theme.sizes.base * 2,
    minWidth: theme.sizes.minWidth
  },
  verifyInput: {
    fontSize: theme.sizes.caption,
    height: theme.sizes.base * 2,
    backgroundColor: 'rgba(142, 142, 147, 0.06)',
    borderColor: 'rgba(142, 142, 147, 0.06)',
    paddingLeft: theme.sizes.base / 1.333,
    paddingRight: theme.sizes.base * 1.5,
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
  upload: {
    position: 'absolute',
    bottom: 0,
    overflow: 'visible',
    opacity: 0.8,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: '10%',
    paddingBottom: theme.sizes.base * 4,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    minWidth: theme.sizes.minWidth,
  },
});
