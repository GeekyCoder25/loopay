import { StyleSheet, Text, View } from 'react-native';

const Header = ({ title, text }) => {
  return (
    <View style={styles.headers}>
      <Text style={styles.heading}>{title}</Text>
      <Text>{text}</Text>
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
    fontWeight: '600',
  },
});
export default Header;
