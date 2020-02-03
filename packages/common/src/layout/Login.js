import React, { Component } from 'react'
import { Dimensions, Image, FlatList, View, StyleSheet, Platform } from 'react-native';
import { connect } from 'react-redux';
import { setProvider } from '../redux/user/userActions';

import { Drizzle } from '@drizzle/store';
import { drizzleReactHooks } from '@drizzle/react-plugin';
import store from '../redux/store';
import { configureOptions, getWeb3 } from '../utils/connector';
import DrizzleLoader from '../components/DrizzleLoader';

import { Button, Block, Text } from '../components/shared';
import { theme } from '../assets/constants';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: props.local,
      drizzle: null,
      window: Dimensions.get('window')
    }

    this.handleLogin = this.handleLogin.bind(this);
  }
  
  handleDims = dims => this.setState({dims: dims})

  componentDidMount() {
    if (this.props.local) {
      this.handleLogin('local');
    }

    Dimensions.addEventListener('change', this.handleDims);
  }

  componentWillUnmount() {
    // Important to stop updating state after unmount
    Dimensions.removeEventListener("change", this.handleDims);
  }

  handleLogin(provider) {
    const { setProvider } = this.props;
    
    setProvider(provider);
    const web3 = getWeb3(provider);
    if (web3) {
      const drizzleOptions = configureOptions(provider);
      this.setState({drizzle: new Drizzle(drizzleOptions, store)});
    }
  }

  renderUportButton() {
    const { logos, backgrounds } = this.props;
    return (
      <Button backgroundImage={backgrounds.uport} onPress={() => this.handleLogin('uport')} >
        <Block row style={styles.buttonContainer}>
          <Text center semibold white >Connect with </Text>
          <Image source={logos.uport} style={styles.icons}/>
        </Block>
      </Button>
    );
  }

  renderMetaMaskButton() {
    const { logos } = this.props;
    return (
      <Button shadow onPress={() => this.handleLogin('browser')}>
        <Block row style={styles.buttonContainer}>
          <Text center semibold>Connect with </Text>
          <Image source={logos.metamask} style={styles.icons}/>
        </Block>
      </Button>
    );
  }

  renderIllustrations() {
    const { illustrations } = this.props;

    return (
      <FlatList
        horizontal
        data={illustrations}
        keyExtractor={(item) => `${item.id}`}
        renderItem={({ item }) => (
          <Image
            source={item.source}
            resizeMode="contain"
            style={{
              width: this.state.window.width - theme.sizes.padding * 2,
              height: this.state.window.height / 2,
              overflow: 'visible',
            }}
          />
        )}
      />
    )
  }
  
  render() {
    const { drizzle, loggedIn } = this.state;
    const { web3Status, drizzleStatus } = this.props;

    return (
      // Logged in if accounts are fetched
      (loggedIn && drizzle) || (web3Status === 'initialized' && drizzleStatus.initialized) ? (
        <drizzleReactHooks.DrizzleProvider drizzle={drizzle}>
          <DrizzleLoader/>
        </drizzleReactHooks.DrizzleProvider>
      ) : (
        <View style={styles.main}>

          <Block middle  style={Platform.OS === 'web' ? styles.mainContainer : null}>
            <Block center bottom flex={0.4}>
              <Text h1 center bold>
                Your Content.
                <Text h1 primary> Hashed.</Text>
              </Text>
              <Text h3 gray2 style={{ marginTop: theme.sizes.padding / 2 }}>
                Prove it existed and store it on IPFS.
              </Text>
            </Block>

            <Block center middle>
              {this.renderIllustrations()}
            </Block>

            <Block middle flex={0.5}>
              <Block padding={[theme.sizes.padding]}>
                {this.renderUportButton()}
              </Block>
              <Block padding={[0, theme.sizes.padding, theme.sizes.padding]}>
                {this.renderMetaMaskButton()}  
              </Block>
            </Block>
          </Block>

        </View>
      )
    )
  }
}

Login.defaultProps = {
  illustrations: [
    { id: 1, source: require('../assets/images/icon.png') }
  ],
  
  logos: {
    uport: require('../assets/icons/uport-white.png'),
    metamask: require('../assets/icons/metamask.png'),
  },
  
  backgrounds: {
    uport: require('../assets/images/background-purple-gradient-pattern.png'),
  },
};

const styles = StyleSheet.create({
  main: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  mainMobile: {
    backgroundColor: theme.colors.white
  },
  mainContainer: {
    backgroundColor: theme.colors.white,
    maxWidth: theme.sizes.maxWidth,
    minWidth: theme.sizes.minWdith,
    margin: theme.sizes.padding,
    borderColor: theme.colors.border,
    borderWidth: StyleSheet.hairlineWidth,
  },
  buttonContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: theme.sizes.padding / 3,
  },

  topBox: {
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },

  icons: {
    height: 40,
    width: 40,
    marginHorizontal: theme.sizes.padding / 3
  },

});

const mapDispatchToProps = (dispatch) => {
  return {
    setProvider: (provider) => {
      dispatch(setProvider(provider));
    }
  }
}

const mapStateToProps = (state) => {
  return { 
    web3Status: state.web3.status,
    drizzleStatus: state.drizzleStatus,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
