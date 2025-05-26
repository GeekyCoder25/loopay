import BackArrow from '../../assets/images/backArrow.svg';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useContext } from 'react';
import RegularText from './fonts/RegularText';
import { AppContext } from './AppContext';

const Back = ({ goBack, onPress }) => {
  const { isAdmin, setIsAdmin, canChangeRole } = useContext(AppContext);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Pressable
          onPress={!onPress ? () => goBack() : onPress}
          style={styles.container}>
          <BackArrow />
          <Text style={styles.text}>Back</Text>
        </Pressable>
        {canChangeRole && (
          <Pressable
            style={styles.switch}
            onPress={() => setIsAdmin(prev => !prev)}>
            <RegularText style={styles.switchText}>
              Switch to {isAdmin ? 'User' : 'Admin'}
            </RegularText>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
    padding: 8,
  },
  text: {
    fontFamily: 'OpenSans-600',
    fontSize: 18,
    color: '#000',
  },
});
export default Back;
