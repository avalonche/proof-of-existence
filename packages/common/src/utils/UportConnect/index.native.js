import configureUportConnect, { isUportAppInstalled } from 'react-native-uport-connect';
import { Alert, AsyncStorage } from 'react-native';

import config from './config';

const UportConnect = configureUportConnect({
    appName: config.appName,
    appUrlScheme: config.appUrlScheme,
    network: config.network,
    did: config.did,
    privateKey: config.privateKey,
    vc: config.vc,
});

export default UportConnect;

export const checkInstalled = () => {
    isUportAppInstalled().then(isInstalled => {
    if (!isInstalled) {
      Alert.alert('uPort app not installed');
    }

    AsyncStorage.getItem('uportState').then(json => {
      const uportState = JSON.parse(json);
      UportConnect.setState(uportState);
    })
  });
}