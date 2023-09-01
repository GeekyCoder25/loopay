import AccInfoCard from '../../../components/AccInfoCard';
import PageContainer from '../../../components/PageContainer';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import BoldText from '../../../components/fonts/BoldText';
import UserIconSVG from '../../../../assets/images/userMenu.svg';
import { useBenefifciaryContext } from '../../../context/BenefiaciariesContext';

const SendBeneficiary = ({ navigation }) => {
  const { beneficiaryState } = useBenefifciaryContext();

  const handleContinue = async userFound => {
    navigation.navigate('TransferFunds', userFound);
  };

  return (
    <PageContainer paddingTop={0}>
      <ScrollView style={styles.body}>
        <View style={styles.top}>
          <AccInfoCard />
          <BoldText style={styles.header}>Beneficiaries</BoldText>
          <View>
            {beneficiaryState && beneficiaryState.length > 0 ? (
              beneficiaryState.map(beneficiary => (
                <Pressable
                  key={beneficiary.tagName}
                  onPress={() => handleContinue(beneficiary)}>
                  <View style={styles.userFound}>
                    {beneficiary.photo ? (
                      <Image
                        source={{ uri: beneficiary.photo }}
                        style={styles.userIconStyle}
                      />
                    ) : (
                      <View style={styles.nonUserIconStyle}>
                        <UserIconSVG width={25} height={25} />
                      </View>
                    )}
                    <View style={styles.userFoundDetails}>
                      <BoldText>{beneficiary.fullName}</BoldText>
                      <BoldText>{beneficiary.tagName}</BoldText>
                    </View>
                  </View>
                </Pressable>
              ))
            ) : (
              <BoldText style={styles.noBeneficiary}>
                You don&apos;t have any saved beneficiary
              </BoldText>
            )}
          </View>
        </View>
      </ScrollView>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  top: { paddingHorizontal: 4 + '%' },
  header: {
    marginBottom: 20,
  },
  userFound: {
    marginVertical: 10,
    backgroundColor: '#EEEEEE',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  userIconStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#979797',
  },
  nonUserIconStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(160, 160, 160, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userFoundDetails: {
    gap: 5,
  },
  noBeneficiary: {
    textAlign: 'center',
    marginVertical: 30,
  },
});

export default SendBeneficiary;
