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
  const [generalData, setGeneralData] = useState([]); // Store general chat data
  const [adminData, setAdminData] = useState([]); // Store admin chat data
  const [dataState, setDataState] = useState([]); // Filtered data for the active tab
  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isFocused) {
      axiosFunc(); // Fetch general chat data
      axiosAdminFunc(); // Fetch admin chat data
    }
  }, [axiosFunc, axiosAdminFunc, isFocused]);

  useEffect(() => {
    if (homeState.messagesCount) {
      axiosFunc();
      axiosAdminFunc();
    }
  }, [homeState.messagesCount]);

  const axiosFunc = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/chat/im');
      setGeneralData(response.data);
      if (active === 'Сегодня' || active === 'Все') {
        changeStateFunc(active, response.data);
      }
    } catch (e) {
      console.error('Error fetching general chat data:', e);
    } finally {
      setLoading(false);
    }
  }, [active]);

  const axiosAdminFunc = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/chat/im/admin');
      const filterArr = response.data.filter(it => it.priority === 'admin');
      setAdminData(filterArr);
      if (active === 'Тех.поддержка') {
        changeStateFunc('Тех.поддержка', filterArr);
      }
    } catch (e) {
      console.error('Error fetching admin chat data:', e);
    } finally {
      setLoading(false);
    }
  }, [active]);

  const changeStateFunc = (tab, dataFunc) => {
    setLoading(true);

    if (tab === 'Тех.поддержка') {
      setDataState([...adminData]); // Use admin data for support
    } else if (tab === 'Все') {
      setDataState([...generalData]); // Use all general chat data
    } else if (tab === 'Сегодня') {
      const filterArr = dataFunc.filter(it => isToday(it.date));
      setDataState([...filterArr]);
    }
    setActive(tab);
    setLoading(false);
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
          <TouchableOpacity
            style={active === 'Тех.поддержка' && styles.activeText}
            onPress={() => changeStateFunc('Тех.поддержка', adminData)}>
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
