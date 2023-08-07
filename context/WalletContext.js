import { createContext, useContext, useEffect, useState } from 'react';
import { getFetchData } from '../utils/fetchAPI';

const WalletContext = createContext();

const WalletContextProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  useEffect(() => {
    getFetchData('user/wallet').then(result => setWallet(result.data));
  }, []);
  return (
    <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>
  );
};

export default WalletContextProvider;
export const useWalletContext = () => useContext(WalletContext);
