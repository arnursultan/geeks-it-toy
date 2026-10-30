import { useEffect, useRef, useState } from 'react';
import { event } from '../config';

const SEEN_KEY = 'it-toy-terminal-seen-v1';

export default function TerminalGreeting({ replayKey = 0, start = false }: { replayKey?: number; start?: boolean }) {
  const [printed, setPrinted] = useState<string[]>([]);
  const [skipped, setSkipped] = useState(false);
  const [completed, setCompleted] = useState(false);
  const timeoutRef = useRef(0);
  const finished = completed;

  useEffect(() => {
    if (!start) return;
    let lineIndex = 0;
    let charIndex = 0;
    const output: string[] = [];
    const setSeen = () => {
      try { window.localStorage.setItem(SEEN_KEY, '1'); } catch { /* Storage can be disabled. */ }
    };
    let alreadySeen = false;
    try { alreadySeen = window.localStorage.getItem(SEEN_KEY) === '1'; } catch { /* Storage can be disabled. */ }
    if (alreadySeen) {
      setPrinted(event.terminalLines);
      setSkipped(true);
      setCompleted(true);
      return;
    }
    setPrinted([]);
    setSkipped(false);
    setCompleted(false);
    const tick = () => {
      const line = event.terminalLines[lineIndex];
      if (!line) { setSeen(); setCompleted(true); return; }
      charIndex += 1;
      output[lineIndex] = line.slice(0, charIndex);
      setPrinted([...output]);
      if (charIndex >= line.length) {
        lineIndex += 1;
        charIndex = 0;
        if (lineIndex >= event.terminalLines.length) { setSeen(); setCompleted(true); return; }
        timeoutRef.current = window.setTimeout(tick, 260);
      } else timeoutRef.current = window.setTimeout(tick, 20);
    };
    timeoutRef.current = window.setTimeout(tick, 180);
    return () => window.clearTimeout(timeoutRef.current);
  }, [replayKey, start]);

  const skip = () => {
    window.clearTimeout(timeoutRef.current);
    setPrinted(event.terminalLines);
    setSkipped(true);
    setCompleted(true);
    try { window.localStorage.setItem(SEEN_KEY, '1'); } catch { /* Storage can be disabled. */ }
  };

  return <div className="terminal-window welcome-terminal">
    <div className="terminal-bar"><span><i/><i/><i/></span><small>ТЕРМИНАЛ ПРИВЕТСТВИЯ</small><span>● LIVE</span></div>
    <div className="terminal-body terminal-russian" aria-label="Приветствие Geeks" aria-live="off">
      {printed.map((line, index) => <div className={index === event.terminalLines.length - 1 ? 'terminal-last-line' : ''} key={`${replayKey}-${index}`}><span className="code-green">&gt;</span> {line}</div>)}
      {!finished && <span className="type-cursor terminal-caret">▍</span>}
    </div>
    <div className="terminal-status"><span>{finished ? 'СТАТУС: ГОТОВ' : 'ВЫПОЛНЕНИЕ...'}</span>{!finished && !skipped ? <button type="button" onClick={skip}>ПРОПУСТИТЬ АНИМАЦИЮ ↗</button> : <span>ОШ / GEEKS</span>}</div>
  </div>;
}
