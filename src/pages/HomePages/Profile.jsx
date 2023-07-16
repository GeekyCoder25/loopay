import React, { useContext } from 'react';
import PageContainer from '../../components/PageContainer';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import BoldText from '../../components/fonts/BoldText';
import RegularText from '../../components/fonts/RegularText';
import Tag from '../../../assets/images/tag.svg';
import Button from '../../components/Button';
import { AppContext } from '../../components/AppContext';
import UserIcon from '../../components/UserIcon';
import FaIcon from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { apiUrl } from '../../../utils/fetchAPI';
import { getToken } from '../../../utils/storage';

const Profile = ({ navigation, children }) => {
  const { appData, setAppData } = useContext(AppContext);
  const { email } = appData;
  const { firstName, lastName } = appData.userProfile;
  const fullName = `${firstName} ${lastName}`;
  const uploadImage = async imageFile => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      const fileName = imageFile.split('/').pop();
      const fileType = fileName.split('.').pop();
      const formData = new FormData();
      formData.append('file', {
        uri: imageFile,
        name: fileName,
        type: `image/${fileType}`,
      });
      const token = await getToken();

      const options = {
        method: 'POST',
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      };
      const response = await fetch(`${apiUrl}/upload`, options);
      clearTimeout(timeout);
      const data = await response.text();
      const result = JSON.parse(data);

      if (response.ok) {
        const { photo, photoURL } = result;
        setAppData(prev => {
          return { ...prev, photo, photoURL };
        });
        ToastAndroid.show(
          'Profile Picture updated successfully',
          ToastAndroid.SHORT,
        );
      } else {
        const errormessage = result.message.includes(
          'Please upload an image less than',
        )
          ? result.message
          : 'Image upload failed';
        ToastAndroid.show(errormessage, ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show('Error uploading image', ToastAndroid.SHORT);
      console.log('Error uploading image:', error);
    }
  };

  const selectImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      return ToastAndroid.show(
        'Camera permission was denied by user',
        ToastAndroid.SHORT,
      );
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  return (
    <PageContainer>
      <ScrollView style={{ paddingHorizontal: 5 + '%' }}>
        <View style={styles.body}>
          <UserIcon style={styles.userIcon} />
          <Pressable onPress={selectImage} style={styles.userIconContainer}>
            {appData.photo ? (
              <FaIcon
                name="edit"
                size={25}
                color="#000"
                style={styles.faIcon}
              />
            ) : (
              <FaIcon
                name="plus"
                size={25}
                color="#000"
                style={styles.faIcon}
              />
            )}
          </Pressable>
          <View>
            <BoldText style={styles.name}>{fullName}</BoldText>
            <RegularText style={styles.email}>{email}</RegularText>
          </View>
          <View style={styles.modalBorder} />
          <RegularText style={styles.textHeader}>Loopay Tag</RegularText>
          <View style={styles.tagContainer}>
            {appData.tagName ? (
              <>
                <View style={styles.textContainer}>
                  <View style={styles.tagNameContainer}>
                    <View style={styles.tagName}>
                      <BoldText>#{appData.tagName}</BoldText>
                      <Pressable
                        onPress={() => navigation.navigate('LoopayTag')}>
                        <FaIcon name="edit" size={15} color={'#868585'} />
                      </Pressable>
                    </View>
                    <RegularText style={styles.text}>
                      Your unique Loopay tag
                    </RegularText>
                  </View>
                  <View style={styles.tagIcon}>
                    <Image
                      source={require('../../../assets/images/pageBg.png')}
                      resizeMode="cover"
                      style={styles.bg}
                    />
                    <Tag />
                  </View>
                </View>
              </>
            ) : (
              <>
                <BoldText>Loopay Tags</BoldText>
                <View style={styles.textContainer}>
                  <RegularText style={styles.text}>
                    Create a unique username to send and receive funds
                  </RegularText>
                  <View style={styles.tagIcon}>
                    <Image
                      source={require('../../../assets/images/pageBg.png')}
                      resizeMode="cover"
                      style={styles.bg2}
                    />
                    <Tag />
                  </View>
                </View>
                <View style={styles.button}>
                  <Button
                    text={'Create Loopay Tag'}
                    onPress={() => navigation.navigate('LoopayTag')}
                  />
                </View>
              </>
            )}
          </View>

          <View style={styles.childComponent}>{children}</View>
        </View>
      </ScrollView>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
    gap: 15,
    flex: 1,
  },
  userIconContainer: {
    position: 'relative',
    width: 100,
    transform: [{ translateY: -5 }],
  },
  userIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  faIcon: {
    position: 'absolute',
    bottom: 0,
    right: -5,
    zIndex: 2,
  },
  name: {
    fontSize: 25,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  email: {
    textAlign: 'center',
  },
  modalBorder: {
    backgroundColor: '#ddd',
    height: 6,
    width: 30 + '%',
    borderRadius: 3,
    maxWidth: 120,
  },
  tagContainer: {
    width: 110 + '%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 15,
    paddingHorizontal: 5 + '%',
  },
  textHeader: {
    alignSelf: 'flex-start',
    color: '#525252',
  },
  tagNameContainer: {
    marginTop: 15,
  },
  tagName: {
    flexDirection: 'row',
    gap: 3,
  },
  textContainer: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    position: 'relative',
  },
  text: {
    flex: 1.5,
    color: '#868685',
  },
  bg: {
    width: 150,
    height: 100,
    position: 'absolute',
    transform: [{ translateY: -20 }],
  },
  bg2: {
    width: 200,
    height: 200,
    position: 'absolute',
    transform: [{ rotateZ: '-10 deg' }, { translateY: -10 }],
  },
  tagIcon: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    marginTop: 10,
  },
  childComponent: {
    width: 100 + '%',
    marginVertical:  15,
  },
});
export default Profile;
