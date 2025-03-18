import {StyleSheet, Dimensions} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {Colors} from '../../../../constants';
import {globalHeight, globalWidth} from '../../../../components';

let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;

export const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: Colors.backgroundBLightBlue,
    paddingHorizontal: globalWidth(20),
    paddingVertical: globalHeight(10),
    paddingTop: 12,
  },
  background: {
    width: '100%',
    height:
      (getStatusBarHeight() + (DeviceInfo.hasDynamicIsland() ? 40 : 0)) / 1.8,
    backgroundColor: Colors.white,
  },
  addressText: {
    lineHeight: 16,
    marginVertical: 4,
    textAlign: 'auto',
    marginRight: 12,
  },
  headerTextContainer: {
    alignItems: 'center',
    paddingHorizontal: globalHeight(10),
    justifyContent: 'space-between',
    paddingVertical: globalHeight(10),
  },
  mask: {
    width: width - globalWidth(40),
    height: globalHeight(159),
    // resizeMode:'contain',
    borderRadius: 10,
  },
  headerContent1: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: globalHeight(17),
    justifyContent: 'space-between',
    borderColor: Colors.borderGray,
    marginHorizontal: globalWidth(20),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: globalHeight(8),
    paddingBottom: globalHeight(12),
    justifyContent: 'space-between',
    marginBottom: globalHeight(10),
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: Colors.borderGray,
    marginVertical: globalHeight(8),
    marginTop: 0,
    marginHorizontal: globalWidth(20),
  },
  bottomIconStyle: {
    resizeMode: 'contain',
    width: globalWidth(7),
    height: globalHeight(12),
  },
  filterTextStyle: {
    color: Colors.black,
  },
  winIconStyle: {
    width: globalWidth(12),
    height: globalWidth(16),
    resizeMode: 'contain',
    tintColor: '#0BC5BA',
    marginTop: 2,
  },
  HeaderFooter: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 7,
    overflow: 'hidden',
    justifyContent: 'flex-start',
    marginLeft: 8,
    marginVertical: 8,
  },
  formContent: {
    width: width - globalWidth(30),
  },
  filterCont: {
    marginBottom: globalHeight(0),
  },
  noneBtmWdth: {
    borderTopWidth: 0,
  },
  input: {
    paddingLeft: 12,
    borderBottomWidth: 0,
    height: globalHeight(49),
    width: '80%',
  },
  headerInput: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderColor: '#E2EFFF',
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  searchIcon: {
    width: globalWidth(22),
    height: globalWidth(22),
    resizeMode: 'contain',
  },
  searchCont: {
    backgroundColor: Colors.tifany,
    paddingVertical: globalHeight(12),
    paddingHorizontal: globalWidth(12),
    borderRadius: 6,
    position: 'absolute',
    right: 0,
  },
  recText: {
    backgroundColor: Colors.blueBackground,
    paddingRight: globalWidth(20),
    paddingBottom: globalHeight(10),
  },
  recText1: {
    paddingHorizontal: globalWidth(20),
  },
  autoDataStyle: {
    marginHorizontal: globalWidth(20),
    paddingVertical: globalHeight(15),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGray,
  },
  autoText: {
    fontSize: globalWidth(12),
    color: '#64768A',
  },
  backCont: {
    position: 'absolute',
    zIndex: 10,
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContainer: {
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.tifany,
    backgroundColor: Colors.white,
    paddingVertical: globalHeight(2),
    paddingHorizontal: globalHeight(6),
  },
  filterIconStyle: {
    marginLeft: 2,
    resizeMode: 'contain',
    width: globalWidth(15),
    height: globalHeight(11),
  },
  backIcon: {
    resizeMode: 'contain',
    width: globalWidth(12),
    height: globalHeight(12),
  },

  headerFooterText: {
    marginLeft: globalWidth(4),
    fontSize: 15,
    fontWeight: '400',
  },
  headerSearch: {
    paddingVertical: globalWidth(10),
    backgroundColor: Colors.blueBackground,
  },
  iconTopBottom: {
    resizeMode: 'contain',
    width: globalWidth(16),
    height: globalWidth(16),
  },
  contView: {
    paddingHorizontal: globalWidth(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cityT: {
    fontSize: globalWidth(12),
  },
  addressContainer: {
    flex: 1,
  },
});
