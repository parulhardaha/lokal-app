import { useEffect, useState } from 'react';

// Accept optional startTime. If no startTime is provided, the hook returns "00:00"
export const useSessionTimer = (startTime?: number | null) => {
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    if (!startTime) {
      setDuration(0);
      return;
    }

    const update = () => setDuration(Date.now() - startTime);

    update();
    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = () => {
    const totalSeconds = Math.floor(duration / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return formatTime();
};
