import { StyleSheet, View } from 'react-native';
import PageContainer from '../../../components/PageContainer';
import BoldText from '../../../components/fonts/BoldText';
import Button from '../../../components/Button';
import IDcard from '../../../../assets/images/idCard.svg';
import RegularText from '../../../components/fonts/RegularText';
import Check from '../../../../assets/images/mark.svg';

const VerificationInformation = ({ navigation, route }) => {
  const handleNext = () => {
    navigation.navigate('VerifyImage', route.params);
  };

  const infos = [
    'Use an original document, and make sure all corners are visible',
    'Check your lighting to prevent glare or reflections',
    'Hold your device steady to avoid any blur',
  ];
  return (
    <PageContainer PageContainer padding justify={true}>
      <BoldText style={styles.headerText}>
        Get your {route.params.idType.name} card ready
      </BoldText>
      <View style={styles.body}>
        <View style={styles.bodyContent}>
          <IDcard />
          <View style={styles.infos}>
            {infos.map(info => (
              <View key={info} style={styles.info}>
                <Check />
                <RegularText style={styles.infoText}>{info}</RegularText>
              </View>
            ))}
          </View>
        </View>
        <Button text="Next" onPress={handleNext} />
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: 20,
    color: '#525252',
  },
  body: {
    flex: 1,
    marginTop: 50,
    paddingBottom: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bodyContent: {
    alignItems: 'center',
    gap: 50,
  },
  infos: {
    gap: 10,
    marginRight: 10 + '%',
  },
  info: {
    paddingHorizontal: 5 + '%',
    flexDirection: 'row',
    gap: 15,
  },
  infoText: {
    color: '#525252',
    fontSize: 16,
  },
});
export default VerificationInformation;
