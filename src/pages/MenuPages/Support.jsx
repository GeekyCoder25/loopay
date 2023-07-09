import React from 'react';
import PageContainer from '../../components/PageContainer';
import { StyleSheet, View } from 'react-native';
import BoldText from '../../components/fonts/BoldText';

const Support = () => {
  return (
    <PageContainer padding={true} justify={true}>
      <View style={styles.container}>
        <BoldText>Loopay Support</BoldText>
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({});
export default Support;
