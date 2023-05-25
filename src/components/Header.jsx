import { StyleSheet, Text, View } from 'react-native';
import RegularText from './fonts/RegularText';
import BoldText from './fonts/BoldText';

const Header = ({ title, text }) => {
  return (
    <View style={styles.headers}>
      <BoldText style={styles.heading}>{title}</BoldText>
      <RegularText>{text}</RegularText>
    </View>
  );
};
const styles = StyleSheet.create({
  headers: {
    gap: 10,
    marginBottom: 5 + '%',
  },
  heading: {
    fontSize: 25,
  },
});
export default Header;
