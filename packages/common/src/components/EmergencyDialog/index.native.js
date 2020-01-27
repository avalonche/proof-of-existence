import React, { useEffect } from 'react';
import { Alert } from 'react-native';

const EmergencyDialog = (props) => {
  const { showEmergencyDialog } = props;

  function handleSetEmergency() {
    const { pause, setLoading } = props;
    pause.send();
    setLoading(true);
  }

  return (
    useEffect(() => {
      showEmergencyDIalog ? (
        Alert.alert(
          'Set Emergency',
          `Setting the contract in emergency means that users will no longer be able to upload or edit their content.
                They can only view and verify the IPFS hashes of other content uploaded. Are you sure you want to continue?`,
          [
            { text: 'Continue', onPress: () => console.log('Ask me later pressed') },
            {
              text: 'Cancel',
              onPress: () => handleSetEmergency(),
              style: 'cancel',
            },
          ],
          { cancelable: false },
        )
      ) : (
        null
      )
    }, [open]);
  )
}