import {StyleSheet, Dimensions} from 'react-native';
import {Colors} from '../../../constants';
import {globalHeight, globalWidth} from '../../index';

let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;

export const styles = StyleSheet.create({
  containerForm: {
    alignItems: 'center',
    borderRadius: 100,
    marginHorizontal: globalWidth(8.5),
  },
  containerFormCat: {
    alignItems: 'center',
    width: 90,
    heiht: 90,
    marginHorizontal: 10,
  },
  img: {
    width: globalWidth(86),
    height: globalWidth(86),
    borderRadius: 100,
    resizeMode: 'contain',
  },
  catImg: {
    width: globalWidth(70),
    height: globalWidth(70),
    borderRadius: 100,
    resizeMode: 'contain',
  },
  title: {
    width: globalWidth(120),
    color: Colors.titleColor,
    fontWeight: '400',
    fontSize: globalWidth(15.5),
    textAlign: 'center',
    lineHeight: globalHeight(18),
  },
  pcs: {
    fontWeight: '300',
    color: Colors.titleColor,
    fontSize: globalWidth(14),
  },
});
