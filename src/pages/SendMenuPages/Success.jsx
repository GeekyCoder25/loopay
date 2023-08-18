import React from 'react';
import PageContainer from '../../components/PageContainer';
import { BackHandler, StyleSheet, View } from 'react-native';
import BoldText from '../../components/fonts/BoldText';
import Check from '../../../assets/images/check.svg';
import Button from '../../components/Button';
import FooterCard from '../../components/FooterCard';
import { useFocusEffect } from '@react-navigation/native';

const Success = ({ navigation, route }) => {
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
        <Button
          text={'Back Home'}
          onPress={() => {
            navigation.popToTop();
            navigation.navigate('HomeNavigator');
          }}
        />
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    gap: 30,
    alignItems: 'center',
    marginTop: 50,
    flex: 1,
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
    justifyContent: 'flex-start',
  },
});
export default Success;
