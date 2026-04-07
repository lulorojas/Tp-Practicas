import { useEffect, useRef, useState } from 'react';
import { CountdownStep, RoundStatus } from '../types';

const ROUND_DURATION_MS = 5000;

const STEPS: CountdownStep[] = [
  { label: 'Preparados', delayMs: 1000 },
  { label: 'Listos', delayMs: 1000 },
  { label: 'Ya', delayMs: 1000 },
];

const useCounter = () => {
  const [status, setStatus] = useState<RoundStatus>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeftMs, setTimeLeftMs] = useState(0);
  const [message, setMessage] = useState('Tocá “Iniciar Juego” para arrancar.');

  const timeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const roundIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const canClickRef = useRef(false);

  const clearScheduledEvents = () => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];

    if (roundIntervalRef.current) {
      clearInterval(roundIntervalRef.current);
      roundIntervalRef.current = null;
    }
  };

  const finishRound = (finalScore: number) => {
    clearScheduledEvents();
    canClickRef.current = false;
    setStatus('finished');
    setTimeLeftMs(0);
    setMessage(`⏰ Fin de la ronda. Lograste ${finalScore} clics.`);
    setHighScore((prev) => (finalScore > prev ? finalScore : prev));
  };

  const runRoundTimer = () => {
    const startedAt = Date.now();
    setStatus('playing');
    setMessage('¡Click aquí! Tenés 5 segundos.');
    setTimeLeftMs(ROUND_DURATION_MS);
    canClickRef.current = true;

    roundIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const left = Math.max(0, ROUND_DURATION_MS - elapsed);
      setTimeLeftMs(left);

      if (left <= 0) {
        setScore((current) => {
          finishRound(current);
          return current;
        });
      }
    }, 100);
  };

  const startGame = () => {
    if (status === 'countdown' || status === 'playing') {
      return;
    }

    clearScheduledEvents();
    setScore(0);
    setTimeLeftMs(0);
    setStatus('countdown');

    let accumulated = 0;

    STEPS.forEach((step, index) => {
      const timeoutId = setTimeout(() => {
        setMessage(step.label);

        if (index === STEPS.length - 1) {
          const launchId = setTimeout(() => {
            runRoundTimer();
          }, step.delayMs);

          timeoutsRef.current.push(launchId);
        }
      }, accumulated);

      timeoutsRef.current.push(timeoutId);
      accumulated += step.delayMs;
    });
  };

  const registerClick = () => {
    if (!canClickRef.current) {
      return;
    }

    setScore((prev) => prev + 1);
  };

  useEffect(() => {
    return () => {
      clearScheduledEvents();
    };
  }, []);

  return {
    status,
    score,
    highScore,
    timeLeftMs,
    message,
    startGame,
    registerClick,
  };
};

export default useCounter;