import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';

const FaceDetection = () => {
  const device = useCameraDevice('front');
  const { hasPermission } = useCameraPermission();

  if (!hasPermission) return console.log(hasPermission);
  if (device == null) return console.log('no camera');

  const handleFacesDetected = ({ faces }) => {
    console.log(faces);
  };

  return (
    <Camera style={StyleSheet.absoluteFill} device={device} isActive={false} />
  );
};

export default FaceDetection;

const styles = StyleSheet.create({});
