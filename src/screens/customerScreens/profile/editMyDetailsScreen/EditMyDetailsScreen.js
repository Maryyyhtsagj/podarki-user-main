import React, {useState} from 'react';
import {styles} from './styles';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  AppButton,
  AppInput,
  BackButton,
  globalHeight,
  Loading,
  validateEmail,
} from '../../../../components';
import {useDispatch, useSelector} from 'react-redux';
import {
  EditMyDetailsName,
  globalStyles,
  SaveEditProfileName,
  SET_CUSTOMER,
  SET_CUSTOMER_DELETE,
  SET_SHOP_DELETE,
} from '../../../../constants';
import {email} from 'npm/lib/utils/read-user-info';
import axiosInstance from '../../../../networking/axiosInstance';
import {removeTokens} from '../../../../utils';
import AsyncStorage from '@react-native-community/async-storage';
import {getStatusBarHeight} from 'react-native-status-bar-height';

export const EditMyDetailsScreen = ({navigation}) => {
  const store = useSelector(st => st.customer);
  const dispatch = useDispatch();
  const [name, setName] = useState(store.full_name);
  const [phone, setPhone] = useState(store.phone_number);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');

  const onPressFunc = async () => {
    await axiosFunc();
  };

  const axiosFunc = async () => {
    setLoading(true);
    try {
      const data = {
        phone_number: phone,
        full_name: name,
      };
      const response = await axiosInstance.put('/users/profile/buyer', data);
      dispatch({
        type: SET_CUSTOMER,
        payload: response.data.user_data.user,
      });
      navigation.navigate(SaveEditProfileName);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };
  const logOutFunc = async () => {
    await removeTokens();
    await AsyncStorage.removeItem('fcmToken');
    dispatch({
      type: SET_CUSTOMER_DELETE,
    });
    dispatch({
      type: SET_SHOP_DELETE,
    });
    navigation.replace('AuthNavigation');
  };
  const onChangeTextFunc = (e, set) => {
    set(e);
    setError('');
  };

  const confirmLogOut = type => () => {
    Alert.alert(
      null,
      type === 'logout'
        ? 'Вы уверены, что хотите выйти?'
        : 'Вы уверены, что хотите удалить аккаунт?',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {text: 'Да', onPress: logOutFunc},
      ],
    );
  };

  return (
    <ScrollView
      contentContainerStyle={[
        globalStyles.scrollContainer,
        Platform.OS === 'ios' && {
          paddingTop: getStatusBarHeight(true) + globalHeight(15),
        },
      ]}
      bounces={false}>
      <View style={styles.contentMyDetailsAll}>
        <View>
          <BackButton navigation={navigation} stylesBack={styles.stylesBack} />
          <AppInput
            placeholder={'Имя'}
            style={styles.input}
            defaultValue={store.full_name}
            onChangeText={e => {
              onChangeTextFunc(e, setName);
            }}
          />

          <View style={styles.contentMyDetails}>
            <Text
              style={[
                globalStyles.titleText,
                globalStyles.weightLight,
                globalStyles.textAlignLeft,
                styles.contentMyDetailsText,
              ]}>
              {store.phone_number}
            </Text>
          </View>
        </View>
        <View>
          <TouchableOpacity
            style={styles.accountStateChange}
            onPress={confirmLogOut('logout')}>
            <Text
              style={[
                globalStyles.titleText,
                globalStyles.weightLight,
                styles.textUnderline,
              ]}>
              Выйти из профиля
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.accountStateChange}
            onPress={confirmLogOut('delete')}>
            <Text
              style={[
                globalStyles.titleText,
                globalStyles.weightLight,
                styles.textUnderline,
              ]}>
              Удалить профиль
            </Text>
          </TouchableOpacity>
          {error ? <Text style={globalStyles.error}>{error}</Text> : null}
          <View style={styles.appBtnView}>
            <AppButton text={'Сохранить'} onPress={() => onPressFunc()} />
          </View>
        </View>
      </View>
      <Loading loading={loading} />
    </ScrollView>
  );
};
