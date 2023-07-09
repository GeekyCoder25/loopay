import React from 'react';
import PageContainer from '../../components/PageContainer';
import { StyleSheet, View } from 'react-native';
import BoldText from '../../components/fonts/BoldText';

const Referrals = () => {
  return (
    <PageContainer padding={true} justify={true}>
      <View style={styles.container}>
        <BoldText style={styles.referalHeader}>
          Refer friends and family to Loopay
        </BoldText>
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  referalHeader: {
    fontSize: 18,
    color: '#525252',
  },
});
export default Referrals;
