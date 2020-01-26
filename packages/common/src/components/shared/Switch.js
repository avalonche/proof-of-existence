import React from 'react';
import { Switch, Platform } from 'react-native';

import { theme } from '../../assets/constants';

const GRAY_COLOR = 'rgba(168, 182, 200, 0.30)';

export default class SwitchInput extends React.PureComponent {
  render() {
    const { value, activeTrackColor, ...props } = this.props;
    let thumbColor = null;
    let falseColor = null;
    

    if (Platform.OS === 'android') {
      thumbColor = GRAY_COLOR;
    }

    if (Platform.OS === 'web') {
      thumbColor = theme.colors.white;
      falseColor = GRAY_COLOR;
    }


    return (
      <Switch
        thumbColor={thumbColor}
        ios_backgroundColor={GRAY_COLOR}
        trackColor={{
          false: falseColor,
          true: activeTrackColor ? activeTrackColor : theme.colors.secondary
        }}
        value={value}
        {...props}
      />
    );
  }
}
