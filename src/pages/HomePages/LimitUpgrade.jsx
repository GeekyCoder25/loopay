import React from 'react';
import LimitUpgradeCard from '../../components/LimitUpgradeCard';

const LimitUpgrade = ({ route }) => {
  const limit = route.params;

  return <LimitUpgradeCard limit={limit} />;
};

export default LimitUpgrade;
