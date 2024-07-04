import React from 'react';
import { CheckBox } from 'react-native-elements';

const MyCheckBox = ({ title = "Default Title", checked = false, onPress = () => {} }) => {
  return (
    <CheckBox
      title={title}
      checked={checked}
      onPress={onPress}
    />
  );
};

export default MyCheckBox;
