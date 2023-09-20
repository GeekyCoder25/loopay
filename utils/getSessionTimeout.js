import { getFetchData } from './fetchAPI';

const getSessionTimeout = async () => {
  const getSessions = await getFetchData('user/session');
  console.log(getSessions);
};

export default getSessionTimeout;
