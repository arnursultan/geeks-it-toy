import { useEffect, useState } from 'react';
import { event } from '../config';

type CountdownValue = { days: number; hours: number; minutes: number; seconds: number; started: boolean };

function getCountdown(): CountdownValue {
  const remaining = Date.parse(event.dateTime) - Date.now();
  if (remaining <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, started: true };
  const totalSeconds = Math.floor(remaining / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    started: false,
  };
}

const units = [
  { key: 'days', label: 'ДНИ' },
  { key: 'hours', label: 'ЧАСЫ' },
  { key: 'minutes', label: 'МИНУТЫ' },
  { key: 'seconds', label: 'СЕКУНДЫ' },
] as const;

export default function Countdown() {
  const [time, setTime] = useState(getCountdown);
  useEffect(() => {
    const timer = window.setInterval(() => setTime(getCountdown()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (time.started) return <div className="countdown-status" role="status"><span className="live-dot"/> IT ТОЙ УЖЕ НАЧАЛСЯ</div>;

  return <div className="countdown-grid" aria-label={`До мероприятия: ${time.days} дней, ${time.hours} часов, ${time.minutes} минут`}>
    {units.map(({ key, label }) => <div className="countdown-unit" key={key}><strong key={time[key]}>{String(time[key]).padStart(2, '0')}</strong><span>{label}</span></div>)}
  </div>;
}
