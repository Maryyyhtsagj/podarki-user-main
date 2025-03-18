import {useIsFocused} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {styles} from './styles';
import {
  FlatList,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors, globalStyles} from '../../../../constants';
import {ChatData_, FinancialForm, globalHeight} from '../../../../components';
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
  const [data, setData] = useState([]);
  const [dataState, setDataState] = useState([]);
  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isFocused) {
      axiosFunc();
    }
  }, [isFocused]);

  useEffect(() => {
    if (!!homeState.messagesCount) {
      axiosFunc();
    }
  }, [homeState.messagesCount]);

  const axiosFunc = async () => {
    try {
      const response = await axiosInstance.get('/chat/im');
      //  console.log("CHATS", response.data);
      const filterArr = response.data.filter(it => it.priority === 'admin');
      setData(response.data);
      changeStateFunc(active, response.data);
      setLoading(false);
    } catch (e) {
      // console.log(e);
      setLoading(false);
    }
  };
  const changeStateFunc = (st, dataFunc) => {
    setLoading(true);
    const arr = data;

    if (st === 'Тех.поддержка') {
      const filterArr = dataFunc.filter(it => it.priority === 'admin');
      setDataState([...filterArr]);
      setLoading(false);
    } else if (st === 'Все') {
      setDataState([...dataFunc]);
      setLoading(false);
    } else if (st === 'Сегодня') {
      const filterArr = dataFunc.filter(it => {
        return isToday(it.date);
      });

      setLoading(false);
      setDataState([...filterArr]);
    }
    setActive(st);
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
            onPress={() => changeStateFunc('Сегодня', data)}>
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
            onPress={() => changeStateFunc('Все', data)}>
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
          <TouchableOpacity
            style={active === 'Тех.поддержка' && styles.activeText}
            onPress={() => changeStateFunc('Тех.поддержка', data)}>
            <Text
              style={[
                globalStyles.titleText,
                globalStyles.weightLight,
                globalStyles.titleTextSmall,
                styles.headerFooterText,
                active === 'Тех.поддержка' && styles.activeTextContent,
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
    </View>
  );
};
