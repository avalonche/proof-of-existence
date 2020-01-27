import React from 'react';
import { Modal } from '../../utils/Modal';

import { Block, Text, Button } from '../shared';

const EmergencyDialog = (props) => {
    const { showEmergencyDialog, setShowEmergencyDialog, pause, setLoading } = props;

    function setEmergency() {
        setShowEmergencyDialog(false);
        pause.send();
        setLoading(true);
    }

    const style = {
        content: {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%)`,
        }
    }
    return (
        <Modal visible={showEmergencyDialog} style={style}>
            <Block space='between' style={{height: '100%'}}>
                <Text h2 accent bold center>Setting Emergency</Text>
                <Text h4 light>
                    Setting the contract into emergency means that users will be unable
                    to upload or edit their content. They will still be able to view and
                    verify the IPFS hashes of other users. Do you still want to continue?
                </Text>

                <Block flex={-1} row space='between'>

                    <Button onPress={() => setShowEmergencyDialog(false)}>
                        <Text small gray>
                            Cancel
                        </Text>
                    </Button>

                    <Button onPress={() => setEmergency()}>
                        <Text small gray>
                            Continue
                        </Text>
                    </Button>

                </Block>
            </Block>
        </Modal>
    );
}

export default EmergencyDialog;