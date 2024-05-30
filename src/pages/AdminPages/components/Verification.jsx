/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import BoldText from '../../../components/fonts/BoldText';
import useFetchData from '../../../../utils/fetchAPI';
import { AppContext } from '../../../components/AppContext';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import RegularText from '../../../components/fonts/RegularText';
import Button from '../../../components/Button';
import FaIcon from '@expo/vector-icons/FontAwesome';
import ToastMessage from '../../../components/ToastMessage';
import ErrorMessage from '../../../components/ErrorMessage';
import * as Linking from 'expo-linking';
import Back from '../../../components/Back';

const Verification = ({ route, modalOpen, setModalOpen }) => {
  const { getFetchData, putFetchData } = useFetchData();
  const {
    country,
    email,
    idType,
    idValue,
    front,
    back,
    status,
    _id,
    faceVideo,
  } = route;
  const { setIsLoading, vw } = useContext(AppContext);
  const [userData, setUserData] = useState(null);
  const [openMessageModal, setOpenMessageModal] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      const response = await getFetchData(`admin/user/${email}`);
      if (response.status === 200) {
        return setUserData(response.data);
      }
      ToastMessage(response.data);
    };
    getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  const handleImageClick = image => {
    Linking.openURL(image);
  };

  const handleVerify = async option => {
    try {
      if (option === 'email') {
        return setOpenMessageModal(true);
      }
      setIsLoading(true);
      const response = await putFetchData(
        `admin/verification?${option}`,
        route,
      );
      if (response.status === 200) {
        ToastMessage('Success');
        setModalOpen(false);
      }
    } catch (error) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer padding scroll>
      <View>
        <BoldText style={styles.containerText}>User Details</BoldText>
        <View style={styles.containerSub}>
          <View style={styles.detailsRow}>
            <FaIcon name="circle" color={'#1e1e1e'} style={styles.fas} />
            <RegularText>Email:</RegularText>
            <BoldText>{email}</BoldText>
          </View>
          <View style={styles.detailsRow}>
            <FaIcon name="circle" color={'#1e1e1e'} style={styles.fas} />
            <RegularText>First Name:</RegularText>
            <BoldText>{userData?.userProfile.firstName}</BoldText>
          </View>
          <View style={styles.detailsRow}>
            <FaIcon name="circle" color={'#1e1e1e'} style={styles.fas} />
            <RegularText>Last Name:</RegularText>
            <BoldText>{userData?.userProfile.lastName}</BoldText>
          </View>
          <View style={styles.detailsRow}>
            <FaIcon name="circle" color={'#1e1e1e'} style={styles.fas} />
            <RegularText>Phone Number:</RegularText>
            <BoldText>{userData?.userProfile.phoneNumber}</BoldText>
          </View>
          <View style={styles.detailsRow}>
            <FaIcon name="circle" color={'#1e1e1e'} style={styles.fas} />
            <RegularText>Country:</RegularText>
            <BoldText>{userData?.country.name}</BoldText>
          </View>
          <View style={styles.detailsRow}>
            <FaIcon name="circle" color={'#1e1e1e'} style={styles.fas} />
            <RegularText>Currency Code:</RegularText>
            <BoldText>{userData?.localCurrencyCode}</BoldText>
          </View>
          <View style={styles.detailsRow}>
            <FaIcon name="circle" color={'#1e1e1e'} style={styles.fas} />
            <RegularText>Registered on:</RegularText>
            <BoldText>{new Date(userData?.createdAt).toDateString()}</BoldText>
          </View>
        </View>
      </View>
      <View style={styles.gap} />
      <View style={styles.container}>
        <BoldText style={styles.containerText}>
          Submitted Verification ID
        </BoldText>
        <View style={styles.containerSub}>
          <View style={styles.detailsRow}>
            <FaIcon name="circle" color={'#1e1e1e'} style={styles.fas} />
            <RegularText>Type:</RegularText>
            <BoldText>{idType}</BoldText>
          </View>
          <View style={styles.detailsRow}>
            <FaIcon name="circle" color={'#1e1e1e'} style={styles.fas} />
            <RegularText>Country:</RegularText>
            <BoldText>{country}</BoldText>
          </View>
          {idValue && (
            <View style={styles.detailsRow}>
              <FaIcon name="circle" color={'#1e1e1e'} style={styles.fas} />
              <RegularText>ID Number:</RegularText>
              <BoldText>{idValue}</BoldText>
            </View>
          )}
          <View style={styles.detailsRow}>
            <FaIcon name="circle" color={'#1e1e1e'} style={styles.fas} />
            <RegularText>Status:</RegularText>
            <BoldText style={styles.status}>{status}</BoldText>
          </View>
          {faceVideo && (
            <View style={styles.detailsRow}>
              <FaIcon name="circle" color={'#1e1e1e'} style={styles.fas} />
              <RegularText>Face Data:</RegularText>
              <Pressable onPress={() => Linking.openURL(faceVideo)}>
                <BoldText style={{ ...styles.status, ...styles.link }}>
                  Click here
                </BoldText>
              </Pressable>
            </View>
          )}

          {front && (
            <View style={styles.detailsColumn}>
              <View style={styles.detailsRow}>
                <FaIcon name="circle" color={'#1e1e1e'} style={styles.fas} />
                <RegularText>Front Image:</RegularText>
              </View>
              <View style={styles.gap} />
              <Pressable onPress={() => handleImageClick(front)}>
                <Image
                  source={{ uri: front }}
                  style={{ width: vw * 0.91, height: vw * 0.91 }}
                />
              </Pressable>
              <View style={styles.gap} />
            </View>
          )}
          {back && (
            <View style={styles.detailsColumn}>
              <View style={styles.detailsRow}>
                <FaIcon name="circle" color={'#1e1e1e'} style={styles.fas} />
                <RegularText>Back Image:</RegularText>
              </View>
              <View style={styles.gap} />
              <Pressable onPress={() => handleImageClick(back)}>
                <Image
                  source={{ uri: back }}
                  style={{ width: vw * 0.91, height: vw * 0.91 }}
                />
              </Pressable>
              <View style={styles.gap} />
            </View>
          )}
        </View>
      </View>
      <View style={styles.gap} />
      <View>
        <Button text={'Approve'} onPress={() => handleVerify('approve')} />
        <Button
          text={'Decline with email'}
          onPress={() => handleVerify('email')}
        />
        <Button text={'Decline'} onPress={() => handleVerify('decline')} />
        <Button
          text={'Decline and Delete'}
          onPress={() => handleVerify('delete')}
        />
        <View style={styles.gap} />
      </View>
      <MessageModal
        showModal={openMessageModal}
        setShowModal={setOpenMessageModal}
        data={{ email, _id }}
        setModalOpen={setModalOpen}
      />
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  detailsRow: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  status: {
    textTransform: 'capitalize',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  containerText: { fontSize: 18 },
  containerSub: { padding: 10, gap: 10 },
  gap: {
    height: 30,
  },
  fas: {
    marginRight: 5,
  },
  label: {
    fontFamily: 'OpenSans-600',
    color: '#868585',
  },
  textInputContainer: {
    position: 'relative',
    marginTop: 5,
    marginBottom: 40,
  },
  textInput: {
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    height: 50,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    fontFamily: 'OpenSans-600',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  textInputMessage: {
    minHeight: 200,
  },
  form: {
    flex: 1,
    marginVertical: 30,
  },
  modalButton: {
    marginVertical: 40,
  },
  headerText: { marginVertical: 10, fontSize: 20 },
});

export default Verification;

const MessageModal = ({ showModal, setShowModal, data, setModalOpen }) => {
  const { putFetchData } = useFetchData();
  const { setIsLoading } = useContext(AppContext);
  const [errorKey, setErrorKey] = useState('');
  const [errorMessage, setErrorMessage] = useState();
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });
  const [inputFocus, setInputFocus] = useState(false);
  const handleSendMessage = async () => {
    try {
      if (!formData.message) {
        setErrorKey('message');
        return setErrorMessage('No message provided');
      }
      setIsLoading(true);
      const response = await putFetchData('admin/verification?email', {
        email: data.email,
        subject: formData.subject,
        message: formData.message,
      });
      if (response.status === 200) {
        ToastMessage('Success');
        setFormData({});
        setShowModal(false);
        return setModalOpen(false);
      }
      throw new Error(response.data?.error || response.data);
    } catch (error) {
      ToastMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Modal visible={showModal} onRequestClose={() => setShowModal(false)}>
      <Back onPress={() => setShowModal(false)} />
      <PageContainer padding paddingTop={30}>
        <BoldText style={styles.headerText}>Message Draft</BoldText>
        <View style={styles.form}>
          <Text style={styles.label}>Email Subject</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={{
                ...styles.textInput,
                borderColor: errorKey === 'subject' ? 'red' : '#ccc',
              }}
              onChangeText={text =>
                setFormData(prev => {
                  return {
                    ...prev,
                    subject: text,
                  };
                })
              }
              onFocus={() => setInputFocus(true)}
              onBlur={() => setInputFocus(false)}
              maxLength={24}
              placeholder="Account Verification"
            />
          </View>
          <Text style={styles.label}>Message</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={{
                ...styles.textInput,
                ...styles.textInputMessage,
                borderColor: errorKey === 'message' ? 'red' : '#ccc',
              }}
              onChangeText={text => {
                setFormData(prev => {
                  return {
                    ...prev,
                    message: text,
                  };
                });
                setErrorMessage('');
                setErrorKey('');
              }}
              onFocus={() => setInputFocus(true)}
              onBlur={() => setInputFocus(false)}
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>
        <ErrorMessage errorMessage={errorMessage} />
        {!inputFocus && (
          <Button
            text={'Send'}
            style={styles.modalButton}
            onPress={handleSendMessage}
          />
        )}
      </PageContainer>
    </Modal>
  );
};
