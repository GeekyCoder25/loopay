import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppContext } from '../../../components/AppContext';
import InputPin from '../../../components/InputPin';
import { postFetchData } from '../../../../utils/fetchAPI';

const TransferAirtime = ({ navigation, route }) => {
  const { formData } = route.params;
  const { setWalletRefresh } = useContext(AppContext);
  const handlePay = async setErrorMessage => {
    const response = await postFetchData(`user/${formData.type}`, formData);
    if (!response.status || response.status !== 200) {
      setErrorMessage(response.data.message || response.data);
      return response.data;
    }
    setWalletRefresh(prev => !prev);
    navigation.navigate('Success', {
      airtime: { ...formData, reference: response.data.reference },
      amountInput: response.data.transaction?.amount || formData.amount,
      dataPlan: formData.plan?.value || undefined,
      transaction: response.data.transaction,
    });
    return response.status;
  };

  return (
    <View style={styles.content}>
      <InputPin customFunc={handlePay} />
    </View>
  );
};

const styles = StyleSheet.create({
  backContainer: {
    backgroundColor: '#1e1e1e',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingLeft: 2 + '%',
    width: 100 + '%',
    paddingVertical: 5,
    paddingTop: 10,
  },
  backText: {
    fontFamily: 'OpenSans-600',
    color: '#fff',
    fontSize: 18,
  },
  headerContainer: {
    width: 100 + '%',
    paddingHorizontal: 5 + '%',
    backgroundColor: '#1e1e1e',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 30,
  },
  pinHeader: {
    fontSize: 18,
    marginTop: 10,
    color: '#fff',
  },
  userIconContainer: {
    marginVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  networkIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#eee',
  },
  userIconStyle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#979797',
  },
  pinPhone: {
    color: '#fff',
  },
  modalBorder: {
    backgroundColor: '#ddd',
    height: 6,
    width: 30 + '%',
    borderRadius: 3,
    maxWidth: 120,
  },
  content: {
    paddingHorizontal: 5 + '%',
    paddingBottom: 40,
  },
  footer: {
    marginTop: 50,
  },
});
export default TransferAirtime;
