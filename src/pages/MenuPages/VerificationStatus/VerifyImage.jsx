import { Image, Pressable, StyleSheet, View } from 'react-native';
import PageContainer from '../../../components/PageContainer';
import Button from '../../../components/Button';
import { useContext, useState } from 'react';
import RegularText from '../../../components/fonts/RegularText';
import IDcard from '../../../../assets/images/sideIdCard.svg';
import Capture from '../../../../assets/images/capture.svg';
import * as ImagePicker from 'expo-image-picker';
import ErrorMessage from '../../../components/ErrorMessage';
import { AppContext } from '../../../components/AppContext';
import ToastMessage from '../../../components/ToastMessage';
import { apiUrl } from '../../../../utils/fetchAPI';
import { getToken } from '../../../../utils/storage';

const VerifyImage = ({ route, navigation }) => {
  const { vw, vh, setIsLoading } = useContext(AppContext);
  const params = route.params;
  const [side, setSide] = useState('front');
  const [errorMessage, setErrorMessage] = useState('');
  const [preview, setPreview] = useState('');
  const [formData, setFormData] = useState({
    front: '',
    back: '',
    ...params,
  });

  const handleNext = () => {
    if (!formData.front) {
      return setErrorMessage('Please upload first');
    }
    setPreview('');
    setSide('back');
  };

  const handleVerify = async () => {
    try {
      if (!formData.back) {
        return setErrorMessage('Please upload first');
      }
      const frontImage = formData.front;
      const backImage = formData.back;
      const frontFileName = frontImage.split('/').pop();
      const fileType = frontFileName.split('.').pop();
      const backFileName = backImage.split('/').pop();
      const imageFormData = new FormData();
      clearTimeout(timeout);

      imageFormData.append('front', {
        uri: frontImage,
        name: frontFileName,
        type: `image/${fileType}`,
      });
      imageFormData.append('back', {
        uri: backImage,
        name: backFileName,
        type: `image/${fileType}`,
      });
      imageFormData.append('data', JSON.stringify(params));

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      const token = await getToken();

      const options = {
        method: 'POST',
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: imageFormData,
      };
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/user/verify?image`, options);
      clearTimeout(timeout);
      const data = await response.text();
      const result = JSON.parse(data);
      if (response.status === 200) {
        return navigation.navigate('FaceDetection');
      } else {
        const errormessage = result.message.includes(
          'Please upload an image less than',
        )
          ? result.message
          : 'Image upload failed';
        ToastMessage(errormessage);
      }
    } catch (err) {
      ToastMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCapture = () => {
    const selectImage = async () => {
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
        if (side === 'front') {
          setPreview(result.assets[0].uri);
          setFormData(prev => {
            return { ...prev, front: result.assets[0].uri };
          });
        } else {
          setPreview(result.assets[0].uri);
          setFormData(prev => {
            return { ...prev, back: result.assets[0].uri };
          });
        }
        setErrorMessage('');
      }
    };
    selectImage();
  };
  return (
    <PageContainer padding justify={true}>
      <View style={styles.bodyContent}>
        <RegularText style={styles.side}>
          {side === 'front' ? 'Front' : 'Back'} side
        </RegularText>
        {preview ? (
          <Image
            source={{ uri: preview }}
            style={{ ...styles.preview, width: vw * 0.8, height: vh * 0.3 }}
            resizeMode="stretch"
          />
        ) : (
          <View style={styles.IDCard}>
            <IDcard width={vw * 0.7} />
          </View>
        )}
        <Pressable style={styles.capture} onPress={handleCapture}>
          <Capture />
        </Pressable>
        <View />
      </View>
      {errorMessage && (
        <View>
          <ErrorMessage errorMessage={errorMessage} />
        </View>
      )}
      <View style={styles.button}>
        {side === 'front' ? (
          <Button text="Next" onPress={handleNext} />
        ) : (
          <Button text="Submit" onPress={handleVerify} />
        )}
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: 20,
    color: '#525252',
  },
  bodyContent: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
    flex: 1,
  },
  side: {
    color: '#868585',
  },
  IDCard: {
    backgroundColor: '#eee',
    padding: 40,
  },
  capture: {
    marginBottom: 30,
  },
  button: {
    marginBottom: 15 + '%',
  },
});

export default VerifyImage;
