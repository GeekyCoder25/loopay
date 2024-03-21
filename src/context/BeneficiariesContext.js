import { createContext, useContext, useEffect, useState } from 'react';
import useFetchData from '../../utils/fetchAPI';

export const BeneficiaryContext = createContext();

const BeneficiaryContextComponent = ({ children }) => {
  const { getFetchData } = useFetchData();

  const [beneficiaryState, setBeneficiaryState] = useState([]);
  const [refetchBeneficiary, setRefetchBeneficiary] = useState(false);

  useEffect(() => {
    const getBeneficiaries = async () => {
      const response = await getFetchData('user/beneficiary');
      if (response.status === 200) {
        setBeneficiaryState(response.data.beneficiaries);
      }
    };
    getBeneficiaries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchBeneficiary]);

  return (
    <BeneficiaryContext.Provider
      value={{ beneficiaryState, setBeneficiaryState, setRefetchBeneficiary }}>
      {children}
    </BeneficiaryContext.Provider>
  );
};

export default BeneficiaryContextComponent;

export const useBeneficiaryContext = () => useContext(BeneficiaryContext);
