import React, {useState, useRef, useEffect} from 'react';
import {styles} from './styles';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  Loading,
  BackButton,
  AppInput,
  ChooseImage,
} from '../../../../components';
import {
  globalStyles,
  BaseUrl,
  imageUrl,
  MessagesName,
} from '../../../../constants';
import sendIcon from '../../../../assets/images/sendIcon.png';
import ChatPlus from '../../../../assets/images/ChatPlus.png';
import {checkTokens} from '../../../../utils';
import io from 'socket.io-client';
import {useDispatch, useSelector} from 'react-redux';
import ImageView from 'react-native-image-viewing';
import axiosInstance from '../../../../networking/axiosInstance';

let socketNew = null;

export const MessagesScreen = ({navigation, route}) => {
  const [chat, setChat] = useState([]);
  const [addInput, setAddInput] = useState('');
  const [text, setText] = useState('');
  const [visible, setVisible] = useState(false);
  const [scrollToEnd, setScrollToEnd] = useState(true);
  const scrollViewRef = useRef();
  const dispatch = useDispatch();
  const store = useSelector(st => st.customer);
  const [active, setActive] = useState(false);
  const [activeImage, setActiveImage] = useState({});
  const [token, setToken] = useState('');
  const user = route.params?.item;
  const state = route.params?.state;
  const [textWidth, setTextWidth] = useState(0);
  const sellerId = user?.seller_id?._id || user?.seller_id;
  const url1 = 'http://79.174.80.241:3001/api/chat/user';
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user && (user.admin || user.priority === 'buyer')) {
      setIsAdmin(true);
    }
  }, [user]);

  useEffect(() => {
    setTokFunc();
    return () => {
      if (socketNew) {
        socketNew.disconnect();
      }
    };
  }, [isAdmin]);

  const setTokFunc = async () => {
    setVisible(true);
    let token = await checkTokens();
    console.log('Token retrieved:', token);
    setToken(token);
    socketConnectFunc(token);
    setVisible(false);
  };

  const socketConnectFunc = token => {
    if (socketNew) {
      console.log('Disconnecting existing socket');
      socketNew.disconnect();
    }

    console.log('Connecting to socket...', url1);

    const socketQuery = {
      token: token,
      // buyer_id: store._id,
      roomId: user.chatID,
      admin: isAdmin,
    };

    if (!isAdmin && sellerId) {
      socketQuery.seller_id = sellerId;
    }

    socketNew = io(url1, {
      query: socketQuery,
      transports: ['websocket'],
      forceNew: true,
    });

    socketNew.on('connect', () => {
      console.log('Socket connected');
      socketNew.emit('getMessage');
    });

    socketNew.on('connect_error', error => {
      console.error('Socket connection error:', error);
    });

    socketNew.on('disconnect', reason => {
      console.log('Socket disconnected:', reason);
    });

    getMessageFunc();
  };

  const getMessageFunc = () => {
    socketNew.on('messages', messages => {
      console.log('Updated messages received:', messages);
      if (messages && messages.messages) {
        const arr = messages.messages;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].isImage) {
            arr[i].play = false;
          }
        }
        setChat([...arr]);
      } else {
        console.warn('Received messages in unexpected format:', messages);
      }
    });
  };

  const requestCameraPermission = () => {
    try {
      console.log('Requesting camera permission...');
      ChooseImage(async imageRes => {
        if (!imageRes.didCancel) {
          console.log('Sending image:', imageRes.assets[0].base64);
          socketNew.emit(
            'send-img',
            `data:image/png;base64,${imageRes.assets[0].base64}`,
          );
        }
      });
    } catch (err) {
      console.error('Error requesting camera permission:', err);
    }
    setScrollToEnd(true);
  };

  const handleEve = mess => {
    if (addInput) {
      const newMessage = {
        _id: `${Date.now()}`,
        text: mess,
        isImage: false,
        role: 'user',
        isRead: false,
        time: new Date().toLocaleTimeString(),
        room_id: user.chatID,
        date: new Date().toISOString(),
        name: store.full_name,
      };

      setChat(prev => [...prev, newMessage]);

      socketNew.emit('sendMessage', {
        text: mess,
        admin: isAdmin,
        name: store.full_name,
        room_id: user.chatID,
      });
      console.log('Message emitted:', newMessage);

      if (isAdmin) {
        socketNew.once('messages', messages => {
          const saved = messages.messages.some(
            msg => msg.text === mess && msg._id === newMessage._id,
          );
          if (!saved) {
            Alert.alert(
              'Ошибка',
              'Сообщение не удалось сохранить в чате техподдержки',
            );
          }
        });
      }
      setScrollToEnd(true);
      setAddInput('');
    }
  };

  const ChatsFunc = () => {
    console.log('Rendering chat messages:', chat);
    return chat.map((item, index) => {
      if (!item.isImage && (!item.text || item.text.trim() === '')) {
        return null;
      }

      return (
        <View
          style={[
            styles.placeHolderImageViewText,
            {
              alignItems:
                item.role !== 'user' || item.role === 'admin'
                  ? 'flex-start'
                  : 'flex-end',
            },
          ]}
          key={index}>
          <View
            style={[
              styles.content,
              item.role !== 'user' || item.role === 'admin'
                ? styles.left
                : styles.right,
            ]}>
            {item.isImage ? (
              <TouchableOpacity
                onPress={() => {
                  if (!item.play) {
                    setActiveImage([{uri: imageUrl + item.text}]);
                    setActive(true);
                  }
                }}>
                {item.play ? (
                  <ActivityIndicator
                    size={40}
                    color={'#569690'}
                    style={{
                      position: 'absolute',
                      zIndex: 10,
                      bottom: 0,
                      top: 0,
                      left: 0,
                      right: 0,
                    }}
                  />
                ) : null}
                <Image
                  onLoadStart={e => {
                    item.play = true;
                    setChat([...chat]);
                  }}
                  onLoad={e => {
                    item.play = false;
                    setChat([...chat]);
                  }}
                  onLoadEnd={e => {
                    item.play = false;
                    setChat([...chat]);
                  }}
                  source={{uri: imageUrl + item.text}}
                  style={styles.imgMsg}
                />
              </TouchableOpacity>
            ) : (
              <View style={globalStyles.messageContainer}>
                <Text
                  style={[
                    globalStyles.weightLight,
                    globalStyles.titleTextBig,
                    {color: 'white'},
                  ]}
                  onLayout={event => {
                    setTextWidth(event.nativeEvent.layout.width);
                  }}>
                  {item.text}
                </Text>
                <Text
                  style={[
                    globalStyles.timeText,
                    globalStyles.weightLight,
                    {
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'flex-end',
                      textAlign: 'right',
                      color: 'black',
                    },
                  ]}>
                  {item.time && item.time.length >= 5
                    ? item.time.slice(0, 5)
                    : item.time}
                </Text>
              </View>
            )}
          </View>
        </View>
      );
    });
  };

  return (
    <View style={styles.chatScrool}>
      <BackButton
        text={
          isAdmin
            ? 'Техническая поддержка'
            : user?.name || user?.legal_name || 'Чат'
        }
        navigation={navigation}
        stylesBack={styles.backContainer}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        ref={scrollViewRef}
        onContentSizeChange={() => {
          if (scrollToEnd && chat.length) {
            scrollViewRef.current.scrollToEnd({
              y: 0,
              animated: true,
            });
            setScrollToEnd(false);
          }
        }}>
        {ChatsFunc()}
      </ScrollView>

      <View style={styles.chatInputView}>
        {!state ? (
          <TouchableOpacity onPress={requestCameraPermission}>
            <Image source={ChatPlus} style={styles.chatPlusImg} />
          </TouchableOpacity>
        ) : null}
        <AppInput
          style={styles.textInputChat}
          value={addInput}
          onChangeText={evt => {
            setAddInput(evt);
            setText('');
          }}
        />
        <TouchableOpacity
          style={styles.chatIconContainer}
          onPress={() => {
            handleEve(addInput);
            setAddInput('');
          }}>
          <Image source={sendIcon} style={styles.chatIcon} />
        </TouchableOpacity>
      </View>
      <ImageView
        images={activeImage}
        imageIndex={0}
        visible={active}
        onRequestClose={() => {
          setActive(false);
          setActiveImage({});
        }}
      />
      <Loading loading={visible} />
    </View>
  );
};
