import React from 'react';
import { ToastAndroid } from 'react-native';

const useToast = data => {
  ToastAndroid.show(data, ToastAndroid.SHORT);
};

export default useToast;
