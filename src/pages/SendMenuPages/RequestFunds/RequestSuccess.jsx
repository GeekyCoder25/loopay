import PageContainer from '../../../components/PageContainer';
import Check from '../../../../assets/images/check.svg';
import { StyleSheet, View } from 'react-native';
import BoldText from '../../../components/fonts/BoldText';
import Button from '../../../components/Button';
import RegularText from '../../../components/fonts/RegularText';
import { useEffect } from 'react';
import { Audio } from 'expo-av';

const RequestSuccess = ({ navigation, route }) => {
  const { amount, symbol, tagName } = route.params;

  const handleHome = () => {
    navigation.popToTop();
    navigation.navigate('HomeNavigator');
  };

  useEffect(() => {
    const playSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../../../../assets/success.mp3'),
      );
      await sound.playAsync();
    };
    playSound();
  }, []);

  return (
    <PageContainer style={styles.container}>
      <View style={styles.header}>
        <Check />
        <BoldText style={styles.headerText}>Request Successful</BoldText>
      </View>
      <View style={styles.body}>
        <RegularText style={styles.topText}>
          You’ve successfully requested the sum of{' '}
          {symbol + amount.toLocaleString()} from
          <BoldText> #{tagName}</BoldText>
        </RegularText>
      </View>
      <RegularText style={styles.bottomText}>
        You’ll be notified when
        <BoldText> #{tagName} </BoldText>
        accept or reject your request
      </RegularText>
      <View style={styles.button}>
        <Button text={'Back Home'} onPress={handleHome} />
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5 + '%',
  },
  header: {
    gap: 30,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 18,
  },
  topText: {
    marginVertical: 5 + '%',
    fontSize: 20,
    textAlign: 'center',
  },
  bottomText: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: 16,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
  },
});
export default RequestSuccess;
