import React, {useEffect, useState} from 'react';
import {
  personalDataAgreement,
  privacyPolicy,
} from '../../../authScreens/signinScreen/SignInScreen';
import {styles} from './styles';
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import rightIcon from '../../../../assets/images/rightIcon.png';
import place from '../../../../assets/images/wing.png';
import {
  Colors,
  FinancialReportName,
  globalStyles,
  PromotionServicesName,
  EditMyDetailsName,
  LoremName,
} from '../../../../constants';
import {
  ChangePasswordModal,
  ChangeShopModal,
  globalHeight,
  Loading,
} from '../../../../components';
import axiosInstance from '../../../../networking/axiosInstance';
import {useSelector} from 'react-redux';
import {getStatusBarHeight} from 'react-native-status-bar-height';

export const ProfileScreen = ({navigation}) => {
  const store = useSelector(st => st.customer);
  const [loading, setLoading] = useState(false);

  const navigationFunc = nav => {
    navigation.navigate(nav);
  };

  return (
    <View
      style={[
        globalStyles.container,
        Platform.OS === 'ios' && {marginTop: -(getStatusBarHeight(true) + 5)},
      ]}>
      <ScrollView
        bounces={false}
        contentContainerStyle={globalStyles.container}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor={Colors.blueBackground}
        />
        <View
          style={[
            styles.headerContainer,
            Platform.OS === 'ios' && {
              paddingTop: getStatusBarHeight(true) + globalHeight(45),
            },
          ]}>
          {store?.full_name && (
            <Text
              style={[
                globalStyles.titleText,
                globalStyles.titleTextSmall,
                globalStyles.textAlignLeft,
                styles.shopName,
              ]}>
              {store.full_name}
            </Text>
          )}
          <View style={globalStyles.row}>
            <Image source={place} style={styles.placeIcon} />
            <Text
              style={[
                globalStyles.titleText,
                globalStyles.weightLight,
                styles.placeText,
              ]}>
              г. {store.city}, {store.address}
            </Text>
          </View>
        </View>
        <View>
          <TouchableOpacity
            style={[styles.buttonContainer, styles.activeInActiveContainer]}
            onPress={() => navigationFunc(PromotionServicesName)}>
            <View style={styles.activeContainer}>
              <Text
                style={[
                  globalStyles.titleText,
                  globalStyles.textAlignLeft,
                  globalStyles.titleTextSmall,
                  globalStyles.weightLight,
                  styles.activeTextHeader,
                ]}>
                Значимые даты
              </Text>
            </View>
            <Image source={rightIcon} style={styles.RightIcon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => navigationFunc(FinancialReportName)}>
            <Text style={[globalStyles.titleText, globalStyles.weightLight]}>
              Мои покупки
            </Text>
            <Image source={rightIcon} style={styles.RightIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => navigationFunc(EditMyDetailsName)}>
            <Text style={[globalStyles.titleText, globalStyles.weightLight]}>
              Мои данные
            </Text>
            <Image source={rightIcon} style={styles.RightIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              navigation.navigate(LoremName, {
                name: 'Политика конфиденциальности',
                text: privacyPolicy,
              });
            }}>
            <Text style={[globalStyles.titleText, globalStyles.weightLight]}>
              Политика конфиденциальности
            </Text>
            <Image source={rightIcon} style={styles.RightIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              navigation.navigate(LoremName, {
                name: 'Условия использования приложения',
                text: personalDataAgreement,
              });
            }}>
            <Text style={[globalStyles.titleText, globalStyles.weightLight]}>
              Условия использования приложения
            </Text>
            <Image source={rightIcon} style={styles.RightIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              navigation.navigate(LoremName, {
                name: 'О приложении',
                text: 'Дари в Кайф v1.0.0',
              });
            }}>
            <Text style={[globalStyles.titleText, globalStyles.weightLight]}>
              О приложении
            </Text>
            <Image source={rightIcon} style={styles.RightIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              Linking.openURL('https://t.me/DariVkaif_bot');
            }}>
            <Text style={[globalStyles.titleText, globalStyles.weightLight]}>
              Поддержка
            </Text>
            <Image source={rightIcon} style={styles.RightIcon} />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Loading loading={loading} />
    </View>
  );
};
