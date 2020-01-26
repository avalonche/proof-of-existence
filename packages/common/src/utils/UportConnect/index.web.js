import { Connect } from 'uport-connect';
import { Credentials } from 'uport-credentials';

import config from './config';

export const checkInstalled = () => {
    return null;
}

const UportConnect = new Connect(config.appName, { network: config.network });

UportConnect.credentials = new Credentials({
    did: config.did,
    privateKey: config.privateKey
});

export default UportConnect;