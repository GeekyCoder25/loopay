import { StyleSheet, Text } from 'react-native';

const RegularText = ({ children, style }) => {
  return <Text style={{ ...styles.text, ...style }}>{children}</Text>;
};
const styles = StyleSheet.create({
  text: {
    fontFamily: 'OpenSans-500',
    color: '#000',
  },
});
export default RegularText;
