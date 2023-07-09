import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PageContainer from '../../components/PageContainer';
import AccInfoCard from '../../components/AccInfoCard';
import RegularText from '../../components/fonts/RegularText';
import ChevronDown from '../../../assets/images/chevron-down-fill.svg';
import CalendarIcon from '../../../assets/images/calendar.svg';
import { useContext, useState } from 'react';
import { AppContext } from '../../components/AppContext';
import SelectCurrencyModal from '../../components/SelectCurrencyModal';
import BoldText from '../../components/fonts/BoldText';
import FlagSelect from '../../components/FlagSelect';

const AccStatement = () => {
  const { selectedCurrency } = useContext(AppContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFormatType, setSelectedFormatType] = useState('');
  const handleDatePicker = () => {
    console.log(Date.now());
  };
  const formatType = ['csv', 'pdf'];
  return (
    <PageContainer padding={true} paddingTop={0}>
      <ScrollView style={styles.body}>
        <AccInfoCard />
        <RegularText style={styles.headerText}>Account Statement</RegularText>
        <RegularText>Select Currency</RegularText>
        <Pressable
          onPress={() => setModalOpen(true)}
          style={styles.selectCurrencyContainer}>
          <View style={styles.textInput}>
            <View style={styles.dateTextContainer}>
              <FlagSelect country={selectedCurrency.currency} />
              <RegularText>{selectedCurrency.currency} Balance</RegularText>
            </View>
            <ChevronDown />
          </View>
        </Pressable>
        <SelectCurrencyModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        />
        <Text style={styles.topUp}>Start Date</Text>
        <Pressable onPress={handleDatePicker} style={styles.textInputContainer}>
          <View style={{ ...styles.textInput, ...styles.textInputStyles }}>
            <View style={styles.dateTextContainer}>
              <View style={styles.calendarIcon}>
                <CalendarIcon width={30} height={30} />
                <RegularText style={styles.newDate}>
                  {new Date().getDate()}
                </RegularText>
              </View>
              <RegularText>DD/MM/YY</RegularText>
            </View>
          </View>
        </Pressable>
        <Text style={styles.topUp}>End Date</Text>
        <Pressable style={styles.textInputContainer} onPress={handleDatePicker}>
          <View style={{ ...styles.textInput, ...styles.textInputStyles }}>
            <View style={styles.dateTextContainer}>
              <View style={styles.calendarIcon}>
                <CalendarIcon width={30} height={30} />
                <RegularText style={styles.newDate}>
                  {new Date().getDate()}
                </RegularText>
              </View>
              <RegularText>DD/MM/YY</RegularText>
            </View>
          </View>
        </Pressable>
        <Text style={styles.topUp}>Format Type</Text>
        <View style={styles.formatType}>
          {formatType.map(type => (
            <Pressable key={type} onPress={() => setSelectedFormatType(type)}>
              <BoldText
                style={
                  selectedFormatType === type
                    ? styles.typeSelected
                    : styles.typeUnselected
                }>
                {type}
              </BoldText>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </PageContainer>
  );
};
const styles = StyleSheet.create({
  body: {
    gap: 15,
    flex: 1,
    paddingHorizontal: 2 + '%',
  },
  headerText: {
    fontSize: 24,
    color: '#525252',
    marginBottom: 10,
  },
  topUp: {
    fontFamily: 'OpenSans-600',
  },
  selectCurrencyContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  textInputContainer: {
    marginTop: 10,
    marginBottom: 0,
  },
  textInput: {
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    height: 50,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    fontFamily: 'OpenSans-600',
  },
  textInputStyles: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    height: 60,
    marginBottom: 30,
  },
  dateTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  calendarIcon: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
  },
  newDate: {
    position: 'absolute',
  },
  formatType: {
    paddingBottom: 80,
    flexDirection: 'row',
    gap: 30,
    paddingVertical: 20,
  },
  typeSelected: {
    borderWidth: 1,
    borderColor: '#868585',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 5,
    textTransform: 'uppercase',
    backgroundColor: '#1E1E1E',
    color: '#fff',
  },
  typeUnselected: {
    borderWidth: 1,
    borderColor: '#868585',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 5,
    textTransform: 'uppercase',
    backgroundColor: '#f9f9f9',
  },
});
export default AccStatement;
