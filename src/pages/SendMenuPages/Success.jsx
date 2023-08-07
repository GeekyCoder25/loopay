import React from 'react';
import PageContainer from '../../components/PageContainer';
import { StyleSheet, View } from 'react-native';
import BoldText from '../../components/fonts/BoldText';
import Check from '../../../assets/images/check.svg';
import Button from '../../components/Button';
import FooterCard from '../../components/FooterCard';

const Success = ({ navigation, route }) => {
  return (
    <PageContainer>
      <View style={styles.header}>
        <Check />
        <BoldText style={styles.headerText}>Transaction Successful</BoldText>
      </View>
      <View style={styles.footer}>
        <FooterCard
          userToSendTo={route.params.userToSendTo}
          amountInput={route.params.amountInput}
        />
      </View>
      <Button
        text={'Back Home'}
        onPress={() => {
          navigation.popToTop();
          navigation.navigate('HomeNavigator');
        }}
      />
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    gap: 30,
    alignItems: 'center',
    marginTop: 50,
  },
  headerText: {
    fontSize: 18,
  },
  footer: {
    marginHorizontal: 5 + '%',
    marginTop: 50,
  },
});
export default Success;
