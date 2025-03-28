import React, {useEffect, useState} from 'react';
import deleteIcon from '../../../assets/images/backIcon.png';
import {styles} from './styles';
import {
  BaseUrl,
  globalStyles,
  imageUrl,
  SubCategoryName,
} from '../../../constants';
import {Image, Text, TouchableOpacity, View} from 'react-native';

import rightIcn from '../../../assets/images/rightIcon.png';

export function FormCategory({item, index, navigation, checkSubCategory}) {
  const [color] = useState(['#FFC24B', '#D67EFF', '#63FFFF']);
  return (
    <TouchableOpacity
      style={[styles.containerForm, {backgroundColor: color[index % 3]}]}
      onPress={() => {
        checkSubCategory(item);
        navigation.goBack();
      }}>
      <View>
        <Image
          source={{uri: imageUrl + '/' + item.photo_url}}
          style={styles.img}
        />
      </View>
      <View style={[globalStyles.row, styles.textContainer]}>
        <View>
          <Text style={[globalStyles.titleText, globalStyles.textAlignLeft]}>
            {item.title}
          </Text>
          <Text
            style={[
              globalStyles.titleText,
              globalStyles.weightLight,
              globalStyles.titleTextSmall4,
              globalStyles.textAlignLeft,
            ]}>
            {item.productCount} товаров
          </Text>
        </View>
        <View>
          <Image source={deleteIcon} style={styles.arrowRight} />
        </View>
      </View>
    </TouchableOpacity>
  );
}
