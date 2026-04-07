import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import useCounter from '../hooks/useCounter';
import { GamePhase } from '../types';

/* ─── Estilos en línea (CSS puro) ─── */

const styles: Record<string, CSSProperties> = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#fff',
    padding: 20,
  },
  card: {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(12px)',
    borderRadius: 24,
    padding: '40px 48px',
    maxWidth: 440,
    width: '100%',
    textAlign: 'center' as const,
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.12)',
  },
  title: {
    fontSize: 32,
    fontWeight: 800,
    marginBottom: 8,
    letterSpacing: -0.5,
    background: 'linear-gradient(90deg, #ff6bcb, #6b9fff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 28,
  },
  maxScoreBox: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(255,215,0,0.12)',
    border: '1px solid rgba(255,215,0,0.3)',
    borderRadius: 12,
    padding: '10px 22px',
    marginBottom: 28,
    fontSize: 18,
    fontWeight: 600,
    color: '#ffd700',
  },
  messageArea: {
    minHeight: 80,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  countdownText: {
    fontSize: 48,
    fontWeight: 900,
    animation: 'pulse 0.5s ease-in-out',
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: 32,
    marginBottom: 24,
  },
  statBox: {
    background: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: '14px 24px',
    minWidth: 120,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 700,
  },
  btnStart: {
    width: '100%',
    padding: '14px 0',
    borderRadius: 14,
    border: 'none',
    fontSize: 17,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: '#fff',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  btnStartDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  btnClick: {
    width: '100%',
    padding: '20px 0',
    borderRadius: 14,
    border: 'none',
    fontSize: 20,
    fontWeight: 800,
    cursor: 'pointer',
    transition: 'all 0.12s ease',
    background: 'linear-gradient(135deg, #f857a6, #ff5858)',
    color: '#fff',
    letterSpacing: 0.3,
    userSelect: 'none' as const,
  },
  btnClickDisabled: {
    opacity: 0.3,
    cursor: 'not-allowed',
    transform: 'scale(1)',
  },
  progressBarTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    background: 'rgba(255,255,255,0.1)',
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
    background: 'linear-gradient(90deg, #f857a6, #ff5858)',
    transition: 'width 1s linear',
  },
  newRecord: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 700,
    color: '#ffd700',
    animation: 'bounce 0.6s ease',
  },
};

const Counter: React.FC = () => {
  const {
    phase,
    score,
    maxScore,
    timeLeft,
    message,
    startGame,
    incrementScore,
  } = useCounter();

  const [isClicked, setIsClicked] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Efecto visual al hacer clic */
  const handleClick = () => {
    incrementScore();
    setIsClicked(true);
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = setTimeout(() => setIsClicked(false), 120);
  };

  /** Detectar nuevo récord */
  useEffect(() => {
    if (phase === GamePhase.FINISHED && score > 0 && score >= maxScore) {
      setIsNewRecord(true);
    } else if (phase !== GamePhase.FINISHED) {
      setIsNewRecord(false);
    }
  }, [phase, score, maxScore]);

  /** Limpiar timeout del efecto de clic al desmontar */
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  const isCountdown =
    phase === GamePhase.PREPARADOS ||
    phase === GamePhase.LISTOS ||
    phase === GamePhase.YA;

  const canStart = phase === GamePhase.IDLE || phase === GamePhase.FINISHED;
  const canClick = phase === GamePhase.PLAYING;

  /** Color del mensaje de cuenta regresiva */
  const getCountdownColor = (): string => {
    switch (phase) {
      case GamePhase.PREPARADOS: return '#ff6b6b';
      case GamePhase.LISTOS:    return '#feca57';
      case GamePhase.YA:        return '#48dbfb';
      default:                  return '#fff';
    }
  };

  /** Porcentaje de la barra de progreso */
  const progressPercent = canClick ? (timeLeft / 5) * 100 : 0;

  return (
    <div style={styles.wrapper}>
      {/* Keyframes inyectados con un <style> tag */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 8px rgba(248,87,166,0.4); }
          50% { box-shadow: 0 0 24px rgba(248,87,166,0.8); }
        }
      `}</style>

      <div style={styles.card}>
        {/* Título */}
        <h1 style={styles.title}>🎮 JuegoContador_Claude</h1>
        <p style={styles.subtitle}>¿Qué tan rápido puedes hacer clic?</p>

        {/* Puntaje Máximo */}
        <div style={styles.maxScoreBox}>
          <span>🏆</span>
          <span>Puntaje Máximo: {maxScore}</span>
        </div>

        {/* Área de mensajes / Cuenta regresiva */}
        <div style={styles.messageArea}>
          {isCountdown ? (
            <div
              key={phase}
              style={{
                ...styles.countdownText,
                color: getCountdownColor(),
              }}
            >
              {message}
            </div>
          ) : (
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.75)', margin: 0 }}>
              {message}
            </p>
          )}
        </div>

        {/* Barra de progreso (solo durante PLAYING) */}
        {canClick && (
          <div style={styles.progressBarTrack}>
            <div
              style={{
                ...styles.progressBarFill,
                width: `${progressPercent}%`,
              }}
            />
          </div>
        )}

        {/* Stats: Tiempo y Clics */}
        {(canClick || phase === GamePhase.FINISHED) && (
          <div style={styles.statsRow}>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Tiempo</div>
              <div
                style={{
                  ...styles.statValue,
                  color: canClick && timeLeft <= 2 ? '#ff5858' : '#fff',
                }}
              >
                {timeLeft}s
              </div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Clics</div>
              <div style={{ ...styles.statValue, color: '#48dbfb' }}>
                {score}
              </div>
            </div>
          </div>
        )}

        {/* Botón Iniciar Juego */}
        <button
          onClick={startGame}
          disabled={!canStart}
          style={{
            ...styles.btnStart,
            ...(!canStart ? styles.btnStartDisabled : {}),
          }}
        >
          {phase === GamePhase.FINISHED ? '🔄 Jugar de nuevo' : '🚀 Iniciar Juego'}
        </button>

        {/* Botón ¡Click aquí! */}
        <button
          onClick={handleClick}
          disabled={!canClick}
          style={{
            ...styles.btnClick,
            ...(!canClick ? styles.btnClickDisabled : {}),
            ...(isClicked
              ? { transform: 'scale(0.93)', background: 'linear-gradient(135deg, #ff5858, #f857a6)' }
              : {}),
            ...(canClick ? { animation: 'glow 1.5s ease-in-out infinite' } : {}),
          }}
        >
          {canClick ? `¡Click aquí! (${score})` : '¡Click aquí!'}
        </button>

        {/* Mensaje de nuevo récord */}
        {isNewRecord && phase === GamePhase.FINISHED && (
          <div style={styles.newRecord}>
            🎉 ¡Nuevo Récord: {maxScore} clics! 🎉
          </div>
        )}
      </div>
    </div>
  );
};

export default Counter;