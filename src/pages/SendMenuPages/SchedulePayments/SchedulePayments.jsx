import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import BoldText from '../../../components/fonts/BoldText';
import IonIcon from '@expo/vector-icons/Ionicons';
import FaIcon from '@expo/vector-icons/FontAwesome';
import { deleteFetchData, getFetchData } from '../../../../utils/fetchAPI';
import RegularText from '../../../components/fonts/RegularText';
import { allCurrencies } from '../../../database/data';
import Phone from '../../../../assets/images/airtime.svg';
import BillIcon from '../../../../assets/images/bill.svg';
import SchedulePayment from './SchedulePayment';
import ToastMessage from '../../../components/ToastMessage';
import { addingDecimal } from '../../../../utils/AddingZero';

const SchedulePayments = ({ navigation }) => {
  const [addNew, setAddNew] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  const [isRecurring, setIsRecurring] = useState(false);
  const [scheduleData, setScheduleData] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const getSchedules = async () => {
    const response = await getFetchData('user/schedule');
    if (response.status === 200) {
      setSchedules(response.data);
    }
  };
  useEffect(() => {
    try {
      getSchedules();
    } catch (error) {
    } finally {
      setTimeout(() => {
        setIsLocalLoading(false);
      }, 1000);
    }
  }, []);

  const schedulesType = [
    {
      label: 'Transfer to loopay',
      id: 'loopay',
      navigate: 'SendLoopay',
    },
    {
      label: 'Transfer to other banks',
      id: 'others',
      navigate: 'SendOthers',
    },
    {
      label: 'Bill Payment',
      id: 'bill',
      navigate: 'PayABill',
    },
    {
      label: 'Airtime',
      id: 'airtime',
      navigate: 'BuyAirtime',
    },
    {
      label: 'Data',
      id: 'data',
      navigate: 'BuyData',
    },
  ];

  const symbol = schedule =>
    allCurrencies.find(
      currency =>
        (schedule.transactionData.currency ||
          schedule.transactionData.paymentCurrency) === currency.currency,
    )?.symbol || '';

  const handleEdit = schedule => {
    const {
      _id,
      id,
      title,
      currency,
      frequency,
      period,
      startDate,
      endDate,
      description,
    } = schedule;
    setIsRecurring(true);
    setScheduleData({
      _id,
      title,
      id,
      currency,
      symbol: symbol(schedule),
      frequency,
      period,
      startDate,
      endDate,
      description,
    });
  };

  const handleCancelDelete = () => {
    setToDelete(null);
  };

  const handleDelete = async schedule => {
    try {
      setIsLocalLoading(true);
      const response = await deleteFetchData(`user/schedule/${schedule._id}`);
      if (response.status === 200) {
        setSchedules(prev =>
          prev.filter(prevIndex => prevIndex._id !== schedule._id),
        );
        ToastMessage('Scheduled payment deleted successfully');
        setToDelete(null);
      }
    } finally {
      setIsLocalLoading(false);
    }
  };

  if (isLocalLoading) {
    return (
      <View style={styles.flex}>
        <ActivityIndicator size={'large'} color={'#1e1e1e'} />
      </View>
    );
  }

  if (!addNew && schedules.length) {
    return (
      <PageContainer
        padding
        avoidKeyboardPushup
        scroll
        refreshFunc={getSchedules}>
        <View style={styles.header}>
          <BoldText style={styles.headerText}>Schedule Payments</BoldText>
          <Pressable style={styles.add} onPress={() => setAddNew(true)}>
            <IonIcon name="add-sharp" size={24} color={'#fff'} />
          </Pressable>
        </View>
        <View style={styles.schedules}>
          {schedules.map(schedule => (
            <View key={schedule._id} style={styles.schedule}>
              <View style={styles.scheduleRowImage}>
                <ScheduleTypeIcon schedule={schedule} />
                <View style={styles.cardContent}>
                  <BoldText>{schedule.title}</BoldText>
                  <View style={styles.scheduleRow}>
                    <RegularText>Frequency: </RegularText>
                    <BoldText>{schedule.frequency.label}</BoldText>
                  </View>
                  <Type schedule={schedule} />
                  <View style={styles.scheduleRow}>
                    <RegularText>Amount: </RegularText>
                    <BoldText>
                      {symbol(schedule) +
                        addingDecimal(
                          Number(
                            schedule.transactionData.amount,
                          ).toLocaleString(),
                        )}
                    </BoldText>
                  </View>
                  <View style={styles.scheduleRow}>
                    <RegularText>Start Date: </RegularText>
                    <BoldText>
                      {new Date(schedule.startDate).toLocaleDateString()}
                    </BoldText>
                  </View>
                  <View style={styles.scheduleRow}>
                    <RegularText>End Date: </RegularText>
                    <BoldText>
                      {schedule.endDate
                        ? new Date(schedule.endDate).toLocaleDateString()
                        : 'Not Provided'}
                    </BoldText>
                  </View>
                  {schedule.description && (
                    <View style={styles.scheduleRow}>
                      <RegularText>Description: </RegularText>
                      <RegularText>{schedule.description}</RegularText>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.scheduleFooter}>
                <View />
                <View style={styles.scheduleFooter}>
                  <Pressable onPress={() => handleEdit(schedule)}>
                    <FaIcon name="edit" size={24} />
                  </Pressable>
                  <Pressable onPress={() => setToDelete(schedule)}>
                    <FaIcon name="trash" size={24} />
                  </Pressable>
                </View>
              </View>
            </View>
          ))}

          {scheduleData && (
            <SchedulePayment
              isEditing
              refreshFunc={getSchedules}
              type={scheduleData.type}
              isRecurring={isRecurring}
              setIsRecurring={setIsRecurring}
              scheduleData={scheduleData}
              setScheduleData={setScheduleData}
            />
          )}
        </View>

        <Modal
          visible={toDelete && true}
          onRequestClose={handleCancelDelete}
          transparent>
          <Pressable style={styles.overlay} onPress={handleCancelDelete} />
          <View style={styles.toDeleteModalContainer}>
            <View style={styles.toDeleteModal}>
              <BoldText style={styles.headerText}>Confirm Delete</BoldText>
              <View style={styles.choices}>
                <Pressable
                  style={styles.yes}
                  onPress={() => handleDelete(toDelete)}>
                  <BoldText>Yes</BoldText>
                </Pressable>
                <Pressable style={styles.no} onPress={handleCancelDelete}>
                  <BoldText style={styles.noText}>No</BoldText>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </PageContainer>
    );
  }

  return (
    <PageContainer padding avoidKeyboardPushup>
      <BoldText style={styles.headerText}>Schedule Transfer Type</BoldText>

      <View style={styles.scheduleTypes}>
        {schedulesType.map(type => (
          <TouchableOpacity
            key={type.id}
            style={styles.scheduleType}
            onPress={() =>
              navigation.navigate(type.navigate, { schedule: type })
            }>
            <BoldText>{type.label}</BoldText>
            <FaIcon name="chevron-right" />
          </TouchableOpacity>
        ))}
      </View>
    </PageContainer>
  );
};

export default SchedulePayments;

const ScheduleTypeIcon = ({ schedule }) => {
  switch (schedule.transactionType) {
    case 'loopay':
      return (
        <Image
          source={require('../../../../assets/images/icon.png')}
          style={styles.loopayImage}
          resizeMode="contain"
        />
      );
    case 'others':
      return (
        <View>
          <FaIcon name="bank" size={24} color={'#1e1e1e'} />
        </View>
      );
    case 'airtime':
      return <Phone width={30} height={30} />;
    case 'data':
      return <FaIcon name="wifi" size={30} />;
    case 'bill':
      return <BillIcon width={30} height={30} />;

    default:
      break;
  }
};

const Type = ({ schedule }) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  switch (schedule.frequency.id) {
    case 'hourly':
      return (
        <View style={styles.scheduleRow}>
          <RegularText>Minute: </RegularText>
          <BoldText>{schedule.minute}</BoldText>
        </View>
      );
    case 'daily':
      return (
        <View style={styles.scheduleRow}>
          <RegularText>Time: </RegularText>
          <BoldText>
            {schedule.hour}:
            {schedule.minute
              ? schedule.minute.length === 1 && '0' + schedule.minute
              : '00'}
          </BoldText>
        </View>
      );
    case 'weekly':
      return (
        <View style={styles.scheduleRow}>
          <RegularText>Day: </RegularText>
          <BoldText>{schedule.dayOfWeek}</BoldText>
        </View>
      );
    case 'monthly':
      return (
        <View style={styles.scheduleRow}>
          <RegularText>Date: </RegularText>
          <BoldText>{schedule.dateOfMonth}</BoldText>
        </View>
      );
    case 'annually':
      return (
        <View style={styles.scheduleRow}>
          <RegularText>Month: </RegularText>
          <BoldText>{months[schedule.month + 1]}</BoldText>
        </View>
      );

    default:
      break;
  }
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
  },
  add: {
    backgroundColor: '#1e1e1e',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  schedules: {
    paddingHorizontal: '2%',
  },
  schedule: {
    gap: 10,
    marginBottom: 30,
    elevation: 5,
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 5,
  },
  scheduleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
  },
  scheduleRowImage: {
    flexDirection: 'row',
    gap: 10,
  },
  cardContent: {
    gap: 10,
  },
  scheduleRow: {
    flexDirection: 'row',
  },
  loopayImage: {
    width: 30,
    height: 30,
    borderRadius: 50,
  },
  container: {
    paddingHorizontal: 3 + '%',
    paddingTop: 20,
  },
  scheduleTypes: {
    marginVertical: 30,
    rowGap: 30,
  },

  scheduleType: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 5,
    elevation: 3,
    backgroundColor: '#eee',
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
  toDeleteModalContainer: {
    width: 100 + '%',
    height: 100 + '%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toDeleteModal: {
    borderRadius: 20,
    zIndex: 9,
    backgroundColor: '#fff',
    maxWidth: 300,
    width: 100 + '%',
    paddingTop: 20,
    gap: 10,
    padding: 3 + '%',
    alignItems: 'center',
  },
  choices: {
    gap: 25,
    flexDirection: 'row',
    marginVertical: 15,
  },
  no: {
    borderColor: '#1e1e1e',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#1e1e1e',
  },
  noText: {
    color: '#fff',
  },
  yes: {
    borderColor: '#1e1e1e',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
});
