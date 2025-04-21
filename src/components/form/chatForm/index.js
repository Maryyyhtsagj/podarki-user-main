import React from 'react';
import {dateFormatter} from '../../../utils/dateFormatter';
import {styles} from './styles';
import {Text, TouchableOpacity, View} from 'react-native';
import { globalStyles, MessagesName } from "../../../constants";

export const ChatForm = ({item, navigation, index}) => {
  const handleNavigation = () => {
    navigation.navigate(MessagesName, {
      item,
      state: item.priority === 'admin' ? true : false,
    });
  };

  const displayMessage = item.lastMessage
    ? item.lastMessage.indexOf('/images') !== -1
      ? 'Фото'
      : item.lastMessage
    : '';

  return (
    <TouchableOpacity style={styles.chatContainer} onPress={handleNavigation}>
      <Text
        style={[
          globalStyles.titleText,
          globalStyles.titleTextSmall,
          globalStyles.textAlignLeft,
          styles.name,
        ]}>
        {item.name}
      </Text>
      <Text
        style={[
          globalStyles.titleText,
          globalStyles.titleTextSmall,
          globalStyles.textAlignLeft,
          globalStyles.weightLight,
          {marginRight: 30},
        ]}
        numberOfLines={1}>
        {displayMessage}
      </Text>
      <View style={styles.timeContainer}>
        <Text
          style={[
            globalStyles.titleText,
            globalStyles.titleTextSmall4,
            globalStyles.weightLight,
            styles.date,
          ]}>
          {dateFormatter(item.date)}
        </Text>
      </View>
      {item.newMessCount ? (
        <View style={styles.notNumberCont}>
          <Text style={styles.notNumber}>{item.newMessCount}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};
