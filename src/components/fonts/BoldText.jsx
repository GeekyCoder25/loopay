import { StyleSheet, Text } from 'react-native';

const BoldText = ({ children, style }) => {
  return <Text style={{ ...styles.text, ...style }}>{children}</Text>;
};
const styles = StyleSheet.create({
  text: {
    fontFamily: 'OpenSans-700',
    color: '#000',
  },
});
export default BoldText;
