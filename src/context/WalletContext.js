import { createContext, useContext, useEffect, useState } from 'react';
import { getFetchData } from '../../utils/fetchAPI';
import { AppContext } from '../components/AppContext';

const WalletContext = createContext();

const WalletContextComponent = ({ children }) => {
  const { walletRefresh, selectedCurrency } = useContext(AppContext);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getFetchData('user/wallet')
      .then(result => {
        if (result.status === 400) throw new Error(result.data);
        walletToSet(result.data);
      })
      .catch(err => {
        console.log(err.message);
        setWallet(null);
      });

    getFetchData('user/transaction?swap=true')
      .then(result => {
        if (result.status === 400) throw new Error(result.data);
        setTransactions(result.data.transactions);
      })
      .catch(err => {
        console.log(err.message);
        setTransactions([]);
      });

    const walletToSet = result => {
      const otherWalletBalances = {
        nairaBalance: result.walletNaira?.balance,
        dollarBalance: result.walletDollar?.balance,
        euroBalance: result.walletEuro?.balance,
        poundBalance: result.walletPound?.balance,
      };

      switch (selectedCurrency.currency) {
        case 'naira':
          return setWallet({ ...result.walletNaira, ...otherWalletBalances });
        case 'dollar':
          return setWallet({ ...result.walletDollar, ...otherWalletBalances });
        case 'euro':
          return setWallet({ ...result.walletEuro, ...otherWalletBalances });
        case 'pound':
          return setWallet({ ...result.walletPound, ...otherWalletBalances });
        default:
          return setWallet({ ...result.walletNaira, ...otherWalletBalances });
      }
    };
  }, [walletRefresh, selectedCurrency]);

  useEffect(() => {}, [wallet]);
  return (
    <WalletContext.Provider
      value={{ wallet, setWallet, transactions, setTransactions }}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContextComponent;
export const useWalletContext = () => useContext(WalletContext);
