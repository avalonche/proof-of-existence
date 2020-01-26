import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import { theme } from '../../assets/constants';

class Button extends Component {
  render() {
    const {
      style,
      opacity,
      color,
      startColor,
      endColor,
      end,
      start,
      locations,
      shadow,
      children,
      backgroundImage,
      flex,
      ...props
    } = this.props;

    const buttonStyles = [
      styles.button,
      shadow && styles.shadow,
      color && styles[color], // predefined styles colors for backgroundColor
      color && !styles[color] && { backgroundColor: color }, // custom backgroundColor
      flex && { flex },
      flex === false && { flex: 0 }, // reset / disable flex
      style,
    ];

    if (backgroundImage) {
      return (
        <TouchableOpacity
          style={buttonStyles}
          activeOpacity={opacity}
          {...props}
        >
          <Image 
          style={styles.image}
          source={backgroundImage}
          {...props}
          />
          {children}
        </TouchableOpacity>
      )
    }
    
    return (
      <TouchableOpacity
        style={buttonStyles}
        activeOpacity={opacity || 0.8}
        {...props}
      >
        {children}
      </TouchableOpacity>
    )
  }
}

Button.defaultProps = {
  startColor: theme.colors.primary,
  endColor: theme.colors.secondary,
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
  locations: [0.1, 0.9],
  opacity: 0.8,
  color: theme.colors.white,
}

export default Button;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    borderRadius: theme.sizes.radius,
  },

  button: {
    borderRadius: theme.sizes.radius,
    height: theme.sizes.base * 3,
    justifyContent: 'center',
  },
  shadow: {
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  accent: { backgroundColor: theme.colors.accent, },
  primary: { backgroundColor: theme.colors.primary, },
  secondary: { backgroundColor: theme.colors.secondary, },
  tertiary: { backgroundColor: theme.colors.tertiary, },
  black: { backgroundColor: theme.colors.black, },
  white: { backgroundColor: theme.colors.white, },
  gray: { backgroundColor: theme.colors.gray, },
  gray2: { backgroundColor: theme.colors.gray2, },
  gray3: { backgroundColor: theme.colors.gray3, },
  gray4: { backgroundColor: theme.colors.gray4, },
});