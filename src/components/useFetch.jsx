import { useEffect, useState } from 'react';

const useFetch = apiEndpoint => {
  const [fetchData, setFetchData] = useState(null);
  //   const API_URL = `http://192.168.0.101:8000/api/${apiEndpoint}`;
  const API_URL = `http://10.0.2.2:8000/api/${apiEndpoint}`;
  //   console.log(API_URL);
  useEffect(() => {
    (async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        const response = await fetch(API_URL, {
          signal: controller.signal,
        });
        const data = await response.json();
        clearTimeout(timeout);
        setFetchData(data.network);
      } catch (err) {
        setFetchData(err.message);
        console.log(err);
        return err;
      }
    })();
  }, [API_URL, fetchData]);
  return { fetchData };
};

export default useFetch;
