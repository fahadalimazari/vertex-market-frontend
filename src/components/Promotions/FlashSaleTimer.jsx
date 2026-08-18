import { memo, useState, useEffect } from 'react';

const FlashSaleTimer = memo(({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  useEffect(() => {
    let animationFrameId;

    const updateTimer = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        hours: h.toString().padStart(2, '0'),
        minutes: m.toString().padStart(2, '0'),
        seconds: s.toString().padStart(2, '0')
      });

      animationFrameId = requestAnimationFrame(updateTimer);
    };

    animationFrameId = requestAnimationFrame(updateTimer);

    return () => cancelAnimationFrame(animationFrameId);
  }, [targetDate]);

  const TimeBlock = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="bg-white text-gray-900 w-10 h-10 flex items-center justify-center rounded-lg font-black text-xl shadow-inner">
        {value}
      </div>
      <span className="text-[10px] text-gray-300 uppercase font-bold mt-1 tracking-wider">{label}</span>
    </div>
  );

  return (
    <div className="flex items-center justify-center gap-2">
      <TimeBlock value={timeLeft.hours} label="HRS" />
      <div className="text-white font-bold text-xl pb-4 animate-pulse">:</div>
      <TimeBlock value={timeLeft.minutes} label="MIN" />
      <div className="text-white font-bold text-xl pb-4 animate-pulse">:</div>
      <TimeBlock value={timeLeft.seconds} label="SEC" />
    </div>
  );
});

FlashSaleTimer.displayName = 'FlashSaleTimer';
export default FlashSaleTimer;
