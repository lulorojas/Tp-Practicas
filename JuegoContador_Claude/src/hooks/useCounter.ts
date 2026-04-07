import { useState, useEffect, useRef, useCallback } from 'react';
import { GamePhase } from '../types';

const GAME_DURATION = 5; // Segundos de juego

const useCounter = () => {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.IDLE);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [message, setMessage] = useState('Presiona "Iniciar Juego" para comenzar');

  // Ref para trackear la fase actual sin problemas de closures stale
  const phaseRef = useRef<GamePhase>(GamePhase.IDLE);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /** Actualiza la fase tanto en state como en ref */
  const updatePhase = useCallback((newPhase: GamePhase) => {
    phaseRef.current = newPhase;
    setPhase(newPhase);
  }, []);

  /** Limpia todos los timers activos */
  const clearAllTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /** Inicia la secuencia de cuenta regresiva */
  const startGame = useCallback(() => {
    clearAllTimers();
    setScore(0);
    setTimeLeft(GAME_DURATION);
    updatePhase(GamePhase.PREPARADOS);
    setMessage('Preparados...');

    // Después de 1s → "Listos"
    timerRef.current = setTimeout(() => {
      updatePhase(GamePhase.LISTOS);
      setMessage('Listos...');

      // Después de 1s → "¡Ya!"
      timerRef.current = setTimeout(() => {
        updatePhase(GamePhase.YA);
        setMessage('¡YA!');

        // Después de 1s → Inicia el juego (5 segundos)
        timerRef.current = setTimeout(() => {
          updatePhase(GamePhase.PLAYING);
          setMessage('¡Haz clic lo más rápido posible!');
          setTimeLeft(GAME_DURATION);

          // Cronómetro regresivo cada segundo
          intervalRef.current = setInterval(() => {
            setTimeLeft((prev: number) => {
              if (prev <= 1) {
                // Limpiar el interval desde fuera del setter
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                  intervalRef.current = null;
                }
                updatePhase(GamePhase.FINISHED);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  }, [clearAllTimers, updatePhase]);

  /** Incrementa el puntaje — usa la ref para evitar closure stale */
  const incrementScore = useCallback(() => {
    if (phaseRef.current === GamePhase.PLAYING) {
      setScore((prev: number) => prev + 1);
    }
  }, []);

  /** Cuando el juego termina, actualizar el puntaje máximo */
  useEffect(() => {
    if (phase === GamePhase.FINISHED) {
      setMessage('¡Tiempo terminado!');
      setMaxScore((prevMax: number) => Math.max(prevMax, score));
    }
  }, [phase, score]);

  /** Cleanup al desmontar el componente */
  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

  return {
    phase,
    score,
    maxScore,
    timeLeft,
    message,
    startGame,
    incrementScore,
  };
};

export default useCounter;