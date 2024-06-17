import { StyleSheet } from 'react-native';
import React from 'react';
import WebView from 'react-native-webview';

const AddMoneyPaystack = ({ route }) => {
  const { authorization_url: uri } = route.params;

  return <WebView source={{ uri }} style={styles.paystackUI} />;
};

export default AddMoneyPaystack;

const styles = StyleSheet.create({
  paystackUI: {
    marginTop: 20,
  },
});
