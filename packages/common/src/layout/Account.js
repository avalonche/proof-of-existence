import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { drizzleReactHooks } from '@drizzle/react-plugin';

import { getCurrentProvider } from '../utils/connector';
import { txHandler } from '../utils/errorHandler';

import { FontAwesome } from '../utils/FontAwesome';
import { faWallet, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';

import EmergencyDialog from '../components/EmergencyDialog';
import { Modal } from '../utils/Modal';
import { alert } from '../utils/Alert';
import { Divider, Button, Block, Text, Switch, Spinner, Copy } from '../components/shared';
import { theme } from '../assets/constants';

export default function Account() {
    const drizzleState = drizzleReactHooks.useDrizzleState(drizzleState => ({
      account: drizzleState.accounts[0],
      accountBalances: drizzleState.accountBalances
    }))
    const { useCacheSend, useCacheCall } = drizzleReactHooks.useDrizzle()
    
    const isEmergency = useCacheCall('DocumentInfo', 'paused');
    const isOwner = useCacheCall('DocumentInfo', 'isPauser', drizzleState.account)
    const pause = useCacheSend('DocumentInfo', 'pause');
    const unpause = useCacheSend('DocumentInfo', 'unpause');

    const web3 = getCurrentProvider();

    const [ paused, setPaused ] = useState(false);
    const [ showEmergencyDialog, setShowEmergencyDialog ] = useState(false);
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
      if (typeof isEmergency !== 'undefined') {
        setPaused(isEmergency);
      }
    }, [isEmergency]);

    const pauseTx = pause.TXObjects;
    const unpauseTx = unpause.TXObjects;

    // get latest transaction
    const pauseStatus = pauseTx && pauseTx[pauseTx.length -1] && pauseTx[pauseTx.length -1].status;
    const unpauseStatus = unpauseTx && unpauseTx[unpauseTx.length -1] && unpauseTx[unpauseTx.length -1].status;

    // confirmation of successful pause / unpause 
    useEffect(() => {
      const { errors } = txHandler('pause', pauseTx);
      // alert
      errors.pause ? alert({content: 'Error setting contract in emergency'}) : setPaused(true);
      setLoading(false);
    }, [pauseStatus]);

    useEffect(() => {
      const { errors } = txHandler('unpause', unpauseTx);
      // alert
      errors.unpause ? alert({content: 'Error unsetting contract in emergency'}) : setPaused(false);
      setLoading(false);
    }, [unpauseStatus]);

    function toggleEmergency(value) {
      // alert user: sure to continue?
      if (value) {
        setShowEmergencyDialog(true)
      } else {
        unpause.send();
        setLoading(true);
      }
    }

    function renderToggle() {
      return (
        <Block center middle row space="between" style={styles.toggle}>
          <Block row center>
            <Text h3 light accent>Emergency Button</Text>
            <FontAwesome
              icon={faExclamationCircle}
              color={theme.colors.accent}
              style={{margin: theme.sizes.padding / 2}} 
            />
            { loading ? <Spinner flex={-1} style={{ margin: 0 }} color='gray'/> : null}
          </Block>
          <Switch
          value={paused}
          onValueChange={value => toggleEmergency(value)}
          activeTrackColor={theme.colors.accent2}
          activeThumbColor={theme.colors.accent}
          />
        </Block>
      );
    }

    function renderAccount() {
      const address = drizzleState.account;
      const balance = web3.utils.fromWei(drizzleState.accountBalances[address], 'finney');
      return (
        <Block center style={styles.account}>

          <Block row center style={styles.body}>
            <Block row flex={-1} style={{flexShrink: 0}}>
              <Block center middle style={styles.icon}>
                <FontAwesome
                  icon={faEthereum}
                  color={theme.colors.black}
                />
              </Block>
              <Text black style={{marginRight: theme.sizes.padding}}>Address</Text>
            </Block>
            
            <Block row middle>
              <Text light gray numberOfLines={1}>{address}</Text>
            </Block>

            <Copy content={address}/>
          </Block>

          <Divider flex={false} style={{width: '100%'}}/>

          <Block row center style={styles.body}>
            <Block row flex={-1} style={{flexShrink: 0}}>
              <Block center middle style={styles.icon}>
                <FontAwesome
                  icon={faWallet}
                  color={theme.colors.black}
                  size='1x'
                />
              </Block>
              <Text black style={{marginRight: theme.sizes.padding}}>Balance</Text>
            </Block>

            <Block center>
              <Text light center gray>{(Math.round(balance * 100) / 100).toFixed(2)} Finney</Text>
            </Block>

          </Block>

          <Divider flex={false} style={{width: '100%'}}/>
        </Block>
      )
    }

    return (
      typeof isEmergency === 'undefined' || typeof isOwner === 'undefined' ? (
        <Spinner middle center color={'gray'} text={'Loading account info from contracts...'}/>
      ) : (
        <Block>
          <EmergencyDialog
            showEmergencyDialog={showEmergencyDialog}
            setShowEmergencyDialog={setShowEmergencyDialog}
            pause={pause}
            setLoading={setLoading}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            <Block center>
              {renderAccount()}
              {isOwner ? renderToggle() : null}
              <Block style={styles.logout}>
                <Button shadow>
                  <Text center h2 light>Log Out</Text>
                </Button>
              </Block>
            </Block>
          </ScrollView>
        </Block>
      )
    );
}

const styles = StyleSheet.create({
  header: {
    padding: theme.sizes.base * 2,
  },
  body: {
    margin: theme.sizes.padding / 2,
    width: '100%',
  },
  account: {
    width: '100%',
    maxWidth: theme.sizes.maxWidth,
    minWidth: theme.sizes.minWdith,
    margin: theme.sizes.base * 2,
  },
  toggle: {
    margin: theme.sizes.base,
    width: '100%',
    maxWidth: theme.sizes.maxWidth,
    minWidth: theme.sizes.minWdith,
  },
  icon: {
    width: theme.sizes.base,
    height: theme.sizes.base,
    marginRight: theme.sizes.padding / 4,
    marginLeft: theme.sizes.padding / 4,
  },
  logout: {
    marginVertical: theme.sizes.base * 2,
    paddingHorizontal: theme.sizes.padding,
    width: '100%',
    height: '100%',
    maxWidth: theme.sizes.maxWidth,
    minWidth: theme.sizes.minWdith,
  }
})