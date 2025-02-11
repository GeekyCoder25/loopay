import { StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';
import Check from '../../../../assets/images/check.svg';
import PageContainer from '../../../components/PageContainer';
import BoldText from '../../../components/fonts/BoldText';
import Button from '../../../components/Button';
import { Audio } from 'expo-av';

const CardCreateSuccess = ({ navigation, route }) => {
  useEffect(() => {
    const playSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../../../../assets/success.mp3'),
      );
      await sound.playAsync();
    };
    playSound();
  }, []);

  return (
    <PageContainer style={styles.container}>
      <View style={styles.header}>
        <Check />
        <BoldText style={styles.headerText}>Success</BoldText>
        <Button
          text={'View Card Details'}
          onPress={() => {
            navigation.replace('VirtualCardDetails', route.params);
          }}
        />
      </View>
    </PageContainer>
  );
};

export default CardCreateSuccess;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5 + '%',
  },
  header: {
    gap: 30,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 18,
  },
});
