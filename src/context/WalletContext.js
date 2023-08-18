import { createContext, useContext, useEffect, useState } from 'react';
import { getFetchData } from '../../utils/fetchAPI';
import { AppContext } from '../components/AppContext';

const WalletContext = createContext();

const WalletContextProvider = ({ children }) => {
  const { amountRefresh } = useContext(AppContext);
  const [wallet, setWallet] = useState(null);
  useEffect(() => {
    getFetchData('user/wallet')
      .then(result => {
        if (result.status === 400) throw new Error(result.data);
        setWallet(result.data);
      })
      .catch(err => {
        console.log(err.message);
        setWallet(null);
      });
  }, [amountRefresh]);
  return (
    <WalletContext.Provider value={{ wallet, setWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContextProvider;
export const useWalletContext = () => useContext(WalletContext);
