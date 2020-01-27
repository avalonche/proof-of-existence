import React from 'react';
import ImagePicker from 'react-native-image-picker';

import { Block, Text } from '../../components/shared';

const options = {
  title: 'Select Upload',
  mediaType: 'mixed',
  storageOptions: {
    skipBackup: true,
  },
};

export function selectContent() {
    return (
        ImagePicker.showImagePicker(options, response => {
            if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else {
              const source = { uri: response.uri }
              console.log(response);
            }
        })
    )
}

export function ContentPreview() {
  return (
    <Block>
      <Text>hi</Text>
    </Block>
  )
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

/**class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.image = createRef();
  }

  _handleDownloadButton = () => {
    const imageRef = this.image.current;
    if (imageRef) {
      const url = imageRef.props.source;
    }
  }

  render() {
    return (
      <View>
        <Image ref={this.image} style={{ width: 100, height: 100 }} source={{ uri: 'https://static.standard.co.uk/s3fs-public/thumbnails/image/2016/05/22/11/davidbeckham.jpg?w968' }} />
      </View>
    );
  }
}

export default Gallery; */