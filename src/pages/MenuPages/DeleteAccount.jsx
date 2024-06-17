import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import BoldText from '../../components/fonts/BoldText';
import PageContainer from '../../components/PageContainer';
import RegularText from '../../components/fonts/RegularText';
import Button from '../../components/Button';
import { AppContext } from '../../components/AppContext';
import { getSessionID, logoutUser } from '../../../utils/storage';
import { allCurrencies } from '../../database/data';
import ToastMessage from '../../components/ToastMessage';
import InputPin from '../../components/InputPin';
import useFetchData from '../../../utils/fetchAPI';
import Back from '../../components/Back';

const DeleteAccount = ({ navigation }) => {
  const { deleteFetchData } = useFetchData();
  const {
    setIsLoading,
    setIsLoggedIn,
    appData,
    setAppData,
    setCanChangeRole,
    setVerified,
  } = useContext(AppContext);
  const { email } = appData;
  const [confirmPin, setConfirmPin] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const sessionID = await getSessionID();
      await deleteFetchData(`user/session/${sessionID}`);
      setVerified(false);
      logoutUser();
      setIsLoggedIn(false);
      setAppData({});
      setCanChangeRole(false);
      allCurrencies.shift();
      ToastMessage('Account deleted successfully');
    } finally {
      setIsLoading(false);
    }
  };
  const handleDelete = async () => {
    try {
      const response = await deleteFetchData(`user/delete-account/${email}`);
      if (response.status === 200) {
        handleLogout();
        return response.status;
      }
      return response.data;
    } catch (error) {
      ToastMessage(error.message);
    }
  };

  return !confirmPin ? (
    <>
      <Back goBack={navigation.goBack} />
      <PageContainer padding scroll>
        <BoldText style={styles.headerText}>
          Account Deletion Confirmation
        </BoldText>
        <RegularText>
          Before proceeding, we want to ensure you&apos;re fully informed about
          this decision.
        </RegularText>
        <BoldText style={styles.subHeaderText}>
          Consequences of Deleting Your Account
        </BoldText>
        <View style={styles.row}>
          <BoldText>Loss of Data</BoldText>
          <RegularText>
            Deleting your account will result in the permanent loss of all
            account data, including transaction history and preferences.
          </RegularText>
        </View>
        <View style={styles.row}>
          <BoldText>Irreversible Action</BoldText>
          <RegularText>
            This action is irreversible and cannot be undone. Your profile,
            settings, and access will be removed entirely from our platform.
          </RegularText>
        </View>
        <View style={styles.row}>
          <BoldText>Confirm Deletion</BoldText>
          <RegularText>
            Are you sure you want to proceed with deleting your account?
          </RegularText>
          <View style={styles.buttons}>
            <Button text={'Cancel'} onPress={() => navigation.goBack()} />
            <Button
              text={'Confirm'}
              style={styles.confirm}
              color={'#000'}
              onPress={() => setConfirmPin(true)}
            />
          </View>
        </View>
      </PageContainer>
    </>
  ) : (
    <InputPin
      customFunc={handleDelete}
      disableBiometric
      handleCancel={() => setConfirmPin(false)}
    />
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: 18,
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 16,
    marginVertical: 10,
  },
  row: {
    marginVertical: 10,
  },
  buttons: { marginVertical: 30 },
  confirm: {
    backgroundColor: '#fff',
    borderWidth: 1,
  },
});
export default DeleteAccount;
