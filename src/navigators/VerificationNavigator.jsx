/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import VerificationStatus from '../pages/MenuPages/VerificationStatus';
import IdentityVerification from '../pages/MenuPages/VerificationStatus/IdentityVerification';
import VerificationInformation from '../pages/MenuPages/VerificationStatus/VerificationInformation';
import VerifyImage from '../pages/MenuPages/VerificationStatus/VerifyImage';
import VerifyInputNumber from '../pages/MenuPages/VerificationStatus/VerifyInputNumber';
import Back from '../components/Back';
import FaceDetection from '../pages/MenuPages/VerificationStatus/FaceDetectionExpo';
// import Constants from 'expo-constants';

// const FaceDetection = React.lazy(() => {
//   return Constants.appOwnership === 'expo'
//     ? import('../pages/MenuPages/VerificationStatus/FaceDetectionExpo')
//     : import('../pages/MenuPages/VerificationStatus/FaceDetectionExpo');
// });

export default function VerificationNavigator() {
  const Stack = createNativeStackNavigator();
  const screenHeader = (navigation, route) => {
    return {
      headerShown: true,
      header: () => <Back goBack={navigation.goBack} route={route} />,
    };
  };
  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) =>
        screenHeader(navigation, route)
      }>
      <Stack.Screen
        name="FirstPage"
        component={VerificationStatus}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="IdentityVerification"
        component={IdentityVerification}
      />
      <Stack.Screen
        name="VerificationInformation"
        component={VerificationInformation}
      />
      <Stack.Screen name="VerifyInput" component={VerifyInputNumber} />
      <Stack.Screen name="VerifyImage" component={VerifyImage} />
      <Stack.Screen name="FaceDetection" component={FaceDetection} />
    </Stack.Navigator>
  );
}
