/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, View } from 'react-native';
import PageContainer from '../../../components/PageContainer';
import BoldText from '../../../components/fonts/BoldText';
import InputPin from '../../../components/InputPin';
import RegularText from '../../../components/fonts/RegularText';
import { addingDecimal } from '../../../../utils/AddingZero';
import { useState } from 'react';
import Button from '../../../components/Button';
import Back from '../../../components/Back';
import useFetchData from '../../../../utils/fetchAPI';

const RequestConfirm = ({ navigation, route }) => {
  const { postFetchData } = useFetchData();
  const { amount, fee, symbol, tagName, toReceive } = route.params;
  const [canContinue, setCanContinue] = useState(false);

  const handleConfirm = async () => {
    const response = await postFetchData('user/request', route.params);

    if (response.status === 200) {
      navigation.replace('RequestSuccess', { amount, symbol, tagName });
      return response.data;
    }
    return response.data;
  };

  return !canContinue ? (
    <>
      <Back onPress={() => navigation.goBack()} />
      <PageContainer style={styles.container} scroll>
        <RegularText style={styles.headerText}>
          You’re about to request the sum of {symbol + amount.toLocaleString()}{' '}
          from
          <BoldText> #{tagName}</BoldText>
        </RegularText>
        <Button text={'Continue'} onPress={() => setCanContinue(true)} />
      </PageContainer>
    </>
  ) : (
    <InputPin buttonText={'Confirm'} customFunc={handleConfirm}>
      <View style={styles.footerCard}>
        <BoldText style={styles.cardAmount}>
          {symbol + addingDecimal(amount.toLocaleString())}
        </BoldText>
        <View style={styles.footerCardDetails}>
          <View style={styles.cardLine}>
            <RegularText style={styles.cardKey}>Loopay user</RegularText>
            <BoldText style={styles.cardValue}>#{tagName}</BoldText>
          </View>
          <View style={styles.cardLine}>
            <RegularText style={styles.cardKey}>Amount</RegularText>
            <BoldText style={styles.cardValue}>
              {symbol + addingDecimal(amount.toLocaleString())}
            </BoldText>
          </View>
          <View style={styles.cardLine}>
            <RegularText style={styles.cardKey}>
              Amount to be received
            </RegularText>
            <BoldText style={styles.cardValue}>
              {symbol + addingDecimal(toReceive.toLocaleString())}
            </BoldText>
          </View>
          <View style={styles.cardLine}>
            <RegularText style={styles.cardKey}>Charges</RegularText>
            <BoldText
              style={{
                ...styles.cardValue,
                color: fee ? 'red' : '#006E53',
              }}>
              {fee
                ? symbol + addingDecimal(fee.toLocaleString())
                : symbol + '0.00'}
            </BoldText>
          </View>
        </View>
      </View>
    </InputPin>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5 + '%',
  },
  headerText: {
    marginTop: 10,
    marginBottom: 50,
    fontSize: 16,
    fontFamily: 'OpenSans-600',
    textAlign: 'center',
  },
  footerCard: {
    backgroundColor: '#efe2e2',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 5,
    marginVertical: 30,
  },
  footerCardDetails: {
    gap: 10,
    marginBottom: 10,
  },
  cardAmount: {
    marginTop: 10,
    fontSize: 24,
    marginBottom: 20,
  },
  cardLine: {
    flexDirection: 'row',
    width: 100 + '%',
  },
  cardKey: {
    flex: 1,
    color: '#525252',
    fontFamily: 'OpenSans-600',
  },
  cardValue: {
    flex: 1,
    textAlign: 'right',
    color: '#525252',
  },
});

export default RequestConfirm;
