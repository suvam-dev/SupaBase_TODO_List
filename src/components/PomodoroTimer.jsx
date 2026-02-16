import { useState, useEffect, useRef, useCallback } from 'react';
import { Timer, Pause, RotateCcw } from 'lucide-react';

export default function PomodoroTimer() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const intervalRef = useRef(null);

  const startTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsBreak(false);
    setSeconds(25 * 60);
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            if (!isBreak) {
              setIsBreak(true);
              return 5 * 60; // 5 min break
            } else {
              setIsBreak(false);
              return 25 * 60; // Back to work
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, isBreak]);

  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');

  return (
    <div className="pomodoro-card">
      <h4>
        <Timer size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: 6 }} />
        {isBreak ? 'Break Time' : 'Focus Timer'}
      </h4>
      <div className="pomodoro-time">{mins}:{secs}</div>
      <div className="pomodoro-controls">
        {!isRunning ? (
          <button className="pomodoro-btn start" onClick={startTimer}>
            Start
          </button>
        ) : (
          <button className="pomodoro-btn pause" onClick={pauseTimer}>
            <Pause size={14} /> Pause
          </button>
        )}
        <button className="pomodoro-btn reset" onClick={resetTimer}>
          <RotateCcw size={14} /> Reset
        </button>
      </div>
      <div className="pomodoro-label">
        {isBreak ? '5 min break' : '25 min focus session'}
      </div>
    </div>
  );
}
