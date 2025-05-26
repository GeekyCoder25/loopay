import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FaIcon from '@expo/vector-icons/FontAwesome';
import BoldText from './fonts/BoldText';

const RecurringSwitch = ({
  isRecurring,
  setIsRecurring,
  scheduleData,
  setScheduleData,
  setHasAskedPin,
  type,
}) => {
  const handlePress = () => {
    setIsRecurring(prev => !prev);
    !scheduleData && setScheduleData({});
    setHasAskedPin(false);
  };

  const transactionType =
    (type && type === 'loopay') || type === 'others' ? 'transfer' : 'payment';
  return (
    <View style={styles.container}>
      <BoldText>Make this a recurring {transactionType}</BoldText>

      <TouchableOpacity onPress={handlePress}>
        {isRecurring ? (
          <FaIcon name="toggle-on" size={30} color={'#000'} />
        ) : (
          <FaIcon name="toggle-off" size={30} color={'#000'} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default RecurringSwitch;

const styles = StyleSheet.create({
  container: {
    // marginVertical: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 15,
  },
});
