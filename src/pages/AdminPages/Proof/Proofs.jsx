/* eslint-disable react-native/no-inline-styles */
import { useCallback, useContext, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import BoldText from '../../../components/fonts/BoldText';
import {
  deleteFetchData,
  getFetchData,
  postFetchData,
} from '../../../../utils/fetchAPI';
import { allCurrencies } from '../../../database/data';
import { AppContext } from '../../../components/AppContext';
import RegularText from '../../../components/fonts/RegularText';
import ToastMessage from '../../../components/ToastMessage';
import InputPin from '../../../components/InputPin';
import { addingDecimal } from '../../../../utils/AddingZero';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Back from '../../../components/Back';
import UpRightArrow from '../../../../assets/images/arrow-up-right-from-square-outline.svg';

const Proofs = ({ navigation }) => {
  const { walletRefresh } = useContext(AppContext);
  const [proofs, setProofs] = useState([]);
  const [requestPin, setRequestPin] = useState(false);
  const [customFunc, setCustomFunc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const getProofs = async () => {
        try {
          setIsLoading(true);
          const response = await getFetchData('admin/proof');
          if (response.status === 200) {
            setProofs(response.data.data);
          }
        } finally {
          setIsLoading(false);
        }
      };
      getProofs();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [walletRefresh]),
  );

  if (isLoading) {
    return (
      <View style={styles.flex}>
        <ActivityIndicator color={'#1e1e1e'} size={'large'} />
      </View>
    );
  }

  return requestPin ? (
    <InputPin
      handleCancel={() => setRequestPin(false)}
      customFunc={() => customFunc()}
    />
  ) : (
    <>
      <Back onPress={() => navigation.goBack()} />
      <PageContainer padding scroll>
        <BoldText style={styles.headerText}>Submitted proofs</BoldText>
        <View>
          {proofs.length ? (
            proofs.map(proof => (
              <Proof
                key={proof._id}
                proof={proof}
                setCustomFunc={setCustomFunc}
                setRequestPin={setRequestPin}
                setProofs={setProofs}
              />
            ))
          ) : (
            <BoldText>No proofs has been submitted</BoldText>
          )}
        </View>
      </PageContainer>
    </>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    marginBottom: 20,
  },
  proof: {
    gap: 5,
    marginBottom: 30,
    elevation: 5,
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 5,
  },
  amount: {
    fontSize: 18,
  },
  row: {
    flexDirection: 'row',
    gap: 5,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
    textTransform: 'capitalize',
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    marginVertical: 10,
  },
  approve: {
    backgroundColor: 'green',
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    minWidth: 28 + '%',
  },
  decline: {
    backgroundColor: 'red',
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    minWidth: 28 + '%',
  },
  request: {
    backgroundColor: 'orange',
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    minWidth: 28 + '%',
  },
});

export default Proofs;

const Proof = ({ proof, setCustomFunc, setRequestPin, setProofs }) => {
  const {
    accNo,
    amount,
    email,
    image,
    message,
    tagName,
    type,
    userData,
    createdAt,
  } = proof;

  const navigation = useNavigation();
  const symbol = allCurrencies.find(
    ({ acronym, currency }) =>
      currency === proof.currency || acronym === proof.currency,
  ).symbol;

  const handleApprove = async () => {
    const response = await postFetchData('admin/approve', proof);
    if (response.status === 200) {
      setProofs(prev =>
        prev.filter(indexProof => indexProof._id !== proof._id),
      );
      ToastMessage('Transaction Approved');
      return setRequestPin(false);
    }
    ToastMessage(response.data);
  };

  const handleDecline = async () => {
    const response = await deleteFetchData(`admin/decline/${proof._id}`, proof);
    if (response.status === 200) {
      setProofs(prev =>
        prev.filter(indexProof => indexProof._id !== proof._id),
      );
      ToastMessage('Transaction Declined');
      return setRequestPin(false);
    }
    ToastMessage(response.data);
  };

  const handleRequest = async () => {
    const response = await deleteFetchData(`admin/decline/${proof._id}`, proof);
    if (response.status === 200) {
      setProofs(prev =>
        prev.filter(indexProof => indexProof._id !== proof._id),
      );
      ToastMessage('Transaction Declined');
      return setRequestPin(false);
    }
    ToastMessage(response.data);
  };

  const handlePress = () => {};

  return (
    <Pressable style={styles.proof} onPress={handlePress}>
      <BoldText style={styles.amount}>
        {symbol}
        {addingDecimal(Number(amount).toLocaleString())}
      </BoldText>
      <BoldText>
        Email:{' '}
        <RegularText>
          {email}
          <Pressable
            onPress={() =>
              navigation.navigate('UserDetails', { email: proof.email })
            }>
            <UpRightArrow />
          </Pressable>
        </RegularText>
      </BoldText>
      <BoldText>
        Tag Name: <RegularText>{tagName}</RegularText>
      </BoldText>
      <BoldText>
        Full Name : <RegularText>{userData.fullName}</RegularText>
      </BoldText>
      <BoldText>
        Message: <RegularText>{message}</RegularText>
      </BoldText>
      <BoldText>
        Account Number: <RegularText>{accNo}</RegularText>
      </BoldText>
      <BoldText>
        Verification Status:{' '}
        <RegularText style={styles.capitalize}>
          {userData.verificationStatus || 'unverified'}
        </RegularText>
      </BoldText>
      <BoldText>
        Country:{' '}
        <RegularText>
          {userData.country?.name + ', ' + userData.country?.code}
        </RegularText>
      </BoldText>
      <BoldText>
        Type: <RegularText style={styles.capitalize}>{type}</RegularText>
      </BoldText>
      <BoldText>
        Date: <RegularText>{new Date(createdAt).toDateString()}</RegularText>
      </BoldText>
      <BoldText>
        Time: <RegularText>{new Date(createdAt).toTimeString()}</RegularText>
      </BoldText>
      {type === 'transfer' && (
        <View style={styles.row}>
          <BoldText>Image Proof:</BoldText>
          <Pressable onPress={() => Linking.openURL(image)}>
            <RegularText style={styles.link}>click here</RegularText>
          </Pressable>
        </View>
      )}

      <View style={styles.buttons}>
        <Pressable
          onPress={() => {
            setRequestPin(true);
            setCustomFunc(() => handleApprove);
          }}
          style={styles.approve}>
          <BoldText style={{ color: '#fff' }}>Approve</BoldText>
        </Pressable>
        <Pressable
          onPress={() => {
            setRequestPin(true);
            setCustomFunc(() => handleDecline);
          }}
          style={styles.decline}>
          <BoldText style={{ color: '#fff' }}>Decline</BoldText>
        </Pressable>
        <Pressable onPress={handleRequest} style={styles.request}>
          <BoldText style={{ color: '#fff' }}>Request more</BoldText>
        </Pressable>
      </View>
    </Pressable>
  );
};
