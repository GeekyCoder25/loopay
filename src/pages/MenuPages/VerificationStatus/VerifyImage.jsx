import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import PageContainer from '../../../components/PageContainer';
import Button from '../../../components/Button';
import { useContext, useEffect, useState } from 'react';
import RegularText from '../../../components/fonts/RegularText';
import IDcard from '../../../../assets/images/sideIdCard.svg';
import Capture from '../../../../assets/images/capture.svg';
import * as ImagePicker from 'expo-image-picker';
import ErrorMessage from '../../../components/ErrorMessage';
import { AppContext } from '../../../components/AppContext';
import ToastMessage from '../../../components/ToastMessage';

const VerifyImage = () => {
  const { vw, vh } = useContext(AppContext);
  const [side, setSide] = useState('front');
  const [errorMessage, setErrorMessage] = useState('');
  const [preview, setPreview] = useState('');
  const [formData, setFormData] = useState({
    front: '',
    back: '',
  });

  const handleNext = () => {
    if (!formData.front) {
      return setErrorMessage('Please upload first');
    }
    setPreview('');
    setSide('back');
  };
  const handleVerify = () => {
    if (!formData.back) {
      return setErrorMessage('Please upload first');
    }
  };

  useEffect(() => {
    // console.log(formData);
  }, [formData]);
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
        // uploadImage(result.assets[0].uri);
      }
    };
    selectImage();
  };
  return (
    <PageContainer PageContainer padding justify={true}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.bodyContent}>
          <RegularText style={styles.side}>
            {side === 'front' ? 'Front' : 'Back'} side
          </RegularText>
          {preview ? (
            <Image
              source={{ uri: preview }}
              style={{ ...styles.preview, width: vw * 0.8, height: vh * 0.3 }}
            />
          ) : (
            <View style={styles.IDCard}>
              <IDcard width={vw * 0.7} />
            </View>
          )}
          <Pressable style={styles.capture} onPress={handleCapture}>
            <Capture />
          </Pressable>
        </View>
        {errorMessage && (
          <View>
            <ErrorMessage errorMessage={errorMessage} />
          </View>
        )}
        {side === 'front' ? (
          <Button text="Next" onPress={handleNext} />
        ) : (
          <Button text="Verify" onPress={handleVerify} />
        )}
      </ScrollView>
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
    gap: 20,
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
});

export default VerifyImage;
