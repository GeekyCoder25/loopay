/* eslint-disable react-native/no-inline-styles */
import { useContext, useEffect, useState } from 'react';
import PageContainer from '../../components/PageContainer';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import BoldText from '../../components/fonts/BoldText';
import {
  deleteFetchData,
  getFetchData,
  postFetchData,
} from '../../../utils/fetchAPI';
import { allCurrencies } from '../../database/data';
import { AppContext } from '../../components/AppContext';
import RegularText from '../../components/fonts/RegularText';
import ToastMessage from '../../components/ToastMessage';
import InputPin from '../../components/InputPin';

const Proofs = () => {
  const { walletRefresh } = useContext(AppContext);
  const [proofs, setProofs] = useState([]);
  const [requestPin, setRequestPin] = useState(false);
  const [customFunc, setCustomFunc] = useState(null);
  const [proof, setProof] = useState(null);

  useEffect(() => {
    const getProofs = async () => {
      const response = await getFetchData('admin/proof');
      if (response.status === 200) {
        setProofs(response.data.data);
      }
    };
    getProofs();
  }, [walletRefresh]);

  const handleApprove = async () => {
    const response = await postFetchData('admin/approve', proof);
    if (response.status === 200) {
      setProofs(prev =>
        prev.filter(indexProof => indexProof._id !== response.data?.data?._id),
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
        prev.filter(indexProof => indexProof._id !== response.data?.data?._id),
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
        prev.filter(indexProof => indexProof._id !== response.data?.data?._id),
      );
      ToastMessage('Transaction Declined');
      return setRequestPin(false);
    }
    ToastMessage(response.data);
  };

  return (
    <PageContainer padding scroll>
      <BoldText style={styles.headerText}>Payment proofs</BoldText>
      {requestPin ? (
        <InputPin
          handleCancel={() => setRequestPin(false)}
          customFunc={() => customFunc()}
        />
      ) : (
        <View>
          {proofs.length ? (
            proofs.map(proofIndex => (
              <Proof
                key={proofIndex._id}
                proof={proofIndex}
                requestPin={requestPin}
                setRequestPin={setRequestPin}
                setProof={setProof}
                setCustomFunc={setCustomFunc}
                handleApprove={handleApprove}
                handleDecline={handleDecline}
                handleRequest={handleRequest}
              />
            ))
          ) : (
            <BoldText>No proofs has been submitted</BoldText>
          )}
        </View>
      )}
    </PageContainer>
  );
};

const styles = StyleSheet.create({
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
    minWidth: 30 + '%',
  },
  decline: {
    backgroundColor: 'red',
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    minWidth: 30 + '%',
  },
  request: {
    backgroundColor: 'orange',
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    minWidth: 30 + '%',
  },
});

export default Proofs;

const Proof = ({
  proof,
  handleApprove,
  handleDecline,
  setCustomFunc,
  setRequestPin,
  setProof,
}) => {
  const { accNo, amount, email, image, message, tagName, userData, createdAt } =
    proof;

  const symbol = allCurrencies.find(
    ({ acronym, currency }) =>
      currency === proof.currency || acronym === proof.currency,
  ).symbol;

  const handleRequest = () => {};

  return (
    <View style={styles.proof}>
      <BoldText style={styles.amount}>
        {symbol}
        {amount}
      </BoldText>
      <BoldText>
        Email: <RegularText>{email}</RegularText>
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
        <RegularText>{userData.verificationStatus}</RegularText>
      </BoldText>
      <BoldText>
        Date: <RegularText>{new Date(createdAt).toDateString()}</RegularText>
      </BoldText>
      <BoldText>
        Time: <RegularText>{new Date(createdAt).toTimeString()}</RegularText>
      </BoldText>
      <View style={styles.row}>
        <BoldText>Image Proof:</BoldText>
        <Pressable onPress={() => Linking.openURL(image)}>
          <RegularText style={styles.link}>click here</RegularText>
        </Pressable>
      </View>

      <View style={styles.buttons}>
        <Pressable
          onPress={() => {
            setRequestPin(true);
            setProof(proof);
            setCustomFunc(() => handleApprove);
          }}
          style={styles.approve}>
          <BoldText style={{ color: '#fff' }}>Approve</BoldText>
        </Pressable>
        <Pressable
          onPress={() => {
            setRequestPin(true);
            setProof(proof);
            setCustomFunc(() => handleDecline);
          }}
          style={styles.decline}>
          <BoldText style={{ color: '#fff' }}>Decline</BoldText>
        </Pressable>
        <Pressable onPress={handleRequest} style={styles.request}>
          <BoldText style={{ color: '#fff' }}>Request more</BoldText>
        </Pressable>
      </View>
    </View>
  );
};
