import { StyleSheet } from 'react-native';
import React from 'react';
import WebView from 'react-native-webview';
import { apiUrl } from '../../../../utils/fetchAPI';

const AddMoneyPaystack = ({ navigation, route }) => {
  const { authorization_url: uri } = route.params;
  const callback_url = `${apiUrl.split('/api')[0]}/card-success.html`;
  const cancel_url = `${apiUrl.split('/api')[0]}/webview-cancel.html`;

  const onNavigationStateChange = state => {
    const { url } = state;

    if (!url) return;
    if (url.startsWith(callback_url)) {
      navigation.navigate('Home');
    } else if (url === cancel_url) {
      navigation.goBack();
    }
  };

  return (
    <WebView
      source={{ uri }}
      style={styles.paystackUI}
      onNavigationStateChange={onNavigationStateChange}
    />
  );
};

export default AddMoneyPaystack;

const styles = StyleSheet.create({
  paystackUI: {
    marginTop: 20,
  },
});
