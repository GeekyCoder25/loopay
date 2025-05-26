import React, { useEffect, useState } from 'react';
import BoldText from '../../components/fonts/BoldText';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import BackIcon from '../../../assets/images/backArrow.svg';
import ChevronDown from '../../../assets/images/chevron-down-fill.svg';
import RegularText from '../../components/fonts/RegularText';
import IonIcon from '@expo/vector-icons/Ionicons';

import { useAdminDataContext } from '../../context/AdminContext';
import Verification from './components/Verification';
import Back from '../../components/Back';
import useFetchData from '../../../utils/fetchAPI';

const Verifications = ({ navigation }) => {
  const { getFetchData } = useFetchData();
  const { verifications, setVerifications } = useAdminDataContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [openVerification, setOpenVerification] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('pending');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationData, setVerificationData] = useState({});
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchData, setSearchData] = useState([]);

  const verificationStatuses = ['pending', 'verified', 'declined'];

  useEffect(() => {
    const getVerifications = async () => {
      try {
        setIsLoading(true);
        const response = await getFetchData(
          `admin/verification?${selectedLabel}`,
        );
        if (response.status === 200) {
          setVerifications(response.data);
        }
      } finally {
        setIsLoading(false);
      }
    };
    getVerifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openVerification]);

  const handleModal = async selected => {
    setModalOpen(false);
    setSelectedLabel(selected);
    try {
      setIsLoading(true);
      const response = await getFetchData(`admin/verification?${selected}`);
      if (response.status === 200) {
        setVerifications(response.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = data => {
    setOpenVerification(true);
    setVerificationData(data);
  };

  const handleSearch = async text => {
    try {
      setSearchText(text);
      const foundHistories = verifications.filter(user => {
        return Object.values(user)
          .toString()
          .toLowerCase()
          .includes(text.toLowerCase());
      });
      text ? setIsSearching(true) : setIsSearching(false);
      setSearchData(foundHistories);
    } finally {
    }
  };
  return isLoading ? (
    <>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <BackIcon />
          <BoldText style={styles.headerText}>Verifications</BoldText>
        </Pressable>
      </View>
      <Pressable onPress={() => setModalOpen(true)} style={styles.input}>
        <BoldText style={styles.inputText}>
          {!selectedLabel
            ? 'Select verifications'
            : selectedLabel + ' Verifications'}
        </BoldText>
        <ChevronDown />
      </Pressable>
      <Modal
        visible={modalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setModalOpen(prev => !prev)}>
        <View style={styles.overlay} />
        <Pressable
          style={styles.modalContainer}
          onPress={() => setModalOpen(prev => !prev)}>
          <View style={styles.modal}>
            {verificationStatuses.map(option => (
              <Pressable
                key={option}
                style={styles.select}
                onPress={() => handleModal(option)}>
                <RegularText style={styles.modalSelect}>
                  {option} Verifications
                </RegularText>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
      <View style={styles.flex}>
        <ActivityIndicator
          size={'large'}
          color={'#1e1e1e'}
          style={styles.modal}
        />
      </View>
    </>
  ) : (
    <>
      <FlatList
        data={isSearching ? searchData : verifications}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Pressable
                style={styles.back}
                onPress={() => navigation.goBack()}>
                <BackIcon />
                <BoldText style={styles.headerText}>Verifications</BoldText>
              </Pressable>
            </View>
            <Pressable onPress={() => setModalOpen(true)} style={styles.input}>
              <BoldText style={styles.inputText}>
                {!selectedLabel
                  ? 'Select verifications'
                  : selectedLabel + ' Verifications'}
              </BoldText>
              <ChevronDown />
            </Pressable>
            <Modal
              visible={modalOpen}
              animationType="slide"
              transparent
              onRequestClose={() => setModalOpen(prev => !prev)}>
              <View style={styles.overlay} />
              <Pressable
                style={styles.modalContainer}
                onPress={() => setModalOpen(prev => !prev)}>
                <View style={styles.modal}>
                  {verificationStatuses.map(option => (
                    <Pressable
                      key={option}
                      style={styles.select}
                      onPress={() => handleModal(option)}>
                      <RegularText style={styles.modalSelect}>
                        {option} Verifications
                      </RegularText>
                    </Pressable>
                  ))}
                </View>
              </Pressable>
            </Modal>
            <View style={styles.textInputContainer}>
              <TextInput
                style={{
                  ...styles.textInput,
                  paddingLeft: 10,
                }}
                placeholder={'Search'}
                onChangeText={text => handleSearch(text)}
                value={searchText}
              />
            </View>
          </>
        }
        keyExtractor={({ _id }) => _id}
        renderItem={({ item }) => (
          <Pressable style={styles.id} onPress={() => handleNavigate(item)}>
            <View style={styles.idRowContainer}>
              <View>
                <View style={styles.idRow}>
                  <RegularText>Email:</RegularText>
                  <BoldText>{item.email}</BoldText>
                </View>
                <View style={styles.idRow}>
                  <RegularText>ID:</RegularText>
                  <BoldText>{item.idType}</BoldText>
                </View>
                <View style={styles.idRow}>
                  <RegularText>Submitted at:</RegularText>
                  <BoldText>
                    {new Date(item.createdAt).toLocaleDateString() +
                      ' ' +
                      new Date(item.createdAt).toLocaleTimeString()}
                  </BoldText>
                </View>
              </View>
              <IonIcon name="arrow-forward" size={24} />
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <BoldText style={styles.header}>
            No available {selectedLabel} verifications
          </BoldText>
        }
      />
      {openVerification && (
        <View
          style={styles.container}
          onRequestClose={() => setOpenVerification(false)}>
          <Back onPress={() => setOpenVerification(false)} />
          <Verification
            modalOpen={openVerification}
            setModalOpen={setOpenVerification}
            route={verificationData}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 3 + '%',
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
    fontSize: 18,
  },
  overlay: {
    backgroundColor: '#000',
    opacity: 0.7,
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    height: 100 + '%',
    width: 100 + '%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 100 + '%',
    height: 100 + '%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: 100 + '%',
    maxWidth: 300,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    zIndex: 9,
  },
  select: {
    width: 95 + '%',
    padding: 20,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  modalSelect: {
    textTransform: 'capitalize',
  },
  subHeader: {
    paddingHorizontal: 3 + '%',
    marginVertical: 20,
  },
  transaction: {
    backgroundColor: '#eee',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    marginHorizontal: 3 + '%',
    marginVertical: 10,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5 + '%',
  },
  inputText: {
    fontSize: 16,
    textTransform: 'capitalize',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    alignItems: 'center',
  },
  flex: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50 + '%',
  },
  textInputContainer: {
    paddingHorizontal: 3 + '%',
    paddingBottom: 10,
    marginBottom: 30,
  },
  textInput: {
    color: '#000000',
    borderWidth: 1,
    borderColor: '#bbb',
    marginTop: 20,
    borderRadius: 5,
    height: 35,
    fontFamily: 'OpenSans-400',
  },
  id: {
    paddingHorizontal: 3 + '%',
    paddingBottom: 15,
    marginBottom: 15,
    borderBottomWidth: 0.8,
    borderColor: '#b1b1b1',
  },
  idRow: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 5,
  },
  idRowContainer: {
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    zIndex: 99999,
    position: 'absolute',
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
    backgroundColor: '#fff',
  },
});
export default Verifications;
