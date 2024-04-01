import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import PageContainer from '../../../components/PageContainer';
import BoldText from '../../../components/fonts/BoldText';
import RegularText from '../../../components/fonts/RegularText';
import Check from '../../../../assets/images/success.svg';
import Pending from '../../../../assets/images/pending.svg';
import Block from '../../../../assets/images/blocked.svg';
import ChevronDown from '../../../../assets/images/chevron-down.svg';

const DashboardLoader = () => {
  return (
    <>
      <PageContainer style={styles.container} scroll>
        <View style={{ ...styles.cardHeader }}>
          <Pressable style={styles.plus}>
            <ChevronDown />
          </Pressable>
          <View style={styles.cardHeaderBalance}>
            <BoldText>Balance</BoldText>
          </View>
          <BoldText style={styles.cardHeaderAmount}>{'***'}</BoldText>
        </View>
        <View style={styles.transactions}>
          <Pressable style={styles.transaction}>
            <View style={styles.icon}>
              <Check />
            </View>
            <View style={styles.transactionDetails}>
              <BoldText style={styles.transactionTitle}>
                Successful Transactions
              </BoldText>
              <BoldText style={styles.transactionLength}>{0}</BoldText>
              <BoldText style={styles.success}>{'***'}</BoldText>
            </View>
          </Pressable>
          <Pressable style={styles.transaction}>
            <View style={styles.icon}>
              <Pending />
            </View>
            <View style={styles.transactionDetails}>
              <BoldText style={styles.transactionTitle}>
                Pending Transactions
              </BoldText>
              <BoldText style={styles.transactionLength}>{0}</BoldText>
              <BoldText>{'***'}</BoldText>
            </View>
          </Pressable>
          <Pressable style={styles.transaction}>
            <View style={styles.icon}>
              <Block />
            </View>
            <View style={styles.transactionDetails}>
              <BoldText style={styles.transactionTitle}>
                Blocked Transactions
              </BoldText>
              <BoldText style={styles.transactionLength}>{0}</BoldText>
              <BoldText style={styles.blocked}>{'***'}</BoldText>
            </View>
          </Pressable>
          <View style={styles.sessions}>
            <BoldText style={styles.sessionHeader}>Active Percentage</BoldText>
            <View style={styles.total}>
              <BoldText style={styles.totalNo}>{0}</BoldText>
              <RegularText style={styles.totalText}>Total</RegularText>
            </View>
            <View style={styles.sessionGraph}>
              <View
                style={{
                  ...styles.sessionActive,
                }}
              />
            </View>
            <View style={styles.statusContainer}>
              <Pressable style={styles.status}>
                <View style={styles.activeBg} />
                <View>
                  <RegularText style={styles.statusText}>Online</RegularText>
                  <BoldText style={styles.statusNo}>{0} user</BoldText>
                </View>
              </Pressable>

              <Pressable style={styles.status}>
                <View style={styles.totalBg} />
                <View>
                  <RegularText style={styles.statusText}>Offline</RegularText>
                  <BoldText style={styles.statusNo}>- user</BoldText>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </PageContainer>

      <Modal visible={true} animationType="fade" transparent>
        <Pressable style={styles.overlay} />
        <View style={styles.modalContainer}>
          <ActivityIndicator
            size={'large'}
            color={'#1e1e1e'}
            style={styles.modal}
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    opacity: 0.7,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 99,
  },
  cardHeader: {
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 5,
    marginTop: 10,
  },
  plus: {
    alignSelf: 'flex-end',
  },
  cardHeaderBalance: {
    backgroundColor: '#e4e2e2',
    padding: 5,
    paddingHorizontal: 30,
    borderRadius: 4,
  },
  cardHeaderAmount: {
    color: '#fff',
    fontSize: 28,
    marginTop: 25,
  },
  modalContainer: {
    position: 'absolute',
    height: 100 + '%',
    width: 100 + '%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  container: {
    paddingHorizontal: 5 + '%',
    paddingBottom: 50,
  },
  transactions: {
    marginTop: 30,
    gap: 15,
  },
  transaction: {
    backgroundColor: '#eee',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 7,
  },
  icon: {
    paddingRight: 15,
  },
  transactionDetails: {
    borderLeftWidth: 0.5,
    flex: 1,
    paddingLeft: 15,
    gap: 5,
  },
  transactionTitle: {
    fontSize: 18,
    color: '#525252',
  },
  transactionLength: {
    fontSize: 24,
    color: '#000',
    marginBottom: 10,
  },
  success: {
    color: '#2A5A00',
  },
  blocked: { color: '#E20010' },
  sessions: {
    backgroundColor: '#eee',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 15,
    borderRadius: 7,
  },
  sessionHeader: {
    color: '#11263C',
    fontSize: 18,
  },
  total: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  totalNo: {
    fontSize: 30,
    color: '#11263C',
  },
  totalText: {
    fontSize: 18,
    color: '#868585',
    marginBottom: 5,
  },
  sessionGraph: {
    width: 100 + '%',
    height: 15,
    backgroundColor: '#cfcfcf',
    borderRadius: 10,
  },
  sessionActive: {
    backgroundColor: '#525252',
    height: 100 + '%',
    borderRadius: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  status: {
    flexDirection: 'row',
    paddingRight: 30,
    gap: 15,
    alignItems: 'center',
  },
  activeBg: {
    backgroundColor: '#525252',
    width: 30,
    height: 5,
    borderRadius: 3,
    marginBottom: 24,
  },
  totalBg: {
    backgroundColor: '#cfcfcf',
    width: 30,
    height: 5,
    borderRadius: 3,
    marginBottom: 24,
  },
  statusText: {
    color: '#525252',
    fontSize: 16,
  },
  statusNo: {
    color: '#11263C',
    fontSize: 18,
  },
});

export default DashboardLoader;
