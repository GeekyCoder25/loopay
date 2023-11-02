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
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';

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

  const handleShare = async () => {
    const html = String.raw` <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <title>Loopay Statement</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
      </head>
      <body>
        <h1>Transaction receipt to be created with html and css</h1>
      </body>
    </html>`;
    createPDF(html);
  };

  const createPDF = async html => {
    const { uri } = await printToFileAsync({ html });
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  };

  const handleHome = () => {
    if (isAdmin) {
      return navigation.navigate('Dashboard');
    }
    navigation.popToTop();
    navigation.navigate('HomeNavigator');
    navigation.navigate('Home');
  };

  return (
    <PageContainer scroll>
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
        <Button text={'Share Receipt'} onPress={handleShare} />
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
