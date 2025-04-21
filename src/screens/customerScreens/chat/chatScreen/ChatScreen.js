import {useIsFocused} from '@react-navigation/native';
import React, {useState, useEffect, useCallback} from 'react';
import {useSelector} from 'react-redux';
import {styles} from './styles';
import {
  FlatList,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import {Colors, globalStyles, MessagesName} from '../../../../constants';
import {
  ChatData_,
  FinancialForm,
  globalHeight,
  Loading,
} from '../../../../components';
import {ChatForm} from '../../../../components/form/chatForm';
import axiosInstance from '../../../../networking/axiosInstance';
import {getStatusBarHeight} from 'react-native-status-bar-height';

const isToday = dateString => {
  const inputDate = new Date(dateString);
  const today = new Date();

  const inputDateString = inputDate.toISOString().split('T')[0];
  const todayDateString = today.toISOString().split('T')[0];

  return inputDateString === todayDateString;
};

export const ChatScreen = ({navigation}) => {
  const homeState = useSelector(state => state.homeState);

  const [active, setActive] = useState('Сегодня');
  const [generalData, setGeneralData] = useState([]);
  const [dataState, setDataState] = useState([]);
  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isFocused) {
      fetchChats();
    }
  }, [isFocused]);

  useEffect(() => {
    if (homeState.messagesCount) {
      fetchChats();
    }
  }, [homeState.messagesCount]);

  const fetchChats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/chat/im');
      setGeneralData(response.data);
      changeStateFunc(active, response.data);
    } catch (e) {
      console.error('Error fetching chats:', e);
    } finally {
      setLoading(false);
    }
  }, [active]);

  const changeStateFunc = (tab, dataFunc) => {
    setLoading(true);
    if (tab === 'Все') {
      setDataState([...dataFunc]);
    } else if (tab === 'Сегодня') {
      const filterArr = dataFunc.filter(it => isToday(it.date));
      setDataState([...filterArr]);
    }
    setActive(tab);
    setLoading(false);
  };

  const createAdminChat = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/chat/is-created?admin=true');
      if (response.data && response.data.chatID) {
        const adminChatData = {
          ...response.data,
          admin: true,
          name: 'Техническая поддержка',
          lastMessage: '',
          priority: 'user',
        };
        navigation.navigate(MessagesName, {
          item: adminChatData,
          state: false,
        });
      } else {
        Alert.alert(
          'Ошибка',
          'Не удалось создать чат с технической поддержкой',
        );
      }
    } catch (e) {
      console.error('Error creating admin chat:', e);
      Alert.alert('Ошибка', 'Не удалось создать чат с технической поддержкой');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        globalStyles.container,
        Platform.OS === 'ios' && {marginTop: -(getStatusBarHeight(true) + 5)},
      ]}>
      <StatusBar
        barStyle="dark-content"
        hidden={false}
        backgroundColor={Colors.blueBackground}
      />
      <View
        style={[
          styles.headerContainer,
          Platform.OS === 'ios' && {
            paddingTop: getStatusBarHeight(true) + globalHeight(50),
          },
        ]}>
        <Text
          style={[
            globalStyles.titleText,
            globalStyles.textAlignLeft,
            globalStyles.weightBold,
            globalStyles.titleTextBig,
          ]}>
          Сообщения
        </Text>
        <View style={[globalStyles.row, styles.headerFooter]}>
          <TouchableOpacity
            style={active === 'Сегодня' && styles.activeText}
            onPress={() => changeStateFunc('Сегодня', generalData)}>
            <Text
              style={[
                globalStyles.titleText,
                globalStyles.weightLight,
                globalStyles.titleTextSmall,
                styles.headerFooterText,
                active === 'Сегодня' && styles.activeTextContent,
              ]}>
              Сегодня
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={active === 'Все' && styles.activeText}
            onPress={() => changeStateFunc('Все', generalData)}>
            <Text
              style={[
                globalStyles.titleText,
                globalStyles.weightLight,
                globalStyles.titleTextSmall,
                styles.headerFooterText,
                active === 'Все' && styles.activeTextContent,
              ]}>
              Все
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={createAdminChat}>
            <Text
              style={[
                globalStyles.titleText,
                globalStyles.weightLight,
                globalStyles.titleTextSmall,
                styles.headerFooterText,
              ]}>
              Тех.поддержка
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={dataState}
        renderItem={({item, index}) => {
          return <ChatForm item={item} key={index} navigation={navigation} />;
        }}
      />
      {loading && <Loading loading={loading} />}
    </View>
  );
};
