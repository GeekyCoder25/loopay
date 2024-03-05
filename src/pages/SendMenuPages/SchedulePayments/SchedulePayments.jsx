import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import BoldText from '../../../components/fonts/BoldText';
import IonIcon from '@expo/vector-icons/Ionicons';
import FaIcon from '@expo/vector-icons/FontAwesome';

const SchedulePayments = ({ navigation }) => {
  const [addNew, setAddNew] = useState(false);
  const schedules = [];

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

  if (schedules.length || addNew) {
    return (
      <PageContainer padding avoidKeyboardPushup>
        <View style={styles.header}>
          <BoldText style={styles.headerText}>Schedule Payments</BoldText>
          <Pressable style={styles.add} onPress={() => setAddNew(true)}>
            <IonIcon name="add-sharp" size={24} color={'#fff'} />
          </Pressable>
        </View>
        <View>
          {schedules.map(schedule => (
            <View key={schedule.id}>{schedule.name}</View>
          ))}
        </View>
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

const styles = StyleSheet.create({
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
});
