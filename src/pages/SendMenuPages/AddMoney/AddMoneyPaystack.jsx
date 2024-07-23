import { StyleSheet } from 'react-native';
import React, { useContext, useState } from 'react';
import WebView from 'react-native-webview';
import { apiUrl } from '../../../../utils/fetchAPI';
import { AppContext } from '../../../components/AppContext';

const AddMoneyPaystack = ({ navigation, route }) => {
  const [closeWebView, setCloseWebView] = useState(false);
  const { setIsLoading } = useContext(AppContext);
  const { authorization_url: uri } = route.params;
  const callback_url = `${apiUrl.split('/api')[0]}/card-success.html`;
  const cancel_url = `${apiUrl.split('/api')[0]}/webview-cancel.html`;

  const onNavigationStateChange = state => {
    const { url } = state;

    if (!url) return;
    if (url.startsWith(callback_url)) {
      setCloseWebView(true);
      setIsLoading(true);
    } else if (url === cancel_url) {
      navigation.goBack();
    }
  };

  if (closeWebView) {
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('Home');
    }, 2000);

    return <></>;
  }

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
