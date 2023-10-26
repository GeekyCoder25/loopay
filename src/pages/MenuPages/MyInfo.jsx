import React, { useContext, useState } from 'react';
import {
  Clipboard,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import PageContainer from '../../components/PageContainer';
import BoldText from '../../components/fonts/BoldText';
import RegularText from '../../components/fonts/RegularText';
import { AppContext } from '../../components/AppContext';
import Button from '../../components/Button';
import { postFetchData } from '../../../utils/fetchAPI';
import ToastMessage from '../../components/ToastMessage';

const MyInfo = () => {
  const [isEditable, setIsEditable] = useState(false);
  const { appData, setAppData, setIsLoading } = useContext(AppContext);
  const [inputFocus, setInputFocus] = useState('');
  const {
    fullName,
    firstName,
    lastName,
    address,
    zipCode,
    city,
    state,
    dob,
    phoneNumber,
  } = appData.userProfile;
  const [userProfile, setUserProfile] = useState({
    firstName,
    lastName,
    address,
    zipCode,
    city,
    state,
    dob,
  });

  const handleChange = text => {
    setUserProfile(prev => {
      return { ...prev, [inputFocus]: text };
    });
  };
  const handleFocus = value => {
    setInputFocus(value);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const fetchedResult = await postFetchData('user/profile', userProfile);
      const { data: result } = fetchedResult;
      if (fetchedResult.status >= 400) {
        return ToastMessage('Error updating profile');
      }
      ToastMessage('Profile updated successfully');
      setAppData(prev => {
        return {
          ...prev,
          userProfile: result,
        };
      });
    } catch (err) {
      ToastMessage(err.message);
      console.log(err);
    } finally {
      setIsEditable(false);
      setIsLoading(false);
      setInputFocus('');
    }
  };

  return (
    <PageContainer justify={true} style={styles.container} scroll>
      <BoldText style={styles.headerText}>Personal information</BoldText>

      <View style={styles.tagContainer}>
        <View>
          <RegularText style={styles.label}>Your unique Loopay tag</RegularText>
          <BoldText style={styles.tagName}>#{appData.tagName}</BoldText>
        </View>
        <Pressable
          style={styles.copy}
          onPress={() => {
            Clipboard.setString(`#${appData.tagName}`);
            ToastMessage('Copied to clipboard');
          }}>
          <BoldText style={styles.copyText}>Copy</BoldText>
        </Pressable>
      </View>
      <View style={styles.tagContainer}>
        <View>
          <RegularText style={styles.label}>Full Name</RegularText>
          <BoldText style={styles.tagName}>{fullName}</BoldText>
        </View>
        <Pressable
          style={styles.copy}
          onPress={() => {
            Clipboard.setString(fullName);
            ToastMessage('Copied to clipboard');
          }}>
          <BoldText style={styles.copyText}>Copy</BoldText>
        </Pressable>
      </View>
      <RegularText>Account No: {phoneNumber.slice(4)}</RegularText>
      <RegularText style={styles.label}>Phone No: {phoneNumber}</RegularText>
      {!isEditable && (
        <Pressable onPress={() => setIsEditable(true)} style={styles.edit}>
          <BoldText style={styles.editText}>Edit Profile</BoldText>
        </Pressable>
      )}
      <View style={styles.form}>
        <View style={styles.row}>
          <View style={styles.field}>
            <BoldText>Last name</BoldText>
            <TextInput
              name="lastName"
              value={userProfile.lastName}
              onChangeText={text => handleChange(text)}
              style={
                inputFocus === 'lastName' ? styles.inputFocus : styles.input
              }
              editable={isEditable}
              onFocus={() => handleFocus('lastName')}
            />
          </View>
          <View style={styles.field}>
            <BoldText>First name</BoldText>
            <TextInput
              name="firstName"
              value={userProfile.firstName}
              onChangeText={text => handleChange(text)}
              style={
                inputFocus === 'firstName' ? styles.inputFocus : styles.input
              }
              editable={isEditable}
              onFocus={() => handleFocus('firstName')}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.field}>
            <BoldText>Address</BoldText>
            <TextInput
              name="address"
              value={userProfile.address}
              onChangeText={text => handleChange(text)}
              style={
                inputFocus === 'address' ? styles.inputFocus : styles.input
              }
              editable={isEditable}
              onFocus={() => handleFocus('address')}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.field}>
            <BoldText>Zip</BoldText>
            <TextInput
              name="zipCode"
              value={userProfile.zipCode?.toString()}
              onChangeText={text => handleChange(text)}
              style={
                inputFocus === 'zipCode' ? styles.inputFocus : styles.input
              }
              editable={isEditable}
              onFocus={() => handleFocus('zipCode')}
            />
          </View>
          <View style={styles.field}>
            <BoldText>City</BoldText>
            <TextInput
              name="city"
              value={userProfile.city}
              onChangeText={text => handleChange(text)}
              style={inputFocus === 'city' ? styles.inputFocus : styles.input}
              editable={isEditable}
              onFocus={() => handleFocus('city')}
            />
          </View>
          <View style={styles.field}>
            <BoldText>State</BoldText>
            <TextInput
              name="state"
              value={userProfile.state}
              onChangeText={text => handleChange(text)}
              style={inputFocus === 'state' ? styles.inputFocus : styles.input}
              editable={isEditable}
              onFocus={() => handleFocus('state')}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.field}>
            <BoldText>Date of Birth</BoldText>
            <TextInput
              name="dob"
              value={userProfile.dob}
              onChangeText={text => handleChange(text)}
              style={inputFocus === 'dob' ? styles.inputFocus : styles.input}
              editable={isEditable}
              onFocus={() => handleFocus('dob')}
            />
          </View>
        </View>
      </View>
      {isEditable ? (
        <Button
          onPress={handleSave}
          text={'Save Changes'}
          style={styles.button}
        />
      ) : (
        <View style={styles.button} />
      )}
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: { padding: 5 + '%' },
  headerText: {
    fontSize: 25,
    marginBottom: 20,
  },
  tagContainer: {
    backgroundColor: '#EEEEEE',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  copy: {
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  copyText: {
    color: '#fff',
  },

  label: {
    color: '#868585',
    marginBottom: 5,
  },
  tagName: {
    fontSize: 16,
  },
  edit: {
    alignSelf: 'flex-end',
    backgroundColor: '#1c1c1c',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: 20,
  },
  editText: {
    color: '#fff',
  },
  form: { marginVertical: 50, gap: 50 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 30,
  },
  field: {
    flex: 1,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#525252',
    color: '#525252',
    fontFamily: 'OpenSans-500',
    fontSize: 15,
    marginTop: 8,
  },
  inputFocus: {
    borderBottomWidth: 1,
    borderBottomColor: '#525252',
    color: '#000',
    fontFamily: 'OpenSans-500',
    fontSize: 15,
    marginTop: 8,
  },
  dob: { marginTop: 15 },
  button: {
    marginBottom: 50,
  },
});
export default MyInfo;
