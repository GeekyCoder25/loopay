import AccInfoCard from '../../../components/AccInfoCard';
import PageContainer from '../../../components/PageContainer';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import BoldText from '../../../components/fonts/BoldText';
import UserIconSVG from '../../../../assets/images/userMenu.svg';
import { useBeneficiaryContext } from '../../../context/BeneficiariesContext';
import RegularText from '../../../components/fonts/RegularText';
import { useState } from 'react';

const SendBeneficiary = ({ navigation }) => {
  const { beneficiaryState } = useBeneficiaryContext();
  const [searchBeneficiaries, setSearchBeneficiaries] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleContinue = async userFound => {
    navigation.navigate('TransferFunds', userFound);
  };

  const handleSearch = text => {
    text ? setIsSearching(true) : setIsSearching(false);
    setSearchBeneficiaries(
      beneficiaryState.filter(beneficiary =>
        Object.values({
          fullName: beneficiary.fullName,
          tagName: beneficiary.tagName,
          accNo: beneficiary.accNo,
        })
          .toString()
          .toLowerCase()
          .includes(text.toLowerCase()),
      ),
    );
  };

  return (
    <PageContainer paddingTop={0}>
      <ScrollView style={styles.body}>
        <View style={styles.top}>
          <AccInfoCard />
          <RegularText style={styles.header}>Search Beneficiaries</RegularText>
        </View>
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            inputMode="text"
            onChangeText={text => handleSearch(text)}
            placeholder="Search"
            placeholderTextColor={'#525252'}
            maxLength={10}
          />
        </View>
        <View style={styles.beneficiaries}>
          <RegularText style={styles.header}>Beneficiaries</RegularText>
          {beneficiaryState && isSearching ? (
            searchBeneficiaries.length ? (
              searchBeneficiaries.map(beneficiary => (
                <Beneficiary
                  beneficiary={beneficiary}
                  key={beneficiary.tagName}
                  handleContinue={handleContinue}
                />
              ))
            ) : (
              <RegularText>There are no found beneficiaries</RegularText>
            )
          ) : beneficiaryState.length > 0 ? (
            beneficiaryState.map(beneficiary => (
              <Beneficiary
                beneficiary={beneficiary}
                key={beneficiary.tagName}
                handleContinue={handleContinue}
              />
            ))
          ) : (
            <BoldText style={styles.noBeneficiary}>
              You don&apos;t have any saved beneficiary
            </BoldText>
          )}
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
  textInputContainer: {
    position: 'relative',
    paddingBottom: 30,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#bbb',
  },
  textInput: {
    borderRadius: 10,
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    fontFamily: 'OpenSans-600',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 4 + '%',
  },
  beneficiaries: {
    paddingHorizontal: 4 + '%',
  },
  userFound: {
    marginVertical: 10,
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
    borderBottomWidth: 0.5,
    paddingBottom: 10,
    flex: 1,
  },
  noBeneficiary: {
    textAlign: 'center',
    marginVertical: 30,
  },
  verify: {
    width: 15,
    height: 15,
  },
});

export default SendBeneficiary;

const Beneficiary = ({ beneficiary, handleContinue }) => {
  return (
    <Pressable onPress={() => handleContinue(beneficiary)}>
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
          <BoldText>
            {beneficiary.fullName}{' '}
            {beneficiary.verificationStatus === 'verified' && (
              <Image
                source={require('../../../../assets/images/verify.png')}
                style={styles.verify}
                resizeMode="contain"
              />
            )}
          </BoldText>
          <BoldText>{beneficiary.tagName}</BoldText>
        </View>
      </View>
    </Pressable>
  );
};
