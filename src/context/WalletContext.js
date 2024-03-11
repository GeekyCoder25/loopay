import { createContext, memo, useContext, useEffect, useState } from 'react';
import { getFetchData } from '../../utils/fetchAPI';
import { AppContext } from '../components/AppContext';
import { allCurrencies } from '../database/data';
import useInterval from '../../utils/hooks/useInterval';
import { logoutUser } from '../../utils/storage';
import ToastMessage from '../components/ToastMessage';

const WalletContext = createContext();

const WalletContextComponent = memo(({ children }) => {
  const {
    walletRefresh,
    selectedCurrency,
    setShowConnected,
    refreshing,
    setIsLoading,
    isLoggedIn,
    setIsLoggedIn,
    setAppData,
    setCanChangeRole,
    setVerified,
  } = useContext(AppContext);
  const [wallet, setWallet] = useState({ balance: 0 });
  const [transactions, setTransactions] = useState([]);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      setVerified(false);
      logoutUser();
      setIsLoggedIn(false);
      setAppData({});
      setCanChangeRole(false);
      allCurrencies.shift();
      ToastMessage('Your account has been logged in on another device');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWallet = () => {
    getFetchData('user/wallet')
      .then(response => {
        if (response.status === 401 && isLoggedIn) {
          return handleLogout();
        }
        if (response.status === 400) throw new Error(response.data);
        if (refreshing) {
          setShowConnected(true);
          setTimeout(() => {
            setShowConnected(false);
          }, 3000);
        }
        walletToSet(response.data);
      })
      .catch(err => {
        console.log(err.message);
        setWallet(null);
      });

    getFetchData(
      `user/transaction?currency=${selectedCurrency.currency},${selectedCurrency.acronym}&limit=4`,
    )
      .then(response => {
        if (response.status === 400) throw new Error(response.data);
        setTransactions(response.data.data);
      })
      .catch(err => {
        console.log(err.message);
        setTransactions([]);
      });
  };

  const walletToSet = result => {
    const otherWalletBalances = {
      localBalance: result.walletLocal?.balance,
      dollarBalance: result.walletDollar?.balance,
      euroBalance: result.walletEuro?.balance,
      poundBalance: result.walletPound?.balance,
      [`${result.walletLocal.currency}Balance`]: result.walletLocal?.balance,
    };

    allCurrencies.forEach(currency => {
      const activeCurrency = ['dollar', 'euro', 'pound'].includes(
        currency.currency,
      )
        ? currency.currency
        : 'local';

      return (currency.status =
        result[
          `wallet${
            activeCurrency.charAt(0).toUpperCase() + activeCurrency.slice(1)
          }`
        ].status);
    });

    switch (selectedCurrency.currency) {
      case 'naira':
        return setWallet({ ...result.walletLocal, ...otherWalletBalances });
      case 'dollar':
        return setWallet({
          ...result.walletDollar,
          ...otherWalletBalances,
          bank: 'Zenith Bank',
          accNo: '5072353973',
        });
      case 'euro':
        return setWallet({
          ...result.walletEuro,
          ...otherWalletBalances,
          bank: 'Zenith Bank',
          accNo: '5080557042',
        });
      case 'pound':
        return setWallet({
          ...result.walletPound,
          ...otherWalletBalances,
          bank: 'Zenith Bank',
          accNo: '0615762864',
        });
      default:
        return setWallet({
          ...result.walletLocal,
          ...otherWalletBalances,
        });
    }
  };

  useEffect(() => {
    fetchWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletRefresh, selectedCurrency]);

  useInterval(() => {
    fetchWallet();
  }, 60000);

  return (
    <WalletContext.Provider
      value={{ wallet, setWallet, transactions, setTransactions }}>
      {children}
    </WalletContext.Provider>
  );
});

export default WalletContextComponent;
export const useWalletContext = () => useContext(WalletContext);
