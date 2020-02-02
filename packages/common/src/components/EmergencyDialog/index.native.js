import { useEffect } from 'react';
import { Alert } from 'react-native';

const EmergencyDialog = (props) => {
  const { showEmergencyDialog, setShowEmergencyDialog } = props;

  function handleSetEmergency() {
    const { pause, setLoading } = props;
    pause.send();
    setLoading(true);
  }

  useEffect(() => {
    showEmergencyDialog ? (
      Alert.alert(
        `Setting emergency means that users will no longer be able to upload or edit their content.
        They can only view and verify the IPFS hashes of other content uploaded.`,
        `Are you sure you want to continue?`,
        [
          { text: 'Continue', onPress: () => handleSetEmergency() },
          {
            text: 'Cancel',
            onPress: () => setShowEmergencyDialog(false),
            style: 'cancel',
          },
        ],
        { cancelable: false },
      )
    ) : (
      null
    )
  }, [showEmergencyDialog]);

  return (null);
}

export default EmergencyDialog;