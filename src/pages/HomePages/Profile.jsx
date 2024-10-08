import React, { useContext, useState } from 'react';
import PageContainer from '../../components/PageContainer';
import { Image, Pressable, StyleSheet, View } from 'react-native';
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
import WithdrawIcon from '../../../assets/images/withdraw.svg';
import PasswordIcon from '../../../assets/images/password.svg';
import PinIcon from '../../../assets/images/pin.svg';
import SettingsIcon from '../../../assets/images/settings.svg';
import QuestionsIcon from '../../../assets/images/questions.svg';
import ProfileIcon from '../../../assets/images/profile.svg';
import ChevronLeft from '../../../assets/images/chevron-right.svg';
import FaceIDIcon from '../../../assets/images/face-id.svg';
import BiometricIcon from '../../../assets/images/biometric.svg';
import ToastMessage from '../../components/ToastMessage';
import { Ionicons } from '@expo/vector-icons';

const Profile = ({ navigation, children, route }) => {
  const { appData, setAppData, isBiometricSupported, selectedCurrency } =
    useContext(AppContext);
  const [showModal, setShowModal] = useState(false);
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
        ToastMessage('Profile Picture updated successfully');
      } else {
        const errormessage = result.message.includes(
          'Please upload an image less than',
        )
          ? result.message
          : 'Image upload failed';
        ToastMessage(errormessage);
      }
    } catch (error) {
      ToastMessage('Error uploading image');
      console.log('Error uploading image:', error);
    }
  };

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return ToastMessage('Permission was denied by user');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    setShowModal(false);
    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const launchCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      return ToastMessage('Camera permission was denied by user');
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

  const profileRoutes = [
    {
      routeName: 'Profile',
      routeNavigate: 'Myinfo',
      routeIcon: 'info',
      routeDetails: 'View/Modify your profile information',
    },
    {
      routeName: 'Withdraw',
      routeNavigate: 'Withdraw',
      routeIcon: 'withdraw',
      routeDetails: `Withdraw funds to your ${selectedCurrency.acronym} account`,
    },
    // {
    //   routeName: 'Change Password',
    //   routeNavigate: 'Password',
    //   routeIcon: 'password',
    //   routeDetails: 'Change your online banking password',
    // },
    {
      routeName: `${appData.pin ? 'Change' : 'Create'} PIN`,
      routeNavigate: 'Pin',
      routeIcon: 'pin',
      routeDetails: `${
        appData.pin ? 'Change' : 'Create'
      } your 4-digit transaction PIN`,
    },
    {
      routeName: 'Limit Settings',
      routeNavigate: 'Limit',
      routeIcon: 'settings',
      routeDetails: 'Manage your transaction limits',
    },
    // {
    //   routeName: 'Secret Questions',
    //   routeNavigate: 'Questions',
    //   routeIcon: 'questions',
    //   routeDetails: 'Set up your secret questions',
    // },
  ];

  return (
    <>
      <PageContainer scroll>
        <View style={styles.body}>
          <UserIcon style={styles.userIcon} />
          <Pressable
            onPress={() => setShowModal(true)}
            style={styles.userIconContainer}>
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
            <View>
              <BoldText style={styles.name}>{fullName} </BoldText>
              {appData.verificationStatus === 'verified' && (
                <Image
                  source={require('../../../assets/images/verify.png')}
                  style={styles.verify}
                  resizeMode="contain"
                />
              )}
            </View>
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
          {route?.name === 'Profile' &&
            profileRoutes.map(routePage => (
              <RouteLink
                key={routePage.routeIcon}
                route={routePage}
                navigation={navigation}
              />
            ))}
          {route?.name === 'Profile' && isBiometricSupported && (
            <RouteLink
              route={{
                routeName: 'Biometric Authentication',
                routeNavigate: 'Biometric',
                routeIcon: 'biometric',
                routeDetails: 'Enable/Disable biometric authentication method',
              }}
              navigation={navigation}
            />
          )}
        </View>
      </PageContainer>
      {showModal && (
        <Pressable style={styles.modal} onPress={() => setShowModal(false)}>
          <Pressable onPress={selectImage} style={styles.select}>
            <Ionicons name="image-outline" size={24} />
            <RegularText>Select Image</RegularText>
          </Pressable>
          <Pressable onPress={launchCamera} style={styles.select}>
            <Ionicons name="camera-outline" size={24} />
            <RegularText>Launch Camera</RegularText>
          </Pressable>
        </Pressable>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
    gap: 15,
    flex: 1,
    paddingHorizontal: 5 + '%',
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
  verify: {
    position: 'absolute',
    width: 20,
    height: 20,
    right: -20,
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
    transform: [{ translateX: 10 }, { translateY: -20 }],
  },
  bg2: {
    width: 200,
    height: 200,
    position: 'absolute',
    transform: [{ rotateZ: '-10 deg' }, { translateY: -10 }],
  },
  tagIcon: {
    flex: 1,
    alignItems: 'flex-end',
  },
  button: {
    marginTop: 10,
  },
  childComponent: {
    width: 100 + '%',
    marginVertical: 15,
  },
  route: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#c4c4c4',
    paddingRight: 10,
  },
  routeIcon: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  routeTexts: {
    flex: 1,
  },
  routeName: {
    fontFamily: 'Karla-600',
    color: '#585555',
    fontSize: 16,
  },
  routeDetails: {
    fontFamily: 'Karla-400',
    color: '#585555',
  },
  routeArrow: {
    marginTop: 15,
    marginLeft: -25,
  },
  modal: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  select: {
    width: '100%',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    paddingVertical: 20,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 20,
  },
});
export default Profile;

const RouteLink = ({ route, navigation }) => {
  const { hasFaceID } = useContext(AppContext);
  const routeIcon = () => {
    switch (route.routeIcon) {
      case 'withdraw':
        return <WithdrawIcon />;
      case 'password':
        return <PasswordIcon />;
      case 'pin':
        return <PinIcon />;
      case 'settings':
        return <SettingsIcon fill="#000" />;
      case 'questions':
        return <QuestionsIcon />;
      case 'info':
        return <ProfileIcon />;
      case 'biometric':
        return hasFaceID ? (
          <FaceIDIcon width={35} height={35} />
        ) : (
          <BiometricIcon />
        );
    }
  };
  const handleNavigate = () => {
    navigation.navigate(route.routeNavigate);
  };
  return (
    <Pressable onPress={handleNavigate} style={styles.route}>
      <View style={styles.routeIcon}>{routeIcon()}</View>
      <View style={styles.routeTexts}>
        <BoldText style={styles.routeName}>{route.routeName}</BoldText>
        <RegularText style={styles.routeDetails}>
          {route.routeDetails}
        </RegularText>
      </View>
      <ChevronLeft style={styles.routeArrow} />
    </Pressable>
  );
};
