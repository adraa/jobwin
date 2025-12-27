import React, { useState, useEffect } from 'react';

export const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(23, 59, 59, 999);

      const diff = midnight.getTime() - now.getTime();

      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const TimeBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-neo-black text-white font-bold font-display text-xl md:text-3xl w-12 h-12 md:w-16 md:h-16 rounded-lg flex items-center justify-center shadow-lg">
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-[10px] md:text-xs text-neo-muted mt-1 uppercase tracking-wide">{label}</span>
    </div>
  );

  return (
    <div className="flex flex-col items-center mb-8">
      <p className="text-sm md:text-base text-neo-muted mb-3 font-medium">
        <span className="inline-block animate-shake">⏰</span> Offer ends in:
      </p>
      <div className="flex items-center gap-2 md:gap-3">
        <TimeBox value={timeLeft.hours} label="Hours" />
        <span className="text-2xl md:text-3xl font-bold text-neo-black -mt-5">:</span>
        <TimeBox value={timeLeft.minutes} label="Mins" />
        <span className="text-2xl md:text-3xl font-bold text-neo-black -mt-5">:</span>
        <TimeBox value={timeLeft.seconds} label="Secs" />
      </div>
    </div>
  );
};
