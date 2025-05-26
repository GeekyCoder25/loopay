import PageContainer from '../../components/PageContainer';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import BalanceCard from './components/BalanceCard';
import BoldText from '../../components/fonts/BoldText';
import Button from '../../components/Button';
import RegularText from '../../components/fonts/RegularText';
import { useContext, useEffect, useState } from 'react';
import { addingDecimal } from '../../../utils/AddingZero';
import { AppContext } from '../../components/AppContext';
import Donut from './components/Donut';
import DateTimePicker from '@react-native-community/datetimepicker';
import CalendarIcon from '../../../assets/images/calendar.svg';
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import ToastMessage from '../../components/ToastMessage';
import { useAdminDataContext } from '../../context/AdminContext';
import { setShowBalance } from '../../../utils/storage';
import useFetchData from '../../../utils/fetchAPI';

const Statement = () => {
  const { getFetchData } = useFetchData();
  const { selectedCurrency, setIsLoading, showAmount, setShowAmount } =
    useContext(AppContext);
  const { adminData } = useAdminDataContext();
  const [income, setIncome] = useState(0);
  const [outcome, setOutcome] = useState(0);
  const [onHold, setOnHold] = useState(0);
  const [summary, setSummary] = useState({});
  const [showPicker, setShowPicker] = useState(false);
  const [startValue, setStartValue] = useState('DD/MM/YYYY');
  const [endValue, setEndValue] = useState('DD/MM/YYYY');
  const [generateData, setGenerateData] = useState({
    start: '',
    end: '',
  });

  useEffect(() => {
    const getSummary = async () => {
      try {
        const response = await getFetchData(
          `admin/summary?currency=${selectedCurrency.currency},${selectedCurrency.acronym}`,
        );

        if (response.status === 200) {
          setSummary(response.data.data);
        }
      } finally {
      }
    };
    getSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCurrency]);

  useEffect(() => {
    setIncome(summary.income?.amount || 0);
    setOutcome(summary.outgoing?.amount || 0);
    setOnHold(summary.pending?.amount || 0);
  }, [selectedCurrency, summary]);

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
    const { start, end } = generateData;
    if (!start || !end) {
      return ToastMessage('Please provide all the required data');
    }
    setIsLoading(true);
    const response = await getFetchData(
      `admin/statement?start=${start}&end=${end}&currency=${selectedCurrency.currency}`,
    );
    const { data } = response.data;

    let totalCredit = data
      .filter(index => index.transactionType === 'credit')
      .map(index => Number(index.amount));
    totalCredit = totalCredit.length ? totalCredit?.reduce((a, b) => a + b) : 0;

    let totalDebit = data
      .filter(index => index.transactionType !== 'credit')
      .map(index => Number(index.amount));
    totalDebit = totalDebit.length ? totalDebit?.reduce((a, b) => a + b) : 0;

    const currency = ['dollar', 'euro', 'pound'].includes(
      selectedCurrency.currency,
    )
      ? selectedCurrency.currency
      : 'local';

    const asideItems = [
      {
        label: 'Currency',
        value: selectedCurrency.acronym,
      },
      {
        label: 'Balance',
        value:
          selectedCurrency.symbol +
          ' ' +
          addingDecimal(
            adminData.allBalances[`${currency}Balance`].toLocaleString(),
          ),
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
                <th>User</th>
                <th>Date</th>
                <th>Debit</th>
                <th>Credit</th>
              </tr>
              ${data
                .map(element => {
                  return element.transactionType === 'credit'
                    ? String.raw`
                        <tr>
                          <td>${element.email}</td>
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
                          <td>${element.email}</td>
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
                <td colspan="2">
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
  };

  const createPDF = async html => {
    const filename = 'statement.pdf';
    const mimeType = 'application/pdf';
    const { uri } = await Print.printToFileAsync({ html });
    // if (saveType === 'share') {
    //   await shareAsync(uri, { UTI: '.pdf', mimeType });
    //   return setIsLoading(false);
    // }
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

  const handleShow = () => {
    setShowAmount(prev => !prev);
    setShowBalance(!showAmount);
  };
  return (
    <PageContainer style={styles.container} scroll>
      <BalanceCard />
      <View style={styles.body}>
        <BoldText style={styles.headerText}>Account Summary</BoldText>
        <View style={styles.card}>
          <View style={styles.chart}>
            {!income && !outcome && !onHold ? (
              <View>
                <Pressable onPress={handleShow}>
                  <BoldText>
                    {showAmount ? selectedCurrency.symbol + '0.00' : '***'}
                  </BoldText>
                </Pressable>
                <RegularText>Label</RegularText>
              </View>
            ) : (
              <Donut
                percentage={100}
                // delay={500 + 100 * i}
                max={income + outcome + onHold}
                income={income}
                outcome={outcome}
                onHold={onHold}
              />
            )}
          </View>
          <View style={styles.labelsContainer}>
            <View style={styles.labels}>
              <View style={styles.status}>
                <View style={{ ...styles.statusBg, ...styles.incomeBg }} />
                <View>
                  <RegularText style={styles.statusText}>Income</RegularText>
                  <Pressable onPress={handleShow}>
                    <BoldText style={styles.statusNo}>
                      {showAmount
                        ? selectedCurrency.symbol +
                          addingDecimal(income.toLocaleString())
                        : '***'}
                    </BoldText>
                  </Pressable>
                </View>
              </View>
              <View style={styles.status}>
                <View style={{ ...styles.statusBg, ...styles.outcomeBg }} />
                <View>
                  <RegularText style={styles.statusText}>Outcome</RegularText>
                  <Pressable onPress={handleShow}>
                    <BoldText style={styles.statusNo}>
                      {showAmount
                        ? selectedCurrency.symbol +
                          addingDecimal(outcome.toLocaleString())
                        : '***'}
                    </BoldText>
                  </Pressable>
                </View>
              </View>
              <View style={styles.status}>
                <View style={{ ...styles.statusBg, ...styles.onHoldBg }} />
                <View>
                  <RegularText style={styles.statusText}>Onhold</RegularText>
                  <Pressable onPress={handleShow}>
                    <BoldText style={styles.statusNo}>
                      {showAmount
                        ? selectedCurrency.symbol +
                          addingDecimal(onHold.toLocaleString())
                        : '***'}
                    </BoldText>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </View>

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
        <Button
          text="Download Statement"
          style={styles.button}
          onPress={handleGenerate}
        />
      </View>
    </PageContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5 + '%',
  },
  card: {
    backgroundColor: '#EEEEEE',
    minHeight: 200,
    marginVertical: 10,
    marginBottom: 30,
    flexDirection: 'row',
    // alignItems: 'center',
    paddingVertical: 20,
  },
  headerText: {
    color: '#11263C',
    fontSize: 16,
  },
  body: {
    marginTop: 30,
  },
  chart: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  labels: {
    gap: 5,
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
  },
  status: {
    flexDirection: 'row',
    paddingRight: 30,
    gap: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBg: {
    width: 40,
    height: 5,
    borderRadius: 3,
    marginBottom: 20,
  },
  incomeBg: {
    backgroundColor: '#00102b',
  },
  outcomeBg: {
    backgroundColor: '#777f8c',
  },
  onHoldBg: {
    backgroundColor: '#bec2c7',
  },
  statusText: {
    color: '#868585',
    fontSize: 18,
    fontFamily: 'OpenSans-600',
  },
  statusNo: {
    color: '#11263C',
    fontSize: 18,
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
    color: '#000000',
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
  button: {
    marginBottom: 50,
  },
});

export default Statement;
