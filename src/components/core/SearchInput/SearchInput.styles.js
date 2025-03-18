import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderBottomWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    margin: 12,
  },
  icon: {
    width: 16,
    height: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 0,
    color: 'black',
  },
  clearButton: {
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#00C4CC',
    borderRadius: 8,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationIcon: {
    width: 14,
    height: 20,
    marginRight: 12,
    tintColor: '#0BC5BA',
  },
  clearIcon: {
    tintColor: '#000000',
    width: 12,
    height: 12,
    marginRight: 8,
  },
});
