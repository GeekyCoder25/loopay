import {
  Image,
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import React, { useContext, useState } from 'react';
import BoldText from '../../../components/fonts/BoldText';
import PageContainer from '../../../components/PageContainer';
import RegularText from '../../../components/fonts/RegularText';
import ChevronDown from '../../../../assets/images/chevron-down-fill.svg';
import { AppContext } from '../../../components/AppContext';
import FlagSelect from '../../../components/FlagSelect';
import SelectCurrencyModal from '../../../components/SelectCurrencyModal';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../../components/Button';
import ToastMessage from '../../../components/ToastMessage';
import { useWalletContext } from '../../../context/WalletContext';
import ErrorMessage from '../../../components/ErrorMessage';

const CreateCard = ({ navigation }) => {
  const { appData, selectedCurrency, vh } = useContext(AppContext);
  const { wallet } = useWalletContext();
  const [openCurrencyModal, setOpenCurrencyModal] = useState(false);
  const [cardType, setCardType] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const cardTypes = [
    {
      type: 'physical',
      isAvailable: false,
    },
    {
      type: 'virtual',
      isAvailable: true,
    },
  ];

  return (
    <PageContainer padding>
      <BoldText style={styles.headerText}>Create Card</BoldText>

      <View style={styles.form}>
        <View>
          <RegularText style={styles.label}>Select account</RegularText>
          <Pressable
            onPress={() => setOpenCurrencyModal(true)}
            style={styles.textInputContainer}>
            <View style={styles.textInput}>
              <View style={styles.flagContainer}>
                <FlagSelect country={selectedCurrency.currency} />
                <RegularText style={styles.currencyName}>
                  {selectedCurrency.currency} Account
                </RegularText>
              </View>

              <ChevronDown />
            </View>
          </Pressable>
          <SelectCurrencyModal
            modalOpen={openCurrencyModal}
            setModalOpen={setOpenCurrencyModal}
          />
        </View>
        <View>
          <RegularText style={styles.label}>Select a card type</RegularText>
          <View>
            {cardTypes.map(card =>
              !card.isAvailable ? (
                <View key={card.type} style={styles.card}>
                  <View style={styles.cardHeaderRow}>
                    <Pressable
                      style={styles.cardHeader}
                      onPress={() => setCardType(card.type)}>
                      <BoldText style={styles.cardHeaderText}>
                        {card.type} Card
                      </BoldText>
                    </Pressable>
                    <View style={styles.soon}>
                      <BoldText style={styles.soonText}>COMING SOON</BoldText>
                    </View>
                  </View>
                </View>
              ) : (
                <View key={card.type} style={styles.card}>
                  <Pressable
                    style={styles.cardHeader}
                    onPress={() => setCardType(card.type)}>
                    {card.type === cardType ? (
                      <Ionicons name="radio-button-on-outline" size={24} />
                    ) : (
                      <Ionicons name="radio-button-off-outline" size={24} />
                    )}
                    <BoldText style={styles.cardHeaderText}>
                      {card.type} Card
                    </BoldText>
                  </Pressable>
                  <View style={styles.atm}>
                    <ImageBackground
                      source={require('../../../../assets/images/atmBg.png')}
                      style={{ ...styles.atmBg, height: vh * 0.25 }}>
                      <Image
                        source={require('../../../../assets/images/atmBgLeft.png')}
                        style={styles.bg}
                      />
                      <Image
                        source={require('../../../../assets/images/atmBgLeft.png')}
                        style={styles.bgRight}
                      />
                      <View style={styles.atmInner}>
                        <View style={styles.atmTop}>
                          <Image
                            source={require('../../../../assets/icon2.png')}
                            style={styles.logo}
                            resizeMode="contain"
                          />
                          <BoldText style={styles.loopay}>LOOPAY</BoldText>
                        </View>
                      </View>
                    </ImageBackground>
                  </View>
                </View>
              ),
            )}
          </View>
        </View>
      </View>
      {cardType && selectedCurrency && (
        <View style={styles.button}>
          <Button
            text={`Get a Virtual ${selectedCurrency.acronym} Card`}
            onPress={() => {
              if (!selectedCurrency.isLocal) {
                return setShowConfirm(true);
              }
              ToastMessage(
                `${selectedCurrency.acronym} virtual card created successfully`,
              );
              navigation.replace('CardCreateSuccess', {
                fullName: appData.fullName,
                card_no: (Math.random() * 1000000000000000000)
                  .toFixed(0)
                  .slice(0, 16),
                exp_month: new Date().getMonth(),
                exp_year: new Date().getFullYear() + 5,
                cvc: (Math.random() * 10000).toFixed(0).slice(0, 3),
              });
            }}
          />
        </View>
      )}

      <Modal transparent visible={showConfirm}>
        <View style={styles.deleteContainer}>
          <Pressable style={styles.overlay} />
          <View style={styles.deleteModal}>
            <BoldText>Alert</BoldText>
            <RegularText>
              You will be charged a one time payment of{' '}
              <BoldText>{selectedCurrency.symbol}5 </BoldText>
              to create a {selectedCurrency.acronym} card, do you wish to
              continue with your card creation
            </RegularText>
            <View style={styles.buttons}>
              <Button
                text={'Cancel'}
                onPress={() => {
                  setErrorMessage('');
                  setShowConfirm(false);
                }}
                style={styles.cancel}
              />
              <Button
                text={'Confirm'}
                style={styles.confirm}
                color={'#000'}
                onPress={() => {
                  wallet.balance < 5
                    ? setErrorMessage(
                        `Insufficient funds, recharge your ${selectedCurrency.acronym} account`,
                      )
                    : navigation.replace('CardCreateSuccess', {
                        fullName: appData.fullName,
                        card_no: (Math.random() * 1000000000000000000)
                          .toFixed(0)
                          .slice(0, 16),
                        exp_month: new Date().getMonth(),
                        exp_year: new Date().getFullYear() + 5,
                        cvc: (Math.random() * 10000).toFixed(0).slice(0, 3),
                      });
                }}
              />
            </View>
            <ErrorMessage errorMessage={errorMessage} />
          </View>
        </View>
      </Modal>
    </PageContainer>
  );
};

export default CreateCard;

const styles = StyleSheet.create({
  headerText: {
    fontSize: 24,
  },
  form: {
    marginVertical: 30,
    flex: 1,
  },
  label: {
    fontFamily: 'OpenSans-400',
  },
  textInputContainer: {
    position: 'relative',
    marginTop: 10,
    marginBottom: 25,
  },
  textInput: {
    borderRadius: 5,
    backgroundColor: '#eee',
    height: 50,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    fontFamily: 'OpenSans-600',
  },
  textInputStyles: {
    paddingLeft: 50,
    fontSize: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  currencyName: { textTransform: 'capitalize' },
  card: {
    marginVertical: 20,
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 10,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
  },
  cardHeaderText: {
    textTransform: 'capitalize',
  },
  soon: {
    backgroundColor: '#1E1E1E',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 7,
  },
  soonText: {
    color: '#fff',
  },
  atm: {
    marginHorizontal: '5%',
    marginVertical: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  atmBg: {
    width: 100 + '%',
    borderRadius: 15,
    position: 'relative',
  },
  bg: {
    position: 'absolute',
    left: -50,
    bottom: -30,
  },
  bgRight: {
    position: 'absolute',
    right: -55,
    bottom: -50,
  },
  atmInner: {
    flex: 1,
    paddingVertical: 20,
    paddingLeft: 10,
    paddingRight: 20,
    justifyContent: 'space-between',
    gap: 20,
  },
  atmTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 50,
    height: 50,
    marginLeft: 10,
  },
  loopay: {
    color: '#cdcdcd',
    fontSize: 24,
    fontFamily: 'OpenSans-800',
  },
  button: {
    marginBottom: 30,
  },
  deleteContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteModal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    width: '90%',
    rowGap: 10,
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
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  confirm: {
    backgroundColor: '#fff',
    borderWidth: 1,
    flex: 1,
  },
  cancel: {
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    marginVertical: 10,
    gap: 20,
  },
});
