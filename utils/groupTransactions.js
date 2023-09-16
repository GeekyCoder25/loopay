export const groupTransactionsByDate = inputArray => {
  const groupedByDate = {};

  inputArray.forEach(transaction => {
    const dateObject = new Date(transaction.createdAt);
    const options = { month: 'short' };
    const date = `${dateObject.getDate()} ${dateObject.toLocaleString(
      'en-US',
      options,
    )} ${dateObject.getFullYear()}`;
    if (!groupedByDate[date]) {
      groupedByDate[date] = [];
    }
    groupedByDate[date].push(transaction);
  });

  const resultArray = Object.keys(groupedByDate).map(date => {
    return {
      date,
      histories: groupedByDate[date],
    };
  });

  return resultArray;
};
