import React, { useState } from 'react';
import { Image, StyleSheet, Dimensions } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Video from 'react-native-video';
import { Alert } from 'react-native';

import { FontAwesome } from '../../utils/FontAwesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import { Block, Button } from '../../components/shared';
import { theme } from '../../assets/constants';

const options = {
  title: 'Select',
  takePhotoButtonTitle: 'Take Photo or Video...',
  mediaType: 'mixed',
  noData: true,
  storageOptions: {
    skipBackup: true,
  },
};

const { width, height } = Dimensions.get("window");

export function selectContent(setPreview, setfileType, setVisible) {
  return (
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User Canceled')
      } else if (response.error) {
        if (response.error.indexOf('permission') >= 0) {
          console.log(response.error);
          Alert.alert(
            'Access Denied',
            'Please go to settings to enable permissions for camera and photo gallery'
          );
        } else {
          Alert.alert(response.error);
        }
      } else {
        if (response.type) {
           setfileType(response.type);
        } else {
          setfileType('video/');
        }
        setPreview(response.uri);
        setVisible(true);
      }
    })
  )
}

export function ContentPreview(props) {
  const { preview, fileType } = props;
  const [ paused, setPaused ] = useState(true);

  if (preview && fileType.startsWith('image/')) {
    return (
      <Block style={styles.previewContainer}>
        <Image source={{ uri: preview }} style={styles.preview} resizeMode={'contain'}/>
      </Block>
    )
  }

  if (preview && fileType.startsWith('video/')) {
    return (
      <Block middle style={styles.previewContainer}>
        <Video source={{ uri: preview }} paused={paused} style={styles.preview} resizeMode={'contain'}/>
        <Button style={styles.button} onPress={() => setPaused(!paused)}>
          <FontAwesome
            icon={faPlayCircle}
            color={theme.colors.white}
            size={40}
            style={{ opacity: paused ? 0.8 : 0 }}
          />
        </Button>
      </Block>
    )
  }
  return null;
}

export function Uploader({icon}) {
    return (
      <Block middle>
        {icon}
      </Block>  
    );
}

export function clearPreview() {
  return;
}

const styles = StyleSheet.create({
  previewContainer: {
    height: height / 3,
    width: width,
    marginVertical: theme.sizes.base,
    borderRadius: theme.sizes.radius,
  },
  preview: {
    height: '100%',
    width: '100%',
  },
  button: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: 'transparent',
  }
})