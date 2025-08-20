import React, { useEffect, useState, useRef } from 'react';

interface TimerProps {
  isRunning: boolean;
  onTimeChange?: (time: number) => void;
  shouldReset?: boolean;
}

const Timer: React.FC<TimerProps> = ({ isRunning, onTimeChange, shouldReset }) => {
  const [time, setTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (shouldReset) {
      setTime(0);
      onTimeChange?.(0);
    }
  }, [shouldReset, onTimeChange]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1;
          onTimeChange?.(newTime);
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, onTimeChange]);

  return (
    <div className="minesweeper-digital-display">
      {String(time).padStart(3, '0')}
    </div>
  );
};

export default Timer;