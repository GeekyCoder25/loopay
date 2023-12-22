import { useContext, useEffect } from 'react';
import { Accelerometer } from 'expo-sensors';
import { AppContext } from './AppContext';

const THRESHOLD = 500;

const useShakeEvent = handler => {
  const { isShaking } = useContext(AppContext);

  useEffect(() => {
    let last_x, last_y, last_z;
    let lastUpdate = 0;

    const setupAccelerometer = async () => {
      const isAvailable = await Accelerometer.isAvailableAsync();
      if (isAvailable) {
        const listener = Accelerometer.addListener(accelerometerData => {
          if (!isShaking) {
            const { x, y, z } = accelerometerData;
            const currTime = Date.now();

            if (currTime - lastUpdate > 100) {
              const diffTime = currTime - lastUpdate;
              lastUpdate = currTime;
              const speed =
                (Math.abs(x + y + z - last_x - last_y - last_z) / diffTime) *
                10000;
              if (speed > THRESHOLD) {
                handler();
              }
              last_x = x;
              last_y = y;
              last_z = z;
            }
          }
        });

        return () => {
          listener.remove();
        };
      }
    };
    setupAccelerometer();
  }, [handler, isShaking]);
};

export default useShakeEvent;
