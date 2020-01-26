import React, { useState } from 'react';

import { StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '../../utils/FontAwesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';

import { Block, Button } from '../../components/shared';
import { theme } from '../../assets/constants';

const videoRef = React.createRef();
window.URL = window.URL || window.webkitURL;

export function Uploader(props) {
    const { icon, setPreview, setFileType, setVisible } = props;

    const onChange = e => {
        const files = e.target.files;

        if (files && files[0]) {
            setVisible(true);
            setFileType(files[0].type);
            setPreview(window.URL.createObjectURL(files[0]));
        }
    }

    return (
        <div>
            <input
            id='upload'
            type="file"
            style={{display: 'none'}}
            accept="video/*, image/*"
            onChange={onChange}
            />
            <label htmlFor='upload'>
                {icon}
            </label>
        </div>
    );
}

export function selectContent() {
    return (
        null
    )
}

export function ContentPreview(props) {
    const { preview, fileType } = props;
    const [playing, setPlaying] = useState(false);

    const previewStyle = {
        maxWidth: '100%',
        maxHeight: '100%',
        borderRadius: theme.sizes.radius,
    }

    const playPause = () => {
        if (playing) {
            setPlaying(false);
            videoRef.current.pause();
        }
        else {
            setPlaying(true);
            videoRef.current.play();
        }
    }

    const cleanReference = () => {
        window.URL.revokeObjectURL(preview);
    }

    if (preview && fileType.startsWith('image/')) {
        return (
            <Block card shadow style={props.style}>
                <img src={preview} style={previewStyle} onLoad={() => cleanReference()}/>
            </Block>
        );
    }

    if (preview && fileType.startsWith('video/')) {
        return (
            <Block card shadow middle style={props.style}>
                <video src={preview} ref={videoRef} style={previewStyle} onLoad={() => cleanReference()}>
                    No Video Preview Available
                </video>
                <Button style={styles.button} onPress={playPause}>
                    <FontAwesomeIcon
                        icon={faPlayCircle}
                        color={theme.colors.gray2}
                        size='5x'
                        style={{opacity: playing ? 0 : 1}}
                    />
                </Button>
            </Block>
        );
    }
    // alert invalid file
    return null;
}

export function getFileBuffer() {
    const upload = document.getElementById('upload');
    if (upload.files && upload.files[0]) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(upload.files[0]);
            
            reader.onloadend = async () => {
                resolve(await Buffer.from(reader.result));
            }
            reader.onerror = () => {
                reject();
            }
        })
    }
}

export function clearPreview() {
    const files = document.getElementById('upload');
    // clear the input data so the onChange event can fire if the user chooses the same file
    files.value = '';
}

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: 'transparent',
    }
});