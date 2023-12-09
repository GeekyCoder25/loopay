import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import PageContainer from '../../../components/PageContainer';
import BoldText from '../../../components/fonts/BoldText';
import { useRequestFundsContext } from '../../../context/RequestContext';
import UserIcon from '../../../components/UserIcon';
import RegularText from '../../../components/fonts/RegularText';
import { addingDecimal } from '../../../../utils/AddingZero';
import { allCurrencies } from '../../../database/data';

const PendingRequest = ({ navigation }) => {
  const { requestFunds: requests } = useRequestFundsContext();

  return (
    <PageContainer style={styles.container} scroll>
      <BoldText style={styles.headerText}>
        Pending Request{requests.length > 1 && 's'}
      </BoldText>
      <View style={styles.body}>
        {requests.length ? (
          requests.map(request => (
            <Pressable
              key={request._id}
              style={styles.request}
              onPress={() =>
                navigation.navigate('RequestStatus', {
                  ...request,
                  symbol: allCurrencies.find(
                    currency => currency.currency === request.currency,
                  ).symbol,
                })
              }>
              <UserIcon uri={request.requesterPhoto} />
              <View>
                <BoldText>{request.requesterName}</BoldText>
                <RegularText>
                  Requested the sum of{' '}
                  {
                    allCurrencies.find(
                      currency => currency.currency === request.currency,
                    ).symbol
                  }
                  {addingDecimal(Number(request.amount).toLocaleString())}
                </RegularText>
                <RegularText>{request.description}</RegularText>
              </View>
              <View style={styles.time}>
                <RegularText>
                  {new Date(request.createdAt).toLocaleDateString()}
                </RegularText>
                <RegularText>
                  {new Date(request.createdAt).toLocaleTimeString()}
                </RegularText>
              </View>
            </Pressable>
          ))
        ) : (
          <View style={styles.headerText}>
            <BoldText>There&apos;s no new request</BoldText>
          </View>
        )}
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {},
  headerText: {
    paddingHorizontal: 5 + '%',
    fontSize: 20,
  },
  body: {
    marginVertical: 30,
  },
  request: {
    backgroundColor: '#eee',
    width: 100 + '%',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    padding: 10,
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  time: {
    flex: 1,
    alignItems: 'flex-end',
  },
});

export default PendingRequest;
