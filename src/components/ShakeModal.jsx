import { Image, Modal, Pressable, StyleSheet, View } from 'react-native';
import React, { useContext } from 'react';
import { AppContext } from './AppContext';
import Phone from '../../assets/images/airtime.svg';
import SwapIcon from '../../assets/images/swapBeneficiary.svg';
import BillIcon from '../../assets/images/bill.svg';
import AddIcon from '../../assets/images/addBeneficiary.svg';
import FaIcon from '@expo/vector-icons/FontAwesome';
import BoldText from './fonts/BoldText';
import { useNavigation } from '@react-navigation/native';

const ShakeModal = () => {
  const { openShake, setOpenShake } = useContext(AppContext);
  const { navigate } = useNavigation();

  const handleModal = () => {
    setOpenShake(prev => !prev);
  };

  const shortcuts = [
    {
      routeName: 'MobileTop up',
      routeIcon: <Phone />,
      routeNavigate: 'AirtimeTopUpNavigator',
    },
    {
      routeName: 'Send to Loopay',
      routeIcon: (
        <Image
          source={require('../../assets/icon.png')}
          style={{ width: 50, height: 50, borderRadius: 50 }}
          resizeMode="contain"
        />
      ),
      routeNavigate: 'SendLoopay',
    },
    {
      routeName: 'Send to Others',
      routeDetails: 'Buy airtime via VTU',
      routeIcon: <FaIcon name="bank" size={24} color={'#1e1e1e'} />,
      routeNavigate: 'SendOthers',
    },
    {
      routeName: 'Pay Bill',
      routeIcon: <BillIcon />,
      routeNavigate: 'PayABill',
    },
    {
      routeName: 'Swap Funds',
      routeIcon: <SwapIcon />,
      routeNavigate: 'SwapFunds',
    },
    {
      routeName: 'Add Money',
      routeIcon: <AddIcon />,
      routeNavigate: 'AddMoneyFromHome',
    },
  ];
  return (
    <Modal
      visible={openShake}
      animationType="fade"
      transparent
      onRequestClose={handleModal}>
      <View style={styles.modalContainer}>
        <View style={styles.modal}>
          <View style={styles.shortcuts}>
            {shortcuts.slice(0, 3).map(link => (
              <Pressable
                onPress={() => {
                  setOpenShake(false);
                  navigate(link.routeNavigate);
                }}
                style={styles.route}
                key={link.routeNavigate}>
                <View style={styles.routeIcon}>{link.routeIcon}</View>
                <View style={styles.routeText}>
                  <BoldText>{link.routeName}</BoldText>
                </View>
              </Pressable>
            ))}
          </View>
          <View style={styles.shortcuts}>
            {shortcuts.slice(3, 6).map(link => (
              <Pressable
                onPress={() => {
                  setOpenShake(false);
                  navigate(link.routeNavigate);
                }}
                style={styles.route}
                key={link.routeNavigate}>
                <View style={styles.routeIcon}>{link.routeIcon}</View>
                <View style={styles.routeText}>
                  <BoldText>{link.routeName}</BoldText>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
        <Pressable style={styles.overlay} onPress={handleModal} />
      </View>
    </Modal>
  );
};

export default ShakeModal;

const styles = StyleSheet.create({
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
    height: 100 + '%',
    width: 100 + '%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: 95 + '%',
    maxWidth: 400,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    zIndex: 9,
    paddingVertical: 20,
    gap: 30,
  },
  shortcuts: {
    flexDirection: 'row',
    paddingHorizontal: 5 + '%',
    justifyContent: 'space-between',
    gap: 30,
  },
  route: {
    gap: 10,
    alignItems: 'center',
    width: 100,
    height: 100,
  },
  routeIcon: {
    borderColor: '#1e1e1e',
    borderWidth: 0.5,
    width: 50,
    height: 50,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
});
