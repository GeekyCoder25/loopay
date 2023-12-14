import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
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
import DateTimePicker from '@react-native-community/datetimepicker';
import Button from '../../components/Button';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { getFetchData } from '../../../utils/fetchAPI';
import { addingDecimal } from '../../../utils/AddingZero';
import { useWalletContext } from '../../context/WalletContext';
import * as FileSystem from 'expo-file-system';
import ToastMessage from '../../components/ToastMessage';

const AccStatement = () => {
  const { selectedCurrency, appData, setIsLoading } = useContext(AppContext);
  const { wallet } = useWalletContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFormatType, setSelectedFormatType] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [startValue, setStartValue] = useState('DD/MM/YYYY');
  const [endValue, setEndValue] = useState('DD/MM/YYYY');
  const formatTypes = ['csv', 'pdf'];
  const [generateData, setGenerateData] = useState({
    start: '',
    end: '',
    format: '',
  });

  const handleDatePicker = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate > Date.now()) {
      selectedDate = new Date(Date.now());
    }
    switch (event.type) {
      case 'set':
        if (showPicker === 'start') {
          selectedDate.setMilliseconds(0);
          selectedDate.setSeconds(0);
          selectedDate.setMinutes(0);
          selectedDate.setHours(0);
          setStartValue(new Date(selectedDate).toLocaleDateString('en-GB'));
          setGenerateData(prev => {
            return {
              ...prev,
              start: selectedDate,
            };
          });
        } else if (showPicker === 'end') {
          if (generateData.start && generateData.start > selectedDate) {
            selectedDate = new Date(Date.now());
          }
          selectedDate.setMilliseconds(999);
          selectedDate.setSeconds(59);
          selectedDate.setMinutes(59);
          selectedDate.setHours(23);
          setEndValue(new Date(selectedDate).toLocaleDateString('en-GB'));
          setGenerateData(prev => {
            return {
              ...prev,
              end: selectedDate,
            };
          });
        }
        break;

      default:
        break;
    }
  };

  const handleGenerate = async saveType => {
    const { start, end, format } = generateData;
    if (!start || !end || !format) {
      return ToastMessage('Please provide all the required data');
    }
    setIsLoading(true);
    const response = await getFetchData(
      `user/statement?start=${start}&end=${end}&format=${format}&currency=${selectedCurrency.currency}`,
    );
    const { data } = response;

    let totalCredit = data
      .filter(index => index.transactionType === 'credit')
      .map(index => Number(index.amount));
    totalCredit = totalCredit.length ? totalCredit?.reduce((a, b) => a + b) : 0;

    let totalDebit = data
      .filter(index => index.transactionType !== 'credit')
      .map(index => Number(index.amount));
    totalDebit = totalDebit.length ? totalDebit?.reduce((a, b) => a + b) : 0;

    const asideItems = [
      { label: 'Name', value: appData.userProfile.fullName.toUpperCase() },
      { label: 'Account Number', value: wallet.loopayAccNo },
      { label: 'Tag Name', value: '#' + appData.tagName },
      {
        label: 'Currency',
        value: selectedCurrency.acronym,
      },
      {
        label: 'Balance',
        value:
          selectedCurrency.symbol +
          ' ' +
          addingDecimal(Number(wallet.balance).toLocaleString()),
      },
    ];

    const dateOptions = {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    };
    // if (format === 'pdf') {
    const html = String.raw`
      <html lang="en">
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <title>Loopay Statement</title>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap');

            body {
              font-family: Inter, 'sans-serif';
              padding: 25px;
              max-width: 800px;
              margin: auto;
            }

            .logo {
              display: flex;
              align-items: center;
              height: 50px;
              margin-bottom: 30px;
              border-bottom: 0.5px solid grey;
              padding-bottom: 50px;
              gap: 20px;
            }
            .logo span {
              margin-left: auto;
            }
            aside {
              display: flex;
              flex-direction: column;
              margin-left: auto;
              margin-bottom: 100px;
              gap: 25px;
            }

            aside div {
              display: flex;
              justify-content: flex-end;
              align-items: center;
              padding-right: 30px;
              gap: 10px;
            }
            aside span {
              width: 150px;
            }
            aside h4 {
              width: 150px;
              text-align: right;
              font-size: 1.2rem;
              margin: 0;
            }
            table {
              border: 1px solid grey;
              border-collapse: collapse;
              max-width: 800px;
              margin: auto;
            }
            th {
              width: 10%;
              height: 35px;
              font-size: 1.2rem;
            }
            td {
              padding: 10px 0;
              width: 10%;
              height: 40px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="logo">
            <img
              src="https://res.cloudinary.com/geekycoder/image/upload/v1688782340/loopay/logo.png"
              style="width: 50px; height: 50px; border-radius: 50%"
              alt="icon" />
            <img
              src="https://res.cloudinary.com/geekycoder/image/upload/v1688782340/loopay/appIcon.png"
              style="width: 200px; margin: 50px 0"
              alt="loopay logo" />
            <span
              >Generated on
              ${new Date(Date.now()).toLocaleDateString(
                'en-US',
                dateOptions,
              )}</span
            >
          </div>
          <aside>
            ${asideItems
              .map(
                item => String.raw`
                  <div>
                    <span>${item.label}:</span>
                    <h4>${item.value}</h4>
                  </div>
                `,
              )
              .join('')}
          </aside>
          <h2 style="">
            Transaction account statement from
            ${new Date(start).toLocaleDateString('en-US', dateOptions)} -
            ${new Date(end).toLocaleDateString('en-US', dateOptions)}
          </h2>
          <section>
            <table border>
              <tr>
                <th>Date</th>
                <th>Debit</th>
                <th>Credit</th>
              </tr>
              ${data
                .map(element => {
                  return element.transactionType === 'credit'
                    ? String.raw`
                        <tr>
                          <td>
                            <p style="margin: 0; padding-bottom: 2px">
                              ${new Date(element.createdAt).toLocaleDateString(
                                'en-US',
                                dateOptions,
                              )}
                            </p>
                            <p style="margin: 0; padding-bottom: 2px">
                              ${new Date(
                                element.createdAt,
                              ).toLocaleTimeString()}
                            </p>
                          </td>
                          <td></td>
                          <td>
                            ${
                              selectedCurrency.symbol +
                              ' ' +
                              addingDecimal(
                                Number(element.amount).toLocaleString(),
                              )
                            }
                          </td>
                        </tr>
                      `
                    : String.raw`
                        <tr>
                          <td>
                            <p style="margin: 0; padding-bottom: 2px">
                              ${new Date(element.createdAt).toLocaleDateString(
                                'en-US',
                                dateOptions,
                              )}
                            </p>
                            <p style="margin: 0; padding-bottom: 2px">
                              ${new Date(
                                element.createdAt,
                              ).toLocaleTimeString()}
                            </p>
                          </td>
                          <td>
                            ${
                              selectedCurrency.symbol +
                              ' ' +
                              addingDecimal(
                                Number(element.amount).toLocaleString(),
                              )
                            }
                          </td>
                          <td></td>
                        </tr>
                      `;
                })
                .join('')}
              <tr>
                <td>
                  <h2
                    style="
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0;
              ">
                    TOTAL
                  </h2>
                </td>
                <td>
                  <i
                    class="fas fa-arrow-up-short-wide fa-2x"
                    style="color: red; margin-right: 10px"></i>
                  ${
                    selectedCurrency.symbol +
                    ' ' +
                    addingDecimal(Number(totalDebit).toLocaleString())
                  }
                </td>
                <td>
                  <i
                    class="fas fa-arrow-down-short-wide fa-2x"
                    style="color: green; margin-right: 10px"></i>
                  ${
                    selectedCurrency.symbol +
                    ' ' +
                    addingDecimal(Number(totalCredit).toLocaleString())
                  }
                </td>
              </tr>
            </table>
          </section>
        </body>
      </html>
    `;
    createPDF(html, saveType);
    // } else {
    createCSV();
  };

  const createCSV = () => {};

  const createPDF = async (html, saveType) => {
    const filename = 'statement.pdf';
    const mimeType = 'application/pdf';
    const { uri } = await Print.printToFileAsync({ html });
    if (saveType === 'share') {
      await shareAsync(uri, { UTI: '.pdf', mimeType });
      return setIsLoading(false);
    }
    if (Platform.OS === 'android') {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          filename,
          mimeType,
        )
          .then(async res => {
            await FileSystem.writeAsStringAsync(res, base64, {
              encoding: FileSystem.EncodingType.Base64,
            });
            ToastMessage('Saved to local storage');
          })
          .catch(err => {
            shareAsync(uri, { UTI: '.pdf', mimeType });
            ToastMessage(err);
          })
          .finally(() => setIsLoading(false));
      } else {
        await shareAsync(uri, { UTI: '.pdf', mimeType });
      }
    } else {
      await shareAsync(uri, { UTI: '.pdf', mimeType });
    }
    setIsLoading(false);
  };

  const defaultPickerDate = () => {
    switch (showPicker) {
      case 'start':
        return startValue !== 'DD/MM/YYYY'
          ? generateData.start
          : new Date(Date.now());
      case 'end':
        return endValue !== 'DD/MM/YYYY'
          ? generateData.end
          : new Date(Date.now());
      default:
        return new Date(Date.now());
    }
  };

  const handleSave = () => handleGenerate('save');
  const handleShare = () => handleGenerate('share');

  return (
    <PageContainer padding paddingTop={0} style={styles.body} scroll>
      <AccInfoCard />
      <RegularText style={styles.headerText}>Account Statement</RegularText>
      <RegularText>Select Currency</RegularText>
      <Pressable
        onPress={() => setModalOpen(true)}
        style={styles.selectCurrencyContainer}>
        <View style={styles.textInput}>
          <View style={styles.dateTextContainer}>
            <FlagSelect country={selectedCurrency.currency} />
            <RegularText style={styles.currencyType}>
              {selectedCurrency.currency} Balance
            </RegularText>
          </View>
          <ChevronDown />
        </View>
      </Pressable>
      <SelectCurrencyModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={defaultPickerDate()}
          onChange={handleDatePicker}
        />
      )}
      <Text style={styles.topUp}>Start Date</Text>
      <Pressable
        onPress={() => setShowPicker('start')}
        style={styles.textInputContainer}>
        <View style={{ ...styles.textInput, ...styles.textInputStyles }}>
          <View style={styles.dateTextContainer}>
            <View style={styles.calendarIcon}>
              <CalendarIcon width={30} height={30} />
              <RegularText style={styles.newDate}>
                {new Date().getDate()}
              </RegularText>
            </View>
            <RegularText>{startValue}</RegularText>
          </View>
        </View>
      </Pressable>
      <Text style={styles.topUp}>End Date</Text>
      <Pressable
        style={styles.textInputContainer}
        onPress={() => setShowPicker('end')}>
        <View style={{ ...styles.textInput, ...styles.textInputStyles }}>
          <View style={styles.dateTextContainer}>
            <View style={styles.calendarIcon}>
              <CalendarIcon width={30} height={30} />
              <RegularText style={styles.newDate}>
                {new Date().getDate()}
              </RegularText>
            </View>
            <RegularText>{endValue}</RegularText>
          </View>
        </View>
      </Pressable>
      <Text style={styles.topUp}>Format Type</Text>
      <View style={styles.formatType}>
        {formatTypes.map(format => (
          <Pressable
            key={format}
            onPress={() => {
              setSelectedFormatType(format);
              setGenerateData(prev => {
                return {
                  ...prev,
                  format,
                };
              });
            }}>
            <BoldText
              style={
                selectedFormatType === format
                  ? styles.typeSelected
                  : styles.typeUnselected
              }>
              {format}
            </BoldText>
          </Pressable>
        ))}
      </View>
      <View style={styles.buttons}>
        <Button
          text={'Generate Statement'}
          onPress={handleSave}
          style={styles.button}
        />
        <Button
          text={'Share Statement'}
          onPress={handleShare}
          style={styles.button}
        />
      </View>
    </PageContainer>
  );
};
const styles = StyleSheet.create({
  body: {
    gap: 15,
    paddingHorizontal: 5 + '%',
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
  currencyType: {
    textTransform: 'capitalize',
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
  buttons: {},
  button: {
    // maxWidth: 50 + '%',
  },
});
export default AccStatement;
