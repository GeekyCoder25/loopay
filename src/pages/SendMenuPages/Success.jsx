import React, { useContext, useEffect } from 'react';
import PageContainer from '../../components/PageContainer';
import { BackHandler, StyleSheet, View } from 'react-native';
import BoldText from '../../components/fonts/BoldText';
import Check from '../../../assets/images/check.svg';
import Button from '../../components/Button';
import FooterCard from '../../components/FooterCard';
import { useFocusEffect } from '@react-navigation/native';
import { AppContext } from '../../components/AppContext';
import { Audio } from 'expo-av';

const Success = ({ navigation, route }) => {
  const { isAdmin } = useContext(AppContext);
  const { userToSendTo, amountInput, fee, airtime, dataPlan } = route.params;

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => navigation.popToTop();

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => subscription.remove();
    }, [navigation]),
  );

  useEffect(() => {
    const playSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../../../assets/success.mp3'),
      );
      await sound.playAsync();
    };
    playSound();
  }, []);

  const handleHome = () => {
    if (isAdmin) {
      return navigation.navigate('Dashboard');
    }
    navigation.popToTop();
    navigation.navigate('HomeNavigator');
    navigation.navigate('Home');
  };

  return (
    <PageContainer>
      <View style={styles.header}>
        <Check />
        <BoldText style={styles.headerText}>Transaction Successful</BoldText>
      </View>
      <View style={styles.footer}>
        <FooterCard
          userToSendTo={userToSendTo}
          amountInput={amountInput}
          fee={fee || null}
          airtime={airtime}
          dataPlan={dataPlan}
        />
      </View>
      <View style={styles.button}>
        <Button text={'Back Home'} onPress={handleHome} />
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    gap: 30,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 18,
  },
  footer: {
    flex: 1,
    marginHorizontal: 5 + '%',
    marginTop: 50,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
  },
});
export default Success;
