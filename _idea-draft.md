
- ens
- persist store/state
https://blog.usejournal.com/build-a-decentralized-react-native-application-9897b5d88641

https://medium.com/the-ethereum-name-service/how-to-host-your-dapp-with-ipfs-ens-and-access-it-via-ethdns-c96046059d87

https://www.reddit.com/r/ipfs/comments/6ba9ck/how_to_deploywrite_reactredux_apps_on_ipfs/
https://www.npmjs.com/package/ipfs-webpack-plugin

vyper:
virtualenv -p python3.6 --no-site-packages ~/vyper-venv
source ~/vyper-venv/bin/activate

source ~/vyper-venv/bin/activate

- mobile ui (blob)
- error handling (submit tags, edit, upload)
- gas used for upload
- serve ui from ipfs
- persistence, cache
- docs

User Stories:
A user logs into the web app. The user can upload some data (pictures/video) to the app, as well as add a list of tags indicating the contents of the data.
The app reads the user’s address and shows all of the data that they have previously uploaded.
Users can retrieve necessary reference data about their uploaded items to allow other people to verify the data authenticity.
Here are some suggestions for additional components that your project could include: ● Make your app mobile friendly, so that people can interact with it using a
web3 enabled mobile browser such as​ ​Metamask mobile​ or ​Coinbase Wallet​. ○ Allow people to take photos with their mobile device and upload them
from there
● Deploy your dApp to a testnet
○ Include the deployed contract address so people can interact with it
○ Serve the UI from IPFS or a traditional web server

idea for smart contract:
use fixed string array(or byte array) to store the tags, mapped to a bool(or something else) and a getter function to get the size of the tag mapping including deleted tags