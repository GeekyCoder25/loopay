import React, { useContext } from 'react';
import PageContainer from '../../components/PageContainer';
import { View, StyleSheet } from 'react-native';
import BoldText from '../../components/fonts/BoldText';
import Button from '../../components/Button';
import { AppContext } from '../../components/AppContext';

const VerificationStatus = () => {
  const { vh } = useContext(AppContext);
  return (
    <PageContainer padding={true} justify={true}>
      <View
        style={{
          ...styles.container,
          minHeight: vh * 0.65,
        }}>
        <View>
          <BoldText style={styles.headerText}>Identity Verification</BoldText>
          <View style={styles.card}>
            <BoldText style={styles.cardHeaderText}>Requirements</BoldText>
          </View>
        </View>
        <Button text={'Verify now'} style={styles.button} />
      </View>
    </PageContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 2 + '%',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 20,
  },
  card: {
    backgroundColor: '#eee',
    minHeight: 250,
    marginVertical: 30,
    borderRadius: 30,
    padding: 20,
  },
  cardHeaderText: {
    fontSize: 18,
  },
  button: {},
});
export default VerificationStatus;
