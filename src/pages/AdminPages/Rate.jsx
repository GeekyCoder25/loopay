import PageContainer from '../../components/PageContainer';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import BackIcon from '../../../assets/images/backArrrow.svg';
import BoldText from '../../components/fonts/BoldText';

const Rate = ({ navigation }) => {
  return (
    <PageContainer style={styles.container} scroll>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <BackIcon />
          <BoldText style={styles.headerText}>Currency rate</BoldText>
        </Pressable>
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 5 + '%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  headerText: {
    fontSize: 20,
  },
});

export default Rate;
