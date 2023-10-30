import { getToken } from './storage';

// export const apiUrl = 'http://10.0.2.2:8000/api';
export const apiUrl = 'http://192.168.212.8:8000/api';
// export const apiUrl = 'https://loopay-api.cyclic.app/api';

export const getFetchData = async apiEndpoint => {
  const API_URL = `${apiUrl}/${apiEndpoint}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
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
    return { data, status: response.status };
  } catch (err) {
    return "Couldn't connect to server";
  }
};

export const postFetchData = async (apiEndpoint, bodyData, token) => {
  const API_URL = `${apiUrl}/${apiEndpoint}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
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
    return { data, status: response.status };
  } catch (err) {
    console.log(err);
    return "Couldn't connect to server";
  }
};

export const putFetchData = async (apiEndpoint, bodyData) => {
  const API_URL = `${apiUrl}/${apiEndpoint}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
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
    return { data, status: response.status };
  } catch (err) {
    console.log(err);
    return "Couldn't connect to server";
  }
};

export const deleteFetchData = async (apiEndpoint, bodyData) => {
  const API_URL = `${apiUrl}/${apiEndpoint}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
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
    return { data, status: response.status };
  } catch (err) {
    console.log(err);
    return "Couldn't connect to server";
  }
};
