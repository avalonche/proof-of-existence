import { Linking, Alert } from 'react-native'

import { Connect } from 'uport-connect'
import { Credentials } from 'uport-credentials'
import { transport } from 'uport-transports'

import config from './config';

const configureUportConnect = (config) => {

  const callbackUrl = `${config.appUrlScheme}://uport/callback`
  
  const onloadResponse = () => {
    return transport.url.parseResponse('')
  }

  const uportConnect = new Connect(config.appName, {
    isMobile: true,
    onloadResponse,
    useStore: false,
    network: config.network,
    vc: config.vc,
  })
  
  if (config.did && config.privateKey) {
    uportConnect.credentials = new Credentials({
      did: config.did,
      privateKey: config.privateKey
    })
  }

  uportConnect.genCallback = (id) => {
    return `${callbackUrl}%23id=${id}`
  }

  uportConnect.mobileTransport = (message, {id}) => {
    const url = message.indexOf(config.appUrlScheme) !== -1 ? 
      message.replace('https://id.uport.me', 'me.uport:') : `me.uport:/req/${message}?callback_type=redirect&redirect_url=${callbackUrl}%23id=${id}`
    Linking.openURL(url)
  }

  Linking.addEventListener('url', (uri) => {
    uportConnect.pubResponse(
      transport.url.parseResponse(uri.url)
    )
  })

  return uportConnect
}

export const checkInstalled = () => {
  if (!Linking.canOpenURL('me.uport:')) {
    Alert.alert('uPort app not installed');
  }
}

const UportConnect = configureUportConnect({
    appName: config.appName,
    appUrlScheme: config.appUrlScheme,
    network: config.network,
    did: config.did,
    privateKey: config.privateKey,
    vc: config.vc,
});

export default UportConnect;