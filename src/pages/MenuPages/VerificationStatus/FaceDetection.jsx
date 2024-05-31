import { Easing, Image, Pressable, StyleSheet, View } from 'react-native';
import React, { useContext, useRef, useState } from 'react';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import { AppContext } from '../../../components/AppContext';
import Capture from '../../../../assets/images/capture-record.svg';
import CaptureActive from '../../../../assets/images/capture-record-active.svg';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Haptics from 'expo-haptics';
import RegularText from '../../../components/fonts/RegularText';
import BoldText from '../../../components/fonts/BoldText';
import FaIcon from '@expo/vector-icons/FontAwesome';
import VideoPreview from './VideoPreview';
import ToastMessage from '../../../components/ToastMessage';
import Button from '../../../components/Button';

const FaceDetection = () => {
  const camera = useRef(null);
  const frontCamera = useCameraDevice('front');
  const backCamera = useCameraDevice('back');
  const { vw } = useContext(AppContext);
  const [isRecording, setIsRecording] = useState(false);

  const device = frontCamera || backCamera;
  const { hasPermission, requestPermission } = useCameraPermission();
  const [showPreview, setShowPreview] = useState(false);
  const [video, setVideo] = useState(null);
  const [isVideoRecorded, setIsVideoRecorded] = useState(false);
  const [recordTime, setRecordTime] = useState(15);

  if (!hasPermission) {
    requestPermission();
    return <View />;
  }

  if (device == null) return <Button text={'No device'} />;

  const handleRecord = () => {
    setIsRecording(true);
    setShowPreview(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const handleStopRecord = async () => {
    setIsRecording(false);
    setIsVideoRecorded(true);
    setRecordTime(15);
    await camera.current.stopRecording();
  };

  if (showPreview) {
    return (
      <View style={styles.page}>
        <View style={styles.guide}>
          <BoldText style={styles.guideText}>
            Keep your face steady in the circle for 15 seconds
          </BoldText>
          <View style={styles.info}>
            <FaIcon name="info-circle" color={'#868585'} size={14} />
            <RegularText style={styles.infoText}>
              Make sure you&apos;re in a well-lighted surrounding and your face
              can show clearly, click on the red shutter button to start
            </RegularText>
          </View>
        </View>
        <View
          style={{
            ...styles.camera,
            alignItems: undefined,
          }}>
          <View
            style={{
              ...styles.container,
              maxWidth: vw * 0.9,
              maxHeight: vw * 0.9,
            }}>
            <Camera
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={true}
              photo={true}
            />
          </View>
        </View>
        <View style={{ ...styles.button, marginBottom: vw * 0.2 }}>
          <Pressable onPress={handleRecord}>
            <CaptureActive />
          </Pressable>
        </View>
      </View>
    );
  } else if (video && isVideoRecorded) {
    return (
      <VideoPreview
        video={video}
        reloadState={{ setVideo, setShowPreview, setIsVideoRecorded }}
      />
    );
  } else if (!camera.current && !isRecording) {
    return (
      <View style={styles.page}>
        <View style={styles.guide}>
          <BoldText style={styles.guideText}>
            One more step! Click on the button below to start a facial
            recognition of your face
          </BoldText>
          <View style={styles.info}>
            <FaIcon name="info-circle" color={'#868585'} size={14} />
            <RegularText style={styles.infoText}>
              Make sure you&apos;re in a well-lighted surrounding and your face
              can show clearly
            </RegularText>
          </View>
        </View>
        <View style={styles.camera}>
          <View
            style={{
              ...styles.container,
              maxWidth: vw * 0.9,
              maxHeight: vw * 0.9,
            }}>
            <View style={styles.sample}>
              <Image
                source={require('../../../../assets/images/face-verification.png')}
                resizeMode="stretch"
                style={{
                  width: vw * 0.9,
                  height: vw * 0.9,
                }}
              />
            </View>
          </View>
        </View>

        <View style={{ ...styles.button, marginBottom: vw * 0.2 }}>
          <Pressable onPress={() => setShowPreview(true)}>
            <Capture />
          </Pressable>
        </View>
      </View>
    );
  }

  const handleCameraInitialized = () => {
    camera.current?.startRecording({
      onRecordingFinished: videoData => {
        setVideo(videoData);
      },
      onRecordingError: error => ToastMessage(error),
    });

    const interval = setInterval(() => {
      setRecordTime(prev => prev - 1);
    }, 1000);
    setTimeout(() => {
      clearTimeout(interval);
    }, recordTime * 1000);
  };

  return (
    <View style={styles.page}>
      <View style={styles.guide}>
        <BoldText style={styles.guideText}>
          Keep your face steady in the circle for 15 seconds
        </BoldText>
        <View style={styles.info}>
          <FaIcon name="info-circle" color={'#868585'} size={14} />
          <RegularText style={styles.infoText}>
            Make sure you&apos;re in a well-lighted surrounding and your face
            can show clearly
          </RegularText>
        </View>
      </View>
      <View style={{ ...styles.camera, alignItems: undefined }}>
        <View
          style={{
            ...styles.container,
            maxWidth: vw * 0.9,
            maxHeight: vw * 0.9,
          }}>
          <AnimatedCircularProgress
            size={vw * 0.89}
            width={10}
            fill={100}
            tintColor="#5bb85d"
            onAnimationComplete={handleStopRecord}
            backgroundColor="#fff"
            duration={recordTime * 1000}
            easing={Easing.linear}
            rotation={0}
            style={styles.progress}>
            {() => (
              <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                video={true}
                ref={camera}
                onInitialized={handleCameraInitialized}
              />
            )}
          </AnimatedCircularProgress>
        </View>
      </View>
      <View style={{ ...styles.button, marginBottom: vw * 0.2 }}>
        <BoldText style={styles.time}>
          {!isVideoRecorded && recordTime}
        </BoldText>
      </View>
    </View>
  );
};

export default FaceDetection;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    rowGap: 30,
    paddingHorizontal: '3%',
  },
  guide: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
    paddingHorizontal: '3%',
    rowGap: 20,
    height: 50,
  },
  guideText: {
    fontSize: 18,
    textAlign: 'center',
  },
  info: {
    flexDirection: 'row',
    columnGap: 6,
  },
  infoText: {
    textAlign: 'center',
    color: '#868585',
    marginTop: -3,
  },
  container: {
    borderRadius: 1000,
    flex: 1,
    maxHeight: 500,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  sample: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  progress: {
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '3%',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  time: {
    fontSize: 38,
  },
});
