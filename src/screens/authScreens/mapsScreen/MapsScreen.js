import React, {useEffect, useState} from 'react';
import {SearchInput} from '../../../components/core/SearchInput';
import {styles} from './styles';
import {useDispatch} from 'react-redux';
import {checkStore, checkUser, setStore, setTokens} from '../../../utils';
import axiosInstance from '../../../networking/axiosInstance';
import {
  globalStyles,
  MapsScreenName,
  SET_CUSTOMER,
  SET_SHOP,
  SignupName,
  VerifyPhoneName,
} from '../../../constants';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Dimensions,
  Platform,
  Keyboard,
} from 'react-native';
import {AppButton, AppInput, globalWidth, Loading} from '../../../components';
import wing from '../../../assets/images/wing.png';
import axios from 'axios';
import place from '../../../assets/images/wing.png';
import closeIcon from '../../../assets/images/closeIcon.png';
import {YaMap, Marker} from 'react-native-yamap';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getStatusBarHeight} from 'react-native-status-bar-height';

export const MapsScreen = ({navigation}) => {
  const [countryText, setCountryText] = useState('');
  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({});
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [addressText, setAddressText] = useState('');
  const [flag, setFlag] = useState(false);
  const [flag1, setFlag1] = useState(false);
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [location, setLocation] = useState({
    lat: 55.751244,
    lon: 37.618423,
    zoom: 7,
  });
  const [selectedCity, setSelectedCity] = useState({});

  useEffect(() => {
    if (countryText.length > 2) {
      let timer = setTimeout(() => {
        if (flag1) {
          searchDataYandex();
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [countryText]);

  useEffect(() => {
    if (addressText.length > 2) {
      let timer = setTimeout(() => {
        if (flag1) {
          searchDataYandex(true);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [addressText]);
  const onChangeTextFunc = (e, set) => {
    setFlag1(true);
    set(e);
  };
  const searchDataYandex = st => {
    let searchQuery = `${countryText} ${addressText}`.trim();

    axios
      .get(
        `https://geocode-maps.yandex.ru/1.x?apikey=274503c6-0ff8-4554-a8a2-7a5d21d3bdfc&geocode=${searchQuery}&format=json`,
      )
      .then(res => {
        if (
          Object.keys(res.data.response.GeoObjectCollection.featureMember)
            .length
        ) {
          autocomplete(res.data.response.GeoObjectCollection.featureMember, st);
        } else {
          Alert.alert('', 'не найдено');
        }
      })
      .catch(e => {
        console.error('Ошибка API:', e?.response?.data || e?.message || e);
        setCountry([]);
        // Alert.alert('', `Ошибка: ${e?.message || 'не найдено'}`);
      });
  };

  const autocomplete = (data, st) => {
    setFlag(true);
    if (st) {
      setData1(data);
    } else {
      setData(data);
    }
  };

  const axiosFunc = async location => {
    await setStore(location);
    setLoading(true);
    try {
      const response = await axiosInstance.put('/users/get-geo', {
        city: location?.name,
        address: location?.address,
      });
      usersGet(location);
    } catch (e) {
      setLoading(false);
    }
  };
  const usersGet = async () => {
    try {
      const response = await axiosInstance.get('/users/profile/buyer');
      dispatch({
        type: SET_CUSTOMER,
        payload: response.data.user_data.user,
      });
      navigation.replace('TabNavigation');
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e, 'ff');
    }
  };
  const addressFunc = (it, state) => {
    setData1([]);
    setAddressText(it.GeoObject.name);
    var str = it.GeoObject.Point.pos;
    var stringArray = str.split(/(\s+)/);
    setLocation({
      ...location,
      lat: +stringArray[2],
      lon: +stringArray[0],
      zoom: 10,
      address: it.GeoObject.name,
    });
    setSelectedCountry({
      ...selectedCountry,
      lat: +stringArray[2],
      lon: +stringArray[0],
      zoom: 10,
      address: it.GeoObject.name,
    });
  };

  console.log(selectedCity.name, selectedCountry.address);

  const finish = async st => {
    if (selectedCity.name && selectedCountry.address) {
      await axiosFunc(location);
    }
  };

  const countryFunc = async it => {
    setData([]);
    setCountryText(it.GeoObject.name);
    var str = it.GeoObject.Point.pos;
    var stringArray = str.split(/(\s+)/);
    setLocation({
      ...location,
      lat: +stringArray[2],
      lon: +stringArray[0],
      zoom: 5,
      name: it.GeoObject.name,
    });
    setSelectedCity({
      lat: +stringArray[2],
      lon: +stringArray[0],
      zoom: 5,
      name: it.GeoObject.name,
    });
    setAddressText(''); // Сбросить адрес
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={Keyboard.dismiss}
      style={[
        styles.container,
        Platform.OS === 'ios' && {marginTop: -(getStatusBarHeight(true) + 6)},
      ]}>
      <YaMap
        initialRegion={location}
        showUserPosition={false}
        rotateGesturesEnabled={false}
        zoomEnabled={true}
        nightMode={false}
        mapType={'vector'}
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
        }}>
        <Marker point={location} scale={0.05} source={wing} />
      </YaMap>
      {flag ? (
        Object.keys(data).length ? (
          <View
            style={{
              flex: 5,
              height: Dimensions.get('window').height,
              marginTop: 20,
            }}>
            <ScrollView
              bounces={false}
              contentContainerStyle={globalStyles.scrollContainer}>
              <SearchInput
                value={countryText}
                onChangeText={text => onChangeTextFunc(text, setCountryText)}
                placeholder="Введите город"
                onClear={() => {
                  setFlag(false);
                  setFlag1(false);
                  setData([]);
                  setCountryText('');
                }}
              />
              <View style={styles.back_button_View} />
              <View style={styles.listContainer}>
                {data.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.complView}
                      onPress={() => {
                        countryFunc(item, true);
                        setFlag1(false);
                        setFlag(false);
                      }}>
                      <Text
                        style={[
                          globalStyles.titleText,
                          styles.cameraText,
                          globalStyles.titleTextSmall,
                          globalStyles.weightLight,
                          globalStyles.textAlignLeft,
                        ]}>
                        {item.GeoObject.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        ) : (
          <View style={{flex: 5, height: Dimensions.get('window').height}}>
            <ScrollView
              bounces={false}
              contentContainerStyle={globalStyles.scrollContainer}>
              <SearchInput
                value={addressText}
                onChangeText={text => onChangeTextFunc(text, setAddressText)}
                placeholder="Введите адрес"
                onClear={() => {
                  setData1([]);
                  setAddressText('');
                  setFlag(false);
                  setFlag1(false);
                }}
              />
              <View style={styles.back_button_View} />
              {data1.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.complView}
                    onPress={() => {
                      addressFunc(item, true);
                      setFlag(false);
                      setFlag1(false);
                    }}>
                    <Text
                      style={[
                        globalStyles.titleText,
                        styles.cameraText,
                        globalStyles.weightBold,
                        globalStyles.textAlignLeft,
                      ]}>
                      {item.GeoObject.description}
                    </Text>
                    <Text
                      style={[
                        globalStyles.titleText,
                        styles.cameraText,
                        globalStyles.titleTextSmall,
                        globalStyles.weightLight,
                        globalStyles.textAlignLeft,
                      ]}>
                      {item.GeoObject.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )
      ) : (
        <View
          style={{
            backgroundColor: 'white',
            width: '100%',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <SearchInput
            value={countryText}
            onChangeText={text => onChangeTextFunc(text, setCountryText)}
            placeholder="Введите город доставки"
            onClear={() => onChangeTextFunc('', setCountryText)}
          />
          <SearchInput
            placeholder="Введите адрес доставки"
            value={addressText}
            onChangeText={text => onChangeTextFunc(text, setAddressText)}
            onClear={() => onChangeTextFunc('', setAddressText)}
          />
          <AppButton
            text={'Далее'}
            stylesContainer={styles.btn}
            onPress={() => finish()}
          />
        </View>
      )}
      <Loading loading={loading} />
    </TouchableOpacity>
  );
};
