import React, { Component } from 'react'
import { StyleSheet, ActivityIndicator } from 'react-native'

import { Block, Text } from '../shared';
import { theme } from '../../assets/constants';

export default class Spinner extends Component {
  render() {
    const { 
        children,
        style,
        size,
        accent,
        primary,
        secondary,
        tertiary,
        black,
        white,
        gray,
        gray2,
        center,
        middle,
        flex,
        text,
        ...props } = this.props;

    const spinnerStyles = [
        styles.spinner,
        center && styles.center,
        middle && styles.middle,
        flex && { flex },
        // color shortcuts
        primary && styles.primary,
        secondary && styles.secondary,
        black && styles.black,
        gray && styles.gray,
        gray2 && styles.gray2,
        style,
      ];
    
    if (text) {
      return (
        <Block style={spinnerStyles}>

          <ActivityIndicator
          style={spinnerStyles}
          
          {...props}/>

          <Text
          style={spinnerStyles}
          {...props}>
            {text}
          </Text>

        </Block>
      );
    }

    return (
        <Block style={spinnerStyles}>

          <ActivityIndicator
          style={spinnerStyles}
          {...props}/>

        </Block>
    );
  }
}

const styles = StyleSheet.create({
    spinner: {
      borderRadius: theme.sizes.border,
      margin: theme.sizes.base,
    },

    center: {
        alignItems: 'center',
    },

    middle: {
        justifyContent: 'center',
    },

    primary: { color: theme.colors.primary, },
    secondary: { color: theme.colors.secondary, },
    black: { color: theme.colors.black, },
    gray: { color: theme.colors.gray, },
    gray2: { color: theme.colors.gray2, },

})
  