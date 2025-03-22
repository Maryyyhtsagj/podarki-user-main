import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useDispatch, useSelector} from 'react-redux';
import back from '../../../../assets/images/backIcon.png';
import FilterIcon from '../../../../assets/images/filter.png';
import search from '../../../../assets/images/search.png';
import topBottom from '../../../../assets/images/topBottom.png';
import place from '../../../../assets/images/wing.png';
import {
  AppInput,
  ArciveModal,
  FormCategoryHorizontal,
  FormGoods,
  globalHeight,
  Loading,
} from '../../../../components';
import {
  Colors,
  FilterName,
  globalStyles,
  SET_FILTER,
  SET_SEARCH_FLAG,
} from '../../../../constants';
import axiosInstance from '../../../../networking/axiosInstance';
import {styles} from './styles';

export const HomeScreen = ({navigation, route}) => {
  const store = useSelector(st => st.customer);
  const filter = useSelector(st => st.filter);
  const homeState = useSelector(state => state.homeState);
  const goodsData = useSelector(state => state.goods.items);
  let dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [autoFlag, setAutoFlag] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [banner, setBanner] = useState('');
  const [flag, setFlag] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [autoData, setAutoData] = useState([]);
  const [stateArcive, setStateArcive] = useState(false);
  const arciveStateFunc = st => setStateArcive(st);

  useEffect(() => {
    if (!homeState.searchFlag) {
      setSearchText('');
      setAutoFlag(false);
      setAutoData([]);
    }
  }, [homeState.searchFlag]);

  useEffect(() => {
    fetchGoodsData();
  }, [store, filter]);

  useEffect(() => {
    getCategory();
    getBanner();
  }, []);

  useEffect(() => {
    if (searchText.length > 2) {
      let timer = setTimeout(() => {
        if (flag) {
          autocomplete();
        }
      }, 500);
      return () => clearTimeout(timer);
    } else if (!searchText) {
      setAutoData([]);
      dispatch({type: SET_SEARCH_FLAG, payload: false});
      setAutoFlag(false);
    }
  }, [searchText]);

  const fetchGoodsData = async () => {
    if (Object.keys(filter).length) {
      await getFilter();
    } else {
      await getGoods();
    }
  };

  const onPressFuncArcive = async st => {
    let priceSort = {
      priceDesc: false,
      priceAsc: false,
      newFirst: false,
    };
    filter.priceSort = priceSort;
    priceSort[st] = true;
    dispatch({
      type: SET_FILTER,
      payload: filter,
    });
    arciveStateFunc(false);
  };

  let autocomplete = async () => {
    try {
      let response = await axiosInstance.post(
        `/goods/search?search=${searchText}`,
      );
      if (Object.keys(response.data).length) {
        setAutoFlag(true);
        setAutoData([...response.data]);
      } else {
        Alert.alert('', 'В вашем регионе нет пока магазинов');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getFilter = async () => {
    try {
      let query = {};
      if (filter.stock) {
        query.sort = true;
      }
      let url = 'goods//filter?';
      if (filter.category_id) {
        url = url + `category=${filter.category_id}&`;
      }
      if (filter.subcategory) {
        url = url + `subcategory=${filter.subcategory}&`;
      }
      if (filter.sort) {
        url = url + `sort=${filter.sort}&`;
      }
      if (filter.price_from) {
        url = url + `price_from=${filter.price_from}&`;
      }
      if (filter.price_to) {
        url = url + `price_to=${filter.price_to}&`;
      }
      if (searchText) {
        url = url + `search=${searchText}&`;
      }
      if (filter?.priceSort?.priceAsc) {
        url = url + 'sort=priceAsc&';
      }
      if (filter?.priceSort?.priceDesc) {
        url = url + 'sort=priceDesc&';
      }
      if (filter?.priceSort?.newFirst) {
        url = url + 'sort=newFirst&';
      }

      const response = await axiosInstance.get(`${url}`, {
        headers: {
          query: query,
        },
      });

      dispatch({type: 'SET_GOODS', payload: []});
      dispatch({type: 'SET_GOODS', payload: response.data});
    } catch (e) {
      console.log(e);
    }
  };

  const getCategory = async () => {
    try {
      const response = await axiosInstance.get('/categories');
      setCategoryData(response.data.categories);
    } catch (e) {
      console.log(e);
    }
  };

  const getBanner = async () => {
    try {
      const response = await axiosInstance.get('/goods/banner');
      setBanner(response.data.banner);
    } catch (e) {
      console.log(e);
    }
  };
  const getGoods = async () => {
    try {
      const response = await axiosInstance.get('/goods/all');
      dispatch({type: 'SET_GOODS', payload: response.data});
    } catch (e) {
      console.log(e);
    }
  };

  const addFavoriteFunc = async (item, index) => {
    const arr = goodsData;
    if (!item.is_favorite) {
      try {
        const response = await axiosInstance.post(
          `/favorites?good_id=${item._id}&store_id=${item.store_id._id}`,
        );
        arr[index].is_favorite = !arr[index].is_favorite;
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        const response = await axiosInstance.delete(
          `/favorites?good_id=${item._id}`,
        );
        arr[index].is_favorite = !arr[index].is_favorite;
      } catch (e) {
        console.log(e);
      }
    }
    dispatch({type: 'SET_GOODS', payload: [...arr]});
  };
  const autoPressFunc = it => {
    if (searchText) {
      setFlag(false);
      setAutoFlag(false);
      setSearchText(it);
      dispatch({type: SET_SEARCH_FLAG, payload: true});
      getFilter();
    }
  };

  const deleteFilterFunc = async () => {
    dispatch({
      type: 'SET_FILTER_DELETE',
    });
    dispatch({type: 'SET_GOODS', payload: []});
    setSearchText('');
    setAutoFlag(false);
    dispatch({type: SET_SEARCH_FLAG, payload: false});
    // try {
    //     const response = await axiosInstance.get(`/goods`);
    //     setGoodsData([...response.data]);
    // } catch (e) {
    //     console.log(e);
    // }
  };
  const ChangePageCategory = async item => {
    try {
      const response = await axiosInstance.get(
        `goods//filter?category=${item._id}`,
      );
      dispatch({type: SET_SEARCH_FLAG, payload: true});
      setAutoFlag(false);
      dispatch({type: 'SET_GOODS', payload: []});
      dispatch({type: 'SET_GOODS', payload: response.data});
    } catch (e) {
      Alert.alert('В данной категории отсутствуют товары');
      console.log('e', e);
    }
  };

  return (
    <>
      <View style={[globalStyles.container]}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={Colors.blueBackground}
        />
        {Platform.OS === 'ios' && <View style={styles.background} />}
        <ScrollView
          contentContainerStyle={globalStyles.scrollContainer}
          bounces={false}>
          <View style={[styles.headerContainer]}>
            <View style={[styles.headerInput]}>
              {homeState.searchFlag ? (
                <TouchableOpacity
                  style={styles.backCont}
                  onPress={deleteFilterFunc}>
                  <Image source={back} style={styles.backIcon} />
                </TouchableOpacity>
              ) : null}
              <AppInput
                style={styles.input}
                placeholder={'Что ищете?'}
                onChangeText={e => {
                  setSearchText(e);
                  setFlag(true);
                }}
                value={searchText}
              />
              <TouchableOpacity
                style={styles.searchCont}
                onPress={() => autoPressFunc(searchText)}>
                <Image source={search} style={styles.searchIcon} />
              </TouchableOpacity>
            </View>
          </View>
          {autoFlag ? (
            <View>
              <Text
                style={[
                  globalStyles.titleText,
                  globalStyles.titleTextSmall,
                  globalStyles.weightBold,
                  globalStyles.textAlignLeft,
                  styles.recText1,
                ]}>
                Рекомендации
              </Text>
              <View>
                {autoData.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.autoDataStyle}
                      onPress={() => autoPressFunc(item.title)}>
                      <Text
                        style={[
                          globalStyles.titleText,
                          globalStyles.titleTextSmall,
                          globalStyles.weightLight,
                          globalStyles.textAlignLeft,
                        ]}>
                        {item?.title}
                      </Text>
                      <Text
                        style={[
                          globalStyles.titleText,
                          globalStyles.titleTextSmall,
                          globalStyles.weightLight,
                          globalStyles.textAlignLeft,
                          styles.autoText,
                        ]}>
                        {item?.category_id?.title}{' '}
                        {item?.subcategory_id?.name &&
                          `/ ${item?.subcategory_id?.name}`}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ) : (
            <>
              {homeState.searchFlag ? (
                <View style={styles.headerSearch}>
                  <View style={styles.headerContent1}>
                    <TouchableOpacity
                      style={styles.filterContainer}
                      onPress={() => navigation.navigate(FilterName)}>
                      <Text
                        style={[
                          styles.filterTextStyle,
                          globalStyles.titleText,
                          globalStyles.weightLight,
                          globalStyles.titleTextSmall4,
                          styles.cityT,
                        ]}>
                        Фильтры
                      </Text>
                      <Image
                        source={FilterIcon}
                        style={styles.filterIconStyle}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.HeaderFooter, styles.addressContainer]}>
                      <Image source={place} style={styles.winIconStyle} />
                      <Text
                        numberOfLines={2}
                        style={[
                          globalStyles.titleTextSmall4,
                          globalStyles.textAlignLeft,
                          styles.cityT,
                          styles.headerFooterText,
                        ]}>
                        Адрес: {store.city}, {store.address}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.contView}>
                    <Text
                      style={[
                        globalStyles.titleText,
                        globalStyles.titleTextSmall,
                        globalStyles.weightBold,
                        globalStyles.textAlignLeft,
                        styles.recText,
                      ]}>
                      Мы нашли {goodsData.length} товаров
                    </Text>
                    <TouchableOpacity onPress={() => arciveStateFunc(true)}>
                      <Image source={topBottom} style={styles.iconTopBottom} />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View>
                  <View style={styles.headerTextContainer}>
                    <Image source={{uri: banner}} style={styles.mask} />
                  </View>
                  <View>
                    <View>
                      <TouchableOpacity
                        style={styles.HeaderFooter}
                        onPress={() => navigation.navigate('maps name')}>
                        <Image source={place} style={styles.winIconStyle} />

                        <Text
                          numberOfLines={2}
                          style={[
                            styles.headerFooterText,
                            globalStyles.titleText,
                            globalStyles.titleTextSmall,
                            styles.addressText,
                          ]}>
                          Адрес доставки: {store.city}, {store.address}{' '}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.headerContent}>
                      <Text
                        style={[
                          globalStyles.titleText,
                          globalStyles.titleTextBig,
                          styles.filterTextStyle,
                        ]}>
                        Категории
                      </Text>
                      <TouchableOpacity
                        onPress={() => navigation.navigate(FilterName)}>
                        <Text
                          style={[
                            styles.filterTextStyle,
                            globalStyles.titleText,
                            globalStyles.weightLight,
                            globalStyles.titleTextSmall4,
                          ]}>
                          Смотреть все
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.filterCont}>
                      <ScrollView
                        bounces={false}
                        showsHorizontalScrollIndicator={false}
                        horizontal>
                        {categoryData.map((item, index) => {
                          return (
                            <FormCategoryHorizontal
                              item={item}
                              key={index}
                              navigation={navigation}
                              ChangePageCategory={ChangePageCategory}
                            />
                          );
                        })}
                      </ScrollView>
                    </View>
                  </View>
                  <View style={[styles.headerContent, styles.noneBtmWdth]}>
                    <Text
                      style={[
                        globalStyles.titleText,
                        globalStyles.titleTextBig,
                        styles.filterTextStyle,
                      ]}>
                      Товары
                    </Text>
                    <TouchableOpacity onPress={deleteFilterFunc}>
                      <Text
                        style={[
                          styles.filterTextStyle,
                          globalStyles.titleText,
                          globalStyles.weightLight,
                          globalStyles.titleTextSmall4,
                        ]}>
                        Смотреть все
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              <FlatList
                data={goodsData}
                style={{padding: 8}}
                renderItem={({item, index}) => {
                  return (
                    <FormGoods
                      item={item}
                      key={item._id}
                      index={index}
                      navigation={navigation}
                      addFavoriteFunc={addFavoriteFunc}
                    />
                  );
                }}
                keyExtractor={item => item._id}
                showsVerticalScrollIndicator={false}
                numColumns={2}
              />
            </>
          )}
        </ScrollView>
        <Loading loading={loading} />
        <ArciveModal
          visible={stateArcive}
          modalFunc={arciveStateFunc}
          onPressFuncArcive={onPressFuncArcive}
        />
      </View>
    </>
  );
};
