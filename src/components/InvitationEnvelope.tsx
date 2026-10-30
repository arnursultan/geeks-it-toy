import { useEffect, useRef, useState } from 'react';
import { event } from '../config';

type Props = { onComplete: () => void; onDismiss: () => void };

function playOpenSound() {
  const AudioContextClass = window.AudioContext;
  if (!AudioContextClass) return;
  try {
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(460, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(125, context.currentTime + 0.32);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.1, context.currentTime + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.36);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.38);
    oscillator.onended = () => { void context.close(); };
  } catch { /* Audio is an optional enhancement. */ }
}

export default function InvitationEnvelope({ onComplete, onDismiss }: Props) {
  const [opening, setOpening] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(timer => window.clearTimeout(timer)), []);

  const open = () => {
    if (opening) return;
    setOpening(true);
    if (soundEnabled) playOpenSound();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    timers.current.push(window.setTimeout(onComplete, reducedMotion ? 10 : 1420));
    timers.current.push(window.setTimeout(() => setExiting(true), reducedMotion ? 180 : 1830));
    timers.current.push(window.setTimeout(onDismiss, reducedMotion ? 380 : 2260));
  };

  return <div className={`envelope-overlay ${opening ? 'envelope-is-opening' : ''} ${exiting ? 'envelope-exiting' : ''}`} role="dialog" aria-modal="true" aria-label="Приглашение на IT Той">
    <div className="envelope-backdrop"/>
    <div className="envelope-scene">
      <p className="envelope-overline"><span className="live-dot"/> ПРИГЛАШЕНИЕ / {event.dateShort}</p>
      <button className="envelope-shell" type="button" onClick={open} disabled={opening} autoFocus aria-label="Открыть приглашение на IT Той">
        <span className="envelope-back"/>
        <span className="envelope-letter"><span className="letter-top"><img src={event.officialGeeksLogo} alt="Geeks"/><small>ОШ · КЫРГЫЗСТАН</small></span><strong>IT ТОЙ</strong><span className="letter-subtitle">{event.dateShort}&nbsp;&nbsp; · &nbsp;&nbsp;{event.startTime}</span><span className="letter-rule"/><small className="letter-kyrgyz">Келечекке бирге кадам таштайлы.</small><span className="letter-code">GEEKS / INVITATION 001</span></span>
        <span className="envelope-pocket"/><span className="envelope-flap"/>
        <span className="envelope-seal" aria-hidden="true"><i>✳</i></span>
        <span className="envelope-pattern pattern-left"/><span className="envelope-pattern pattern-right"/>
      </button>
      <div className="envelope-caption"><div><strong>IT ТОЙ · ОШ</strong><span>Сизге чакыруу бар</span><small>{opening ? 'КОНВЕРТ АЧЫЛУУДА...' : 'Нажмите, чтобы открыть'}</small></div></div>
      <div className="envelope-controls"><button type="button" className={soundEnabled ? 'sound-switch sound-on' : 'sound-switch'} onClick={() => setSoundEnabled(!soundEnabled)} aria-pressed={soundEnabled}>{soundEnabled ? '♫ ЗВУК ВКЛ.' : '♫ ЗВУК ВЫКЛ.'}</button><span>{event.dateLabel.toUpperCase()} · {event.city.toUpperCase()}</span></div>
    </div>
  </div>;
}
