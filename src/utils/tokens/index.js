import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setTokens(accessToken) {
  try {
    await AsyncStorage.setItem('accessToken', accessToken);
  } catch (error) {
    console.log('Error setting tokens:', error.message);
    throw error;
  }
}

export async function checkTokens() {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    // console.log('Retrieved Token:', token);
    return token;
  } catch (error) {
    console.log('Error checking tokens:', error.message);
    throw error;
  }
}

export async function removeTokens() {
  try {
    await AsyncStorage.removeItem('accessToken');
    return true;
  } catch (exception) {
    return false;
  }
}
