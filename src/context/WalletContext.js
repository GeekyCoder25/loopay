import { createContext, useContext, useEffect, useState } from 'react';
import { getFetchData } from '../../utils/fetchAPI';
import { AppContext } from '../components/AppContext';

const WalletContext = createContext();

const WalletContextComponent = ({ children }) => {
  const { amountRefresh, selectedCurrency } = useContext(AppContext);
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    const fetchNairaWallet = () => {
      getFetchData('user/wallet')
        .then(result => {
          if (result.status === 400) throw new Error(result.data);
          setWallet(result.data);
        })
        .catch(err => {
          console.log(err.message);
          setWallet(null);
        });
    };
    const fetchDollarWallet = () => {
      getFetchData('user/dollar-wallet')
        .then(result => {
          if (result.status === 400) throw new Error(result.data);
          setWallet(result.data);
        })
        .catch(err => {
          console.log(err.message);
          setWallet(null);
        });
    };

    switch (selectedCurrency.currency) {
      case 'Naira':
        return fetchNairaWallet();
      case 'Dollar':
        return fetchDollarWallet();
      case 'Euro':
        return fetchDollarWallet();
      case 'Pound':
        return fetchDollarWallet();
      default:
        return fetchNairaWallet();
    }
  }, [amountRefresh, selectedCurrency]);

  return (
    <WalletContext.Provider value={{ wallet, setWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContextComponent;
export const useWalletContext = () => useContext(WalletContext);
