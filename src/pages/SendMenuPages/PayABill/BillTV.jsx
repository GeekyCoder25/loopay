import { ActivityIndicator, StyleSheet, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import SelectInputField from './PayABillFields';
import { postFetchData } from '../../../../utils/fetchAPI';
import BoldText from '../../../components/fonts/BoldText';
import FaIcon from '@expo/vector-icons/FontAwesome';
import { AppContext } from '../../../components/AppContext';

const BillTV = ({
  fields,
  stateFields,
  setStateFields,
  setErrorMessage,
  errorKey,
  setErrorKey,
  globalApiBody,
  setGlobalApiBody,
  setIsButtonDisabled,
  selectedCurrency,
}) => {
  const { appData } = useContext(AppContext);
  const [providers, setProviders] = useState([]);
  const [providerServices, setProviderServices] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const countryCode = appData.country.code;

  useEffect(() => {
    if (
      providers.length &&
      providerServices.length &&
      customerName &&
      stateFields.amount
    ) {
      return setIsButtonDisabled(false);
    }
    setIsButtonDisabled(true);
  }, [
    customerName,
    providerServices.length,
    providers.length,
    setIsButtonDisabled,
    stateFields,
  ]);

  const fetchProviders = async () => {
    const response = await postFetchData(
      `user/bill-merchants?type=tv&country=${countryCode}`,
    );
    if (response.status === 200) {
      const data = response.data;
      return setProviders(data);
    }
  };

  useEffect(() => {
    fetchProviders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProviderServices = async body => {
    const response = await postFetchData('user/bill-services', {
      ...globalApiBody,
      ...body,
    });
    if (response.status === 200) {
      const data = response.data;
      return setProviderServices(data);
    }
  };

  const fetchCustomerDetails = async body => {
    try {
      setIsChecking(true);
      setCustomerName('');
      if (body.inputText) {
        const response = await postFetchData('user/bill-validate', {
          ...globalApiBody,
          meterNo: body.inputText,
        });
        if (response.status === 200) {
          const data = response.data;
          if (providers.length && providerServices.length) {
            setCustomerName(data.customerName);
          }
        } else {
          setErrorMessage("Can't find customer details");
        }
      }
    } finally {
      setIsChecking(false);
    }
  };

  const handleAmountInput = body => {};

  return (
    <View>
      <SelectInputField
        selectInput={{
          title: 'Select Provider',
          type: 'select',
          placeholder: 'Select Provider',
          id: 'provider',
        }}
        fields={fields}
        stateFields={stateFields}
        setStateFields={setStateFields}
        errorKey={errorKey}
        setErrorMessage={setErrorMessage}
        setErrorKey={setErrorKey}
        selectedCurrency={selectedCurrency}
        modalData={providers}
        onRefetch={fetchProviders}
        onChange={fetchProviderServices}
        setGlobalApiBody={setGlobalApiBody}
      />
      <SelectInputField
        selectInput={{
          title: 'Subscription',
          type: 'select',
          placeholder: 'Select subscription',
          id: 'meterType',
        }}
        fields={fields}
        stateFields={stateFields}
        setStateFields={setStateFields}
        errorKey={errorKey}
        setErrorMessage={setErrorMessage}
        setErrorKey={setErrorKey}
        selectedCurrency={selectedCurrency}
        modalData={providerServices}
        setGlobalApiBody={setGlobalApiBody}
        onRefetch={fetchProviderServices}
        showModalPrice
      />
      <SelectInputField
        selectInput={{
          title: 'Enter Card Number',
          type: 'input',
          placeholder: 'Enter Card number',
          id: 'meterNo',
        }}
        fields={fields}
        stateFields={stateFields}
        setStateFields={setStateFields}
        errorKey={errorKey}
        setErrorMessage={setErrorMessage}
        setErrorKey={setErrorKey}
        selectedCurrency={selectedCurrency}
        modalData={providerServices}
        setGlobalApiBody={setGlobalApiBody}
        onChange={fetchCustomerDetails}
      />
      {isChecking ? (
        <View style={styles.loader}>
          <ActivityIndicator color={'green'} />
        </View>
      ) : (
        customerName && (
          <View>
            <View style={styles.successMessage}>
              <FaIcon name="check-circle" size={20} color="green" />
              <BoldText style={styles.successMessageText}>
                {customerName}
              </BoldText>
            </View>
          </View>
        )
      )}

      <SelectInputField
        selectInput={{
          title: 'Message',
          type: 'input',
          placeholder: '(optional)',
          id: 'description',
          optional: true,
          inputMode: 'text',
        }}
        fields={fields}
        stateFields={stateFields}
        setStateFields={setStateFields}
        errorKey={errorKey}
        setErrorMessage={setErrorMessage}
        setErrorKey={setErrorKey}
        selectedCurrency={selectedCurrency}
        modalData={providerServices}
        setGlobalApiBody={setGlobalApiBody}
        onChange={handleAmountInput}
      />
    </View>
  );
};

export default BillTV;

const styles = StyleSheet.create({
  loader: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  successMessage: {
    flexDirection: 'row',
    marginLeft: 2,
    gap: 5,
    marginBottom: 20,
  },
  successMessageText: {
    color: 'green',
  },
});
