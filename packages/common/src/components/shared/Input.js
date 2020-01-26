import React, { Component } from 'react'
import { StyleSheet, TextInput } from 'react-native'

import Text from './Text';
import Block from './Block';
import Button from './Button';
import { theme } from '../../assets/constants';

export default class Input extends Component {
  state = {
    toggleSecure: false,
  }

  renderLabel() {
    const {label, required, error, limit, currValue, showLimit } = this.props;
  
    return (
      <Block row space="between">
        <Block row flex={false}>
          {label ? <Text gray2={!error} accent={error}>{label}</Text> : null}
          {required ? <Text caption accent> * </Text> : null}
        </Block>
        <Block row center middle flex={false}>
          {showLimit ? <Text caption gray2>{currValue}/{limit}</Text> : null}
        </Block>
      </Block>
    )
  }

  renderRight() {
    const { rightLabel, rightStyle, onRightPress } = this.props;

    if (!rightLabel) return null;

    return (
      <Button
        style={[styles.right, rightStyle]}
        onPress={() => onRightPress && onRightPress()}
      >
        {rightLabel}
      </Button>
    );
  }

  renderLeft() {
    const { leftLabel, leftStyle } = this.props;

    if (!leftLabel) return null;

    return (
      <Block
        style={[styles.left, leftStyle]}
      >
        {leftLabel}
      </Block>
    )
  }

  renderError() {
    const { errorText } = this.props;

    if (!errorText) return null;
    
    return (
      <Text style={{paddingTop: theme.sizes.base / 3}} caption light accent>{errorText}</Text>
    )
  }

  render() {
    const {
      email,
      phone,
      number,
      secure,
      error,
      errorText,
      style,
      ...props
    } = this.props;

    const { toggleSecure } = this.state;
    const isSecure = toggleSecure ? false : secure;

    const inputStyles = [
      styles.input,
      error && { borderColor: theme.colors.accent },
      style,
    ];

    const inputType = email
      ? 'email-address' : number
      ? 'numeric' : phone
      ? 'phone-pad' : 'default';

    return (
      <Block>
        <Block>
          {this.renderLabel()}
          {this.renderLeft()}
          <TextInput
            style={inputStyles}
            secureTextEntry={isSecure}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType={inputType}
            {...props}
          />
          {this.renderRight()}
        </Block>
        {this.renderError()}
      </Block>
    )
  }
}

const styles = StyleSheet.create({
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.black,
    borderRadius: theme.sizes.radius,
    fontSize: theme.sizes.font,
    fontWeight: '500',
    color: theme.colors.black,
    height: theme.sizes.base * 3,
  },
  right: {
    position: 'absolute',
    alignItems: 'flex-end',
    width: theme.sizes.base * 2,
    height: theme.sizes.base * 2,
    top: theme.sizes.base,
    right: 0,
  },
  left: {
    position: 'absolute',
    alignItems: 'flex-start',
    width: theme.sizes.base * 2,
    height: theme.sizes.base * 2,
    bottom: 0,   
  },
});