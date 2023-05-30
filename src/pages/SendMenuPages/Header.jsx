import BackArrow from '../../../assets/images/backArrrow.svg';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import HideTabBar from '../../../utils/HideTabBar';

const SendMenuHeader = ({ goBack, onPress, route }) => {
  const decision = () => {
    const hideTabRoutes = ['AddMoney', 'AddMoneyConfirm'];
    if (hideTabRoutes.includes(route.name)) return false;
  };

  HideTabBar(decision());

  return (
    <View style={styles.container}>
      <Pressable
        onPress={!onPress ? () => goBack() : onPress}
        style={styles.container}>
        <BackArrow />
        <Text style={styles.text}>Back</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  text: {
    fontFamily: 'OpenSans-600',
    fontSize: 18,
  },
});
export default SendMenuHeader;
