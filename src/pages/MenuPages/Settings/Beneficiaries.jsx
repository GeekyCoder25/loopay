/* eslint-disable react-native/no-inline-styles */
import { useContext, useEffect, useState } from 'react';
import BoldText from '../../../components/fonts/BoldText';
import PageContainer from '../../../components/PageContainer';
import { Pressable, StyleSheet, View } from 'react-native';
import ToastMessage from '../../../components/ToastMessage';
import { AppContext } from '../../../components/AppContext';
import MaIcon from '@expo/vector-icons/MaterialIcons';
import RegularText from '../../../components/fonts/RegularText';
import useFetchData from '../../../../utils/fetchAPI';

const Beneficiaries = () => {
  const { getFetchData } = useFetchData();
  const { selectedCurrency } = useContext(AppContext);
  const [selectedTab, setSelectedTab] = useState('loopay');
  const [loopayBeneficiaries, setLoopayBeneficiaries] = useState([]);
  const [otherBeneficiaries, setOtherBeneficiaries] = useState([]);

  useEffect(() => {
    selectedTab === 'loopay' &&
      getFetchData('user/beneficiary')
        .then(response =>
          response.status === 200
            ? setLoopayBeneficiaries(response.data.beneficiaries)
            : ToastMessage(response.data),
        )
        .catch(err => ToastMessage(err.message));

    selectedTab === 'others' &&
      getFetchData(`user/savedBanks?currency=${selectedCurrency.acronym}`)
        .then(response =>
          response.status === 200
            ? setOtherBeneficiaries(response.data)
            : ToastMessage(response.data),
        )
        .catch(err => ToastMessage(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCurrency, selectedTab]);

  return (
    <PageContainer paddingTop={0} scroll>
      <View>
        <BoldText style={styles.headerText}>Beneficiaries</BoldText>
        <View style={styles.bodySelectors}>
          <Pressable
            style={{
              ...styles.bodySelector,
              backgroundColor: selectedTab === 'loopay' ? '#525252' : '#d0d1d2',
            }}
            onPress={() => setSelectedTab('loopay')}>
            <BoldText
              style={{
                color: selectedTab === 'loopay' ? '#fff' : '#1E1E1E',
              }}>
              Loopay
            </BoldText>
          </Pressable>
          <Pressable
            style={{
              ...styles.bodySelector,
              backgroundColor: selectedTab === 'others' ? '#525252' : '#d0d1d2',
            }}
            onPress={() => setSelectedTab('others')}>
            <BoldText
              style={{
                color: selectedTab === 'others' ? '#fff' : '#1E1E1E',
              }}>
              Others
            </BoldText>
          </Pressable>
        </View>
        <View style={styles.beneficiaries}>
          {selectedTab === 'loopay' &&
            (loopayBeneficiaries.length ? (
              loopayBeneficiaries.map(loopay => (
                <LoopayBeneficiary
                  key={loopay.tagName}
                  beneficiary={loopay}
                  setBeneficiaries={setLoopayBeneficiaries}
                />
              ))
            ) : (
              <View style={styles.empty}>
                <BoldText>No saved beneficiaries</BoldText>
              </View>
            ))}
          {selectedTab === 'others' &&
            (otherBeneficiaries.length ? (
              otherBeneficiaries.map(other => (
                <OtherBeneficiary
                  key={other.bankCode + other.accNo}
                  beneficiary={other}
                  setBeneficiaries={setOtherBeneficiaries}
                />
              ))
            ) : (
              <View style={styles.empty}>
                <BoldText>No saved beneficiaries</BoldText>
              </View>
            ))}
        </View>
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: 20,
    marginBottom: 20,
    paddingHorizontal: 3 + '%',
  },
  bodySelectors: {
    flexDirection: 'row',
    alignItems: 'space-between',
  },
  bodySelector: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  selectedTab: {
    backgroundColor: 'red',
  },
  beneficiaries: {
    paddingHorizontal: 3 + '%',
  },
  beneficiary: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#868585',
  },
  empty: {
    marginVertical: 20,
  },
});
export default Beneficiaries;

const LoopayBeneficiary = ({ beneficiary, setBeneficiaries }) => {
  const { deleteFetchData } = useFetchData();
  const { accNo, fullName, tagName } = beneficiary;

  const handleDelete = async () => {
    const response = await deleteFetchData(
      `user/beneficiary/${beneficiary.tagName}`,
    );
    if (response.status === 200) {
      setBeneficiaries(prev =>
        prev.filter(loopay => loopay.tagName !== beneficiary.tagName),
      );
      return ToastMessage('Beneficiary removed');
    }
    ToastMessage(`${response.data}`);
  };

  return (
    <View style={styles.beneficiary}>
      <View>
        <BoldText>{fullName}</BoldText>
        <RegularText>{accNo}</RegularText>
        <RegularText>#{tagName}</RegularText>
      </View>
      <Pressable onPress={handleDelete}>
        <MaIcon name="delete" size={24} color={'#868585'} />
      </Pressable>
    </View>
  );
};
const OtherBeneficiary = ({ beneficiary, setBeneficiaries }) => {
  const { deleteFetchData } = useFetchData();
  const { accNo, bankName, name } = beneficiary;

  const handleDelete = async () => {
    const response = await deleteFetchData(
      `user/savedBanks/${beneficiary._id}`,
    );
    if (response.status === 200) {
      setBeneficiaries(prev =>
        prev.filter(loopay => loopay.tagName !== beneficiary.tagName),
      );
      return ToastMessage('Beneficiary removed');
    }
    ToastMessage(`${response.data}`);
  };

  return (
    <View style={styles.beneficiary}>
      <View>
        <BoldText>{name}</BoldText>
        <RegularText>{accNo}</RegularText>
        <RegularText>{bankName}</RegularText>
      </View>
      <Pressable onPress={handleDelete}>
        <MaIcon name="delete" size={24} color={'#868585'} />
      </Pressable>
    </View>
  );
};
