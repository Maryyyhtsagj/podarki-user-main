import React from 'react';
import {Image, TextInput, TouchableOpacity, View} from 'react-native';
import place from '../../../assets/images/wing.png';
import search from '../../../assets/images/search.png';
import close from '../../../assets/images/closeIcon.png';
import {Colors} from '../../../constants';
import {styles} from './SearchInput.styles';

export const SearchInput = ({
  containerStyle,
  onClear,
  value,
  placeholder,
  placeholderTextColor,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <Image source={place} style={[styles.icon, styles.locationIcon]} />
      <TextInput
        placeholderTextColor={placeholderTextColor || Colors.gray}
        style={styles.input}
        placeholder={placeholder || 'Поиск'}
        value={value}
        {...props}
      />
      {value?.length > 0 && (
        <TouchableOpacity onPress={onClear} style={styles.clearButton}>
          <Image source={close} style={[styles.icon, styles.clearIcon]} />
        </TouchableOpacity>
      )}
      <TouchableOpacity activeOpacity={1} style={styles.searchButton}>
        <Image source={search} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};
