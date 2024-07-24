import { useContext } from 'react';
import { getToken } from './storage';
import { AppContext } from '../src/components/AppContext';
import { allCurrencies } from '../src/database/data';
import ToastMessage from '../src/components/ToastMessage';

// export const apiUrl = 'http://10.0.2.2:8000/api';
// export const apiUrl = 'http://172.20.10.2:8000/api';
// export const apiUrl = 'http://192.168.50.247:8000/api';
// export const apiUrl = 'http://192.168.188.102:8000/api';
export const apiUrl = 'https://loopay-api.koyeb.app/api';

const timeoutSeconds = 30;

const useFetchData = () => {
  const {
    isLoggedIn,
    setIsLoggedIn,
    setAppData,
    setCanChangeRole,
    setVerified,
    setIsAdmin,
  } = useContext(AppContext);

  const handleLogout = async message => {
    setIsLoggedIn(false);
    setVerified(false);
    setIsAdmin(false);
    setAppData({});
    setCanChangeRole(false);
    allCurrencies.length > 3 && allCurrencies.shift();
    ToastMessage(
      message.includes('authorized')
        ? 'Session timed out, login again to continue using the app'
        : 'Your account has been logged in on another device',
    );
  };

  const getFetchData = async apiEndpoint => {
    const API_URL = `${apiUrl}/${apiEndpoint}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
      return { data: "Couldn't connect to server", status: 404 };
    }, timeoutSeconds * 1000);
    const token = await getToken();

    try {
      const response = await fetch(API_URL, {
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      clearTimeout(timeout);
      const data = await response.json();
      if (response.status === 401 && isLoggedIn) {
        await handleLogout(data);
      }
      return { data, status: response.status };
    } catch (err) {
      clearTimeout(timeout);
      return "Couldn't connect to server";
    }
  };

  const postFetchData = async (apiEndpoint, bodyData, token) => {
    const API_URL = `${apiUrl}/${apiEndpoint}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
      return { data: "Couldn't connect to server", status: 404 };
    }, timeoutSeconds * 1000);
    token = token || (await getToken());

    function removeTrailingWhiteSpace(obj) {
      const newObj = {};

      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          if (typeof value === 'string') {
            newObj[key] = value.trimRight(); // Removes trailing white spaces
          } else {
            newObj[key] = value;
          }
        }
      }

      return newObj;
    }
    bodyData = removeTrailingWhiteSpace(bodyData);

    try {
      const response = await fetch(API_URL, {
        signal: controller.signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });
      clearTimeout(timeout);
      const data = await response.json();
      if (response.status === 401 && isLoggedIn) {
        await handleLogout(data);
      }
      return { data, status: response.status };
    } catch (err) {
      clearTimeout(timeout);
      return "Couldn't connect to server";
    }
  };

  const putFetchData = async (apiEndpoint, bodyData) => {
    const API_URL = `${apiUrl}/${apiEndpoint}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
      return { data: "Couldn't connect to server", status: 404 };
    }, timeoutSeconds * 1000);
    const token = await getToken();

    try {
      const response = await fetch(API_URL, {
        signal: controller.signal,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });
      clearTimeout(timeout);
      const data = await response.json();
      if (response.status === 401 && isLoggedIn) {
        await handleLogout(data);
      }
      return { data, status: response.status };
    } catch (err) {
      clearTimeout(timeout);
      return "Couldn't connect to server";
    }
  };

  const deleteFetchData = async (apiEndpoint, bodyData) => {
    const API_URL = `${apiUrl}/${apiEndpoint}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
      return { data: "Couldn't connect to server", status: 404 };
    }, timeoutSeconds * 1000);
    const token = await getToken();

    try {
      const response = await fetch(API_URL, {
        signal: controller.signal,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });
      clearTimeout(timeout);
      const data = await response.json();
      if (response.status === 401 && isLoggedIn) {
        await handleLogout(data);
      }
      return { data, status: response.status };
    } catch (err) {
      clearTimeout(timeout);
      return "Couldn't connect to server";
    }
  };
  return { getFetchData, postFetchData, putFetchData, deleteFetchData };
};

export default useFetchData;
