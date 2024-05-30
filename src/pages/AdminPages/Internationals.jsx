import { Pressable, StyleSheet, View } from 'react-native';
import React, { useCallback, useContext, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import useFetchData from '../../../utils/fetchAPI';
import PageContainer from '../../components/PageContainer';
import RegularText from '../../components/fonts/RegularText';
import BoldText from '../../components/fonts/BoldText';
import ToastMessage from '../../components/ToastMessage';
import { AppContext } from '../../components/AppContext';
import { addingDecimal } from '../../../utils/AddingZero';

const Internationals = () => {
  const { getFetchData, putFetchData, deleteFetchData } = useFetchData();
  const { setIsLoading } = useContext(AppContext);
  const [internationalData, setInternationalData] = useState([]);
  useFocusEffect(
    useCallback(() => {
      const getInternational = async () => {
        const response = await getFetchData('admin/international');
        if (response.status === 200) {
          setInternationalData(response.data.data);
        }
      };
      getInternational();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );
  const handleComplete = async id => {
    try {
      setIsLoading(true);
      const response = await putFetchData(`admin/international/${id}`);
      if (response.status === 200) {
        setInternationalData(prev =>
          prev.filter(international => international._id !== id),
        );
        return ToastMessage('Transaction completed successfully');
      }
      throw new Error(response.data);
    } catch (error) {
      ToastMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCancel = async id => {
    try {
      setIsLoading(true);
      const response = await deleteFetchData(`admin/international/${id}`);
      if (response.status === 200) {
        setInternationalData(prev =>
          prev.filter(international => international._id !== id),
        );
        return ToastMessage('Transaction declined');
      }
      throw new Error(response.data);
    } catch (error) {
      ToastMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer padding paddingTop={30} scroll>
      <View>
        <BoldText>International Transfers</BoldText>
      </View>
      <View style={styles.lists}>
        {internationalData.map(international => (
          <View key={international._id} style={styles.list}>
            <View style={styles.listRow}>
              <RegularText style={styles.key}>Send Amount</RegularText>
              <BoldText style={styles.value}>
                {international.sendFrom.symbol}
                {addingDecimal(international.amount.toLocaleString())}
              </BoldText>
            </View>
            <View style={styles.listRow}>
              <RegularText style={styles.key}>Receive Amount</RegularText>
              <BoldText style={styles.value}>
                {international.sendTo.symbol}
                {addingDecimal(international.toReceiveAmount.toLocaleString())}
              </BoldText>
            </View>
            <View style={styles.listRow}>
              <RegularText style={styles.key}>Bank Name</RegularText>
              <BoldText style={styles.value}>
                {international.receiverBank}
              </BoldText>
            </View>
            <View style={styles.listRow}>
              <RegularText style={styles.key}>Account No</RegularText>
              <BoldText style={styles.value}>
                {international.receiverAccountNo}
              </BoldText>
            </View>
            <View style={styles.listRow}>
              <RegularText style={styles.key}>Account Name</RegularText>
              <BoldText style={styles.value}>
                {international.receiverName}
              </BoldText>
            </View>
            <View style={styles.listRow}>
              <RegularText style={styles.key}>Send From</RegularText>
              <BoldText style={styles.value}>
                {international.sendFrom.code}
              </BoldText>
            </View>
            <View style={styles.listRow}>
              <RegularText style={styles.key}>Send To</RegularText>
              <BoldText style={styles.value}>
                {international.sendTo.code}
              </BoldText>
            </View>
            <View style={styles.listRow}>
              <RegularText style={styles.key}>Rate</RegularText>
              <BoldText style={styles.value}>
                1 {international.rate.from} = {international.rate.rate}{' '}
                {international.rate.to}
              </BoldText>
            </View>
            <View style={styles.buttons}>
              <Pressable
                style={styles.activeButton}
                onPress={() => handleComplete(international._id)}>
                <BoldText style={styles.buttonText}>Mark Complete</BoldText>
              </Pressable>
              <Pressable
                style={styles.declineButton}
                onPress={() => handleCancel(international._id)}>
                <BoldText style={styles.buttonText}>Cancel</BoldText>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </PageContainer>
  );
};

export default Internationals;

const styles = StyleSheet.create({
  lists: {
    marginVertical: 30,
    rowGap: 30,
  },
  list: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#ddd',
    borderRadius: 30,
    paddingVertical: 20,
    rowGap: 10,
  },
  listRow: {
    marginHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  key: {
    flex: 1,
  },
  value: {
    flex: 1,
    textAlign: 'right',
  },
  buttons: {
    marginTop: 20,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 20,
  },
  activeButton: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 10,
  },
  declineButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
  },
});
