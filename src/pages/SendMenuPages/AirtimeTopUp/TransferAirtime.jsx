import React, { useContext } from 'react';
import { AppContext } from '../../../components/AppContext';
import InputPin from '../../../components/InputPin';
import useFetchData from '../../../../utils/fetchAPI';

const TransferAirtime = ({ navigation, route }) => {
  const { postFetchData } = useFetchData();
  const { formData } = route.params;
  const { setWalletRefresh } = useContext(AppContext);
  const handlePay = async setErrorMessage => {
    const response = await postFetchData(`user/${formData.type}`, formData);
    if (!response.status || response.status !== 200) {
      const errRes =
        response.data?.message?.error ||
        response.data?.message ||
        response.data ||
        response;
      setErrorMessage(errRes?.toString());
      return errRes?.toString();
    }
    setWalletRefresh(prev => !prev);
    navigation.replace('Success', {
      airtime: { ...formData, reference: response.data.reference },
      amountInput: response.data.transaction?.amount || formData.amount,
      dataPlan: formData.plan?.value || undefined,
      transaction: response.data.transaction,
    });
    return response.status;
  };

  return <InputPin customFunc={handlePay} />;
};

export default TransferAirtime;
