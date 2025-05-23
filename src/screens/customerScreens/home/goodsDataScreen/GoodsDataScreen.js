import {useIsFocused} from '@react-navigation/native';
import React, {createRef, useEffect, useRef, useState} from 'react';
import {styles} from './styles';
import {
  AddTrushName,
  BaseUrl,
  globalStyles,
  imageUrl,
  ShopName,
} from '../../../../constants';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppButton, ImgForm} from '../../../../components';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import LinearGradient from 'react-native-linear-gradient';
import backWhite from '../../../../assets/images/backIcon.png';
import shopIconka from '../../../../assets/images/shopIconka.png';
import backIcon from '../../../../assets/images/rightIcon.png';
import axiosInstance from '../../../../networking/axiosInstance';
import minusC from '../../../../assets/images/minusC.png';
import plusC from '../../../../assets/images/plusC.png';
import like from '../../../../assets/images/likeTifany.png';
import dntLike from '../../../../assets/images/dntLike.png';
import ImageView from 'react-native-image-viewing';

const updateGoods = (items, changedGoodId, isFavorite) => {
  return items.map(item => {
    if (item._id === changedGoodId) {
      return {
        ...item,
        is_favorite: isFavorite,
      };
    }
    return item;
  });
};

let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;
export const GoodsDataScreen = ({navigation, route}) => {
  const store = useSelector(st => st.customer);
  const carouselRef = useRef();
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [data, setData] = useState(route.params.item);
  const [active, setActive] = useState(false);
  const goodsData = useSelector(state => state.goods.items);
  const isFocused = useIsFocused();

  useEffect(() => {
    const good = goodsData.find(
      item => item.store_id._id === route.params.item.store_id._id,
    );

    setData({
      ...data,
      store_id: {
        ...data.store_id,
        is_favoritestore: good?.store_id?.is_favoritestore,
      },
    });
  }, [goodsData, isFocused, route.params?.item?.store_id?._id]);

  const img = Array.isArray(data.photo_list[0])
    ? data.photo_list[0]
    : data.photo_list;
  const [count, setCount] = useState(1);
  const addNumFunc = async () => {
    if (data.count !== +count) {
      setCount(`${+count + 1}`);
    }
  };
  // console.log(data, img);
  const minNumFunc = async () => {
    if (count > `${1}`) {
      setCount(`${+count - 1}`);
    }
  };
  const addFavoriteFunc = async () => {
    const arr = data;
    const dataId = data?.good_id?._id ? data.good_id?._id : arr._id;

    if (!arr.is_favorite) {
      try {
        const response = await axiosInstance.post(
          `/favorites?good_id=${dataId}&store_id=${arr.store_id._id}`,
        );
        arr.is_favorite = true;
        setData({...arr});
        const newGoods = updateGoods(goodsData, dataId, arr.is_favorite);

        dispatch({type: 'SET_GOODS', payload: newGoods});
      } catch (e) {
        // console.log(e);
      }
    } else {
      try {
        const response = await axiosInstance.delete(
          `/favorites?good_id=${dataId}`,
        );
        // console.log(`/favorites?good_id=${arr._id}`, response);

        arr.is_favorite = false;
        setData({...arr});

        const newGoods = updateGoods(goodsData, dataId, arr.is_favorite);

        dispatch({type: 'SET_GOODS', payload: newGoods});
      } catch (e) {
        console.log(e, 'fff');
      }
    }
    // console.log(arr);
    setData({...arr});
  };
  const trashFunc = async () => {
    console.log("GOOйййййййййййOD", data)
    try {
      const obj = {
        good_id: data._id,
        count,
      };
      const response = await axiosInstance.post('/carts', obj);
      navigation.navigate(AddTrushName);

    } catch (e) {
      setError(e?.response?.data?.error);
      console.log(e.response?.data?.error);
    }
  };
  // console.log(data);
  return (
    <>
      {Platform.OS === 'ios' && <View style={styles.background} />}
      <ScrollView
        contentContainerStyle={globalStyles.scrollContainer}
        bounces={false}>
        <View style={styles.cont}>
          <View>
            <LinearGradient
              start={{x: 0.0, y: 0.05}}
              end={{x: 0, y: 1.0}}
              locations={[0, 0.5, 0.6]}
              colors={['rgba(6, 6, 6, 0.54)', 'rgba(0, 0, 0, 0.00)']}
              style={styles.linearGradient}>
              <TouchableOpacity
                style={styles.bckCont}
                hitSlop={20}
                onPress={() => navigation.goBack()}>
                <Image source={backWhite} style={styles.bckImg} />
              </TouchableOpacity>
              <ImageView
                images={img}
                imageIndex={activeIndex}
                visible={active}
                onRequestClose={() => setActive(false)}
              />
              <Carousel
                inactiveSlideOpacity={0.6}
                inactiveSlideScale={0.65}
                firstItem={1}
                sliderWidth={width}
                itemWidth={width}
                data={img}
                onSnapToItem={i => setActiveIndex(i)}
                renderItem={({item, index}) => {
                  return (
                    <ImgForm
                      item={item}
                      index={index}
                      data={img}
                      navigation={navigation}
                      fullData={data}
                      setActive={setActive}
                    />
                  );
                }}
                containerCustomStyle={{overflow: 'visible'}}
                contentContainerCustomStyle={{overflow: 'visible'}}
              />
              <View style={styles.bckContCircle}>
                <Pagination
                  dotsLength={img.length}
                  activeDotIndex={activeIndex}
                  containerStyle={{backgroundColor: 'transparent'}}
                  dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  }}
                  inactiveDotStyle={{}}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
                />
              </View>
              <TouchableOpacity
                style={[styles.likebtn, data.is_favorite && styles.styleLik]}
                onPress={() => {
                  addFavoriteFunc(data);
                }}>
                <Image
                  source={data.is_favorite ? like : dntLike}
                  style={styles.likeIc}
                />
              </TouchableOpacity>
            </LinearGradient>
            <View style={styles.content}>
              <Text
                style={[
                  globalStyles.titleText,
                  globalStyles.textAlignLeft,
                  globalStyles.weightLight,
                  styles.textCont,
                ]}>
                {data.title}
              </Text>
              <View style={[globalStyles.row, styles.rowCont]}>
                <Text
                  style={[
                    globalStyles.titleText,
                    globalStyles.textAlignLeft,
                    styles.textCont,
                  ]}>
                  {data?.price?.$numberDecimal
                    ? data?.price?.$numberDecimal
                    : data.price}{' '}
                  р
                </Text>
                <View style={styles.rowView}>
                  <TouchableOpacity
                    style={[styles.btnAdd]}
                    onPress={minNumFunc}>
                    <Image source={minusC} style={styles.imgPlusMinus} />
                  </TouchableOpacity>
                  <Text
                    style={[
                      globalStyles.titleText,
                      globalStyles.weightBold,
                      globalStyles.titleTextSmall,
                      globalStyles.textAlignLeft,
                      styles.textCount,
                    ]}>
                    {count}
                  </Text>
                  <TouchableOpacity
                    style={[styles.btnAdd, styles.absl]}
                    onPress={addNumFunc}>
                    <Image source={plusC} style={styles.imgPlusMinus} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.timeContainer}>
                {data.time_to_get_ready === 'Всегда в наличии' ? (
                  <Text
                    style={[
                      globalStyles.titleText,
                      globalStyles.textAlignLeft,
                      globalStyles.weightLight,
                      globalStyles.titleTextSmall,
                    ]}>
                    <Text style={styles.grayText}>{data.time_to_get_ready}</Text>
                  </Text>
                ) : (
                  <Text
                    style={[
                      globalStyles.titleText,
                      globalStyles.textAlignLeft,
                      globalStyles.weightLight,
                      globalStyles.titleTextSmall,
                    ]}>
                    Время готовности:{' '}
                    <Text style={styles.grayText}>{data.time_to_get_ready}</Text>
                  </Text>
                )}
              </View>
              <View>
                <Text
                  style={[
                    globalStyles.titleText,
                    globalStyles.textAlignLeft,
                    globalStyles.titleTextSmall,
                    styles.ops,
                  ]}>
                  Описание
                </Text>
                <Text
                  style={[
                    globalStyles.titleText,
                    globalStyles.textAlignLeft,
                    globalStyles.titleTextSmall,
                    globalStyles.weightLight,
                  ]}>
                  {data.short_description}
                </Text>
                <Text
                  style={[
                    globalStyles.titleText,
                    globalStyles.textAlignLeft,
                    globalStyles.titleTextSmall4,
                    globalStyles.weightLight,
                    styles.idText,
                  ]}>
                  ID: {data.store_id._id}
                </Text>
              </View>
            </View>
          </View>
          <View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(ShopName, {shop: data.store_id})
              }
              style={styles.shopContAll}>
              <View style={styles.shopCont}>
                <Image
                  source={{uri: imageUrl + '/' + data.store_id.logo_url}}
                  style={styles.imgShop}
                />
                <View>
                  <Text
                    style={[
                      globalStyles.titleText,
                      globalStyles.textAlignLeft,
                      globalStyles.titleTextSmall,
                      globalStyles.weightLight,
                    ]}>
                    Магазин
                  </Text>
                  <Text
                    style={[
                      globalStyles.titleText,
                      globalStyles.textAlignLeft,
                      styles.ops,
                    ]}>
                    {data.store_id.title}{' '}
                  </Text>
                </View>
              </View>
              <Image source={backIcon} style={styles.rightIcon} />
            </TouchableOpacity>
            <View style={styles.footerCont}>
              {error && <Text style={globalStyles.error}>{error}</Text>}

              <TouchableOpacity
                style={styles.btnView}
                onPress={() => {
                  trashFunc();
                }}>
                <View style={styles.priceFooter}>
                  <Image source={shopIconka} style={styles.shopIcon} />
                  <Text
                    style={[
                      globalStyles.titleText,
                      globalStyles.textAlignLeft,
                      globalStyles.titleTextSmall4,
                      globalStyles.weightLight,
                      styles.priceText,
                    ]}>
                    {data?.price?.$numberDecimal
                      ? data.price.$numberDecimal
                      : data.price * count}{' '}
                    p
                  </Text>
                </View>
                <View style={styles.stylesContainer}>
                  <Text
                    style={[
                      globalStyles.titleText,
                      globalStyles.titleTextSmall,
                      globalStyles.weightBold,
                      styles.text,
                    ]}>
                    Добавить в корзину
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};
