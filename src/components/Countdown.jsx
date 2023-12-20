import { useState, useEffect } from 'react';
import BoldText from './fonts/BoldText';

const Countdown = ({ targetDate, message, message2 }) => {
  const calculateTimeLeft = () => {
    const in24Hours = new Date(targetDate).getHours() + 24;
    const difference = +new Date(targetDate).setHours(in24Hours) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [time, setTime] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTime(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const formatTime = value => {
    return value < 10 ? `0${value}` : value;
  };

  const { hours, minutes, seconds } = time;
  return (
    <BoldText>
      {message + formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}.{' '}
      {message2}
    </BoldText>
  );
};

export default Countdown;
