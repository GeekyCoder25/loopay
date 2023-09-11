/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, View } from 'react-native';
import PageContainer from '../../../components/PageContainer';
import RegularText from '../../../components/fonts/RegularText';
import BoldText from '../../../components/fonts/BoldText';
import InputPin from '../../../components/InputPin';
import { addingDecimal } from '../../../../utils/AddingZero';
import ToastMessage from '../../../components/ToastMessage';
import { postFetchData } from '../../../../utils/fetchAPI';
import Button from '../../../components/Button';
import { useContext } from 'react';
import { AppContext } from '../../../components/AppContext';
import { randomUUID } from 'expo-crypto';

const PendingRequestConfirm = ({ navigation, route }) => {
  const { setWalletRefresh } = useContext(AppContext);
  const { createdAt, description, fee, symbol, requesterAccount } =
    route.params;

  const amount = Number(route.params.amount);

  const handleConfirm = async status => {
    try {
      if (status === 'accept') {
        const response = await postFetchData('user/request-confirm', {
          id: randomUUID(),
          status,
          ...route.params,
        });

        if (response.status === 200) {
          setWalletRefresh(prev => !prev);
          return navigation.replace('RequestStatus', {
            status,
            ...route.params,
          });
        }
        throw new Error(response.data);
      } else {
        return navigation.replace('RequestStatus', {
          status,
          ...route.params,
        });
      }
    } catch (err) {
      ToastMessage(err.message);
    }
  };

  return (
    <PageContainer style={styles.container} scroll>
      <RegularText style={styles.headerText}>
        <BoldText> #{requesterAccount} </BoldText>
        requested the sum of {symbol + amount.toLocaleString()}{' '}
      </RegularText>
      <InputPin
        buttonText={'Accept'}
        customFunc={() => handleConfirm('accept')}>
        <View style={styles.footerCard}>
          <BoldText style={styles.cardAmount}>
            {symbol + addingDecimal(amount.toLocaleString())}
          </BoldText>
          <View style={styles.footerCardDetails}>
            <View style={styles.cardLine}>
              <RegularText style={styles.cardKey}>Receiver</RegularText>
              <BoldText style={styles.cardValue}>#{requesterAccount}</BoldText>
            </View>
            <View style={styles.cardLine}>
              <RegularText style={styles.cardKey}>
                Amount to be debited
              </RegularText>
              <BoldText style={styles.cardValue}>
                {symbol + addingDecimal(amount.toLocaleString())}
              </BoldText>
            </View>
            <View style={styles.cardLine}>
              <RegularText style={styles.cardKey}>
                Amount to be sent
              </RegularText>
              <BoldText style={styles.cardValue}>
                {symbol + addingDecimal((amount - fee).toLocaleString())}
              </BoldText>
            </View>
            <View style={styles.cardLine}>
              <RegularText style={styles.cardKey}>Charges</RegularText>
              <BoldText
                style={{ ...styles.cardValue, color: fee ? 'red' : '#006E53' }}>
                {fee ? symbol + addingDecimal(fee.toLocaleString()) : 'free'}
              </BoldText>
            </View>
            <View style={styles.cardLine}>
              <RegularText style={styles.cardKey}>Date requested</RegularText>
              <BoldText style={styles.cardValue}>
                {new Date(createdAt).toDateString()}
              </BoldText>
            </View>
            <View style={styles.cardLine}>
              <RegularText style={styles.cardKey}>Time</RegularText>
              <BoldText style={styles.cardValue}>
                {new Date(createdAt)
                  .toLocaleTimeString()
                  .split(' ')[0]
                  .slice(0, -3) +
                  ' ' +
                  new Date(createdAt).toLocaleTimeString().split(' ')[1]}
              </BoldText>
            </View>
            <View style={styles.cardLine}>
              <RegularText style={styles.cardKey}>Reason</RegularText>
              <BoldText style={styles.cardValue}>{description}</BoldText>
            </View>
          </View>
        </View>
      </InputPin>
      <Button
        text={'Decline'}
        style={styles.button}
        color={'#000'}
        onPress={() => handleConfirm('decline')}
      />
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5 + '%',
    paddingBottom: 50,
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
  button: {
    backgroundColor: '#fff',
    color: '#000',
    borderWidth: 1,
  },
});

export default PendingRequestConfirm;
