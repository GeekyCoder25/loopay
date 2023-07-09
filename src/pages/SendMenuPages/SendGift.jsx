import { StyleSheet, View } from 'react-native';
import PageContainer from '../../components/PageContainer';

const SendGift = () => {
  return (
    <PageContainer padding={true} paddingTop={0}>
      <View style={styles.body}></View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  body: {
    gap: 15,
    flex: 1,
  },
});
export default SendGift;
