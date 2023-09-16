import { createContext, useContext, useEffect, useState } from 'react';
import { getFetchData } from '../../utils/fetchAPI';

export const BeneficiaryContext = createContext();

const BeneficiaryContextComponent = ({ children }) => {
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
