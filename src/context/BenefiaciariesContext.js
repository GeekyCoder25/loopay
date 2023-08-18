import { createContext, useContext, useEffect, useState } from 'react';
import { getFetchData } from '../../utils/fetchAPI';

export const BeneficiaryContext = createContext();

const BeneficiaryProvider = ({ children }) => {
  const [beneficiaryState, setBeneficiaryState] = useState(null);
  useEffect(() => {
    const getBeneficiaires = async () => {
      const response = await getFetchData('user/beneficiary');
      if (response.status === 200) {
        setBeneficiaryState(response.data.beneficiaries);
      }
    };
    getBeneficiaires();
  }, []);
  return (
    <BeneficiaryContext.Provider
      value={{ beneficiaryState, setBeneficiaryState }}>
      {children}
    </BeneficiaryContext.Provider>
  );
};

export default BeneficiaryProvider;
export const useBenefifciaryContext = () => useContext(BeneficiaryContext);
