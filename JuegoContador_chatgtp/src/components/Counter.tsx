import React, { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import useCounter from '../hooks/useCounter';
import { RoundStatus } from '../types';

/* ─── Estilos en línea (CSS puro) ─── */

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    background: 'radial-gradient(circle at 15% 20%, #1f2a44, #0d111b 55%)',
    padding: 20,
    color: '#e9edf7',
    fontFamily: "Inter, 'Segoe UI', sans-serif",
  },
  panel: {
    width: 'min(520px, 100%)',
    borderRadius: 20,
    border: '1px solid #27324c',
    background: 'linear-gradient(180deg, #141b2a, #0f1523)',
    boxShadow: '0 20px 35px rgba(0, 0, 0, 0.35)',
    padding: 28,
  },
  heading: {
    fontWeight: 800,
    fontSize: 30,
    margin: 0,
    marginBottom: 8,
  },
  subheading: {
    margin: 0,
    color: '#98a3ba',
    marginBottom: 20,
    fontSize: 14,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 14,
    borderRadius: 999,
    padding: '8px 14px',
    border: '1px solid #3a4a6e',
    backgroundColor: '#1a2440',
    marginBottom: 18,
  },
  statusBox: {
    minHeight: 74,
    borderRadius: 14,
    border: '1px dashed #314061',
    display: 'grid',
    placeItems: 'center',
    fontWeight: 700,
    marginBottom: 18,
    textAlign: 'center',
    padding: '8px 12px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    marginBottom: 18,
  },
  metric: {
    border: '1px solid #2e3957',
    borderRadius: 12,
    padding: 12,
    background: '#121a2c',
  },
  metricLabel: {
    fontSize: 12,
    color: '#8c99b2',
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 30,
    lineHeight: 1,
    fontWeight: 800,
  },
  progressWrap: {
    width: '100%',
    backgroundColor: '#192239',
    borderRadius: 999,
    height: 10,
    overflow: 'hidden',
    marginBottom: 18,
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #14d7a0, #00b1ff)',
    transition: 'width 100ms linear',
  },
  controls: {
    display: 'grid',
    gap: 10,
  },
  button: {
    border: 'none',
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 16,
    padding: '14px 16px',
    cursor: 'pointer',
    transition: 'transform .08s ease, filter .15s ease, opacity .15s ease',
  },
};

const Counter: React.FC = () => {
  const { status, score, highScore, timeLeftMs, message, startGame, registerClick } = useCounter();

  const [pressed, setPressed] = useState(false);
  const [newRecord, setNewRecord] = useState(false);
  const pulseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isPlaying = status === 'playing';
  const canStart = status === 'idle' || status === 'finished';
  const isCountdown = status === 'countdown';

  const secondsLeft = useMemo(() => (timeLeftMs / 1000).toFixed(1), [timeLeftMs]);

  const handlePlayClick = () => {
    registerClick();
    setPressed(true);
    if (pulseTimeoutRef.current) {
      clearTimeout(pulseTimeoutRef.current);
    }
    pulseTimeoutRef.current = setTimeout(() => setPressed(false), 90);
  };

  useEffect(() => {
    if (status === 'finished' && score > 0 && score >= highScore) {
      setNewRecord(true);
      return;
    }
    setNewRecord(false);
  }, [status, score, highScore]);

  /** Limpiar timeout del efecto de clic al desmontar */
  useEffect(() => {
    return () => {
      if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
    };
  }, []);

  const progressPercent = isPlaying ? Math.max(0, (timeLeftMs / 5000) * 100) : 0;

  const statusColorByState: Record<RoundStatus, string> = {
    idle: '#8c99b2',
    countdown: '#ffd166',
    playing: '#33d17a',
    finished: '#4cc9f0',
  };

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes rise {
          from { transform: translateY(6px); opacity: .2; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pop {
          0% { transform: scale(1); }
          35% { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
      `}</style>

      <section style={styles.panel}>
        <h1 style={styles.heading}>⚡ JuegoContador</h1>
        <p style={styles.subheading}>Modo sprint: reaccioná rápido y sumá clics en 5 segundos.</p>

        <div style={styles.badge}>
          🏆 Puntaje Máximo: <strong>{highScore}</strong>
        </div>

        <div
          style={{
            ...styles.statusBox,
            color: statusColorByState[status],
            animation: isCountdown ? 'rise .22s ease' : undefined,
          }}
        >
          <div>
            <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 2 }}>Estado</div>
            <div style={{ fontSize: isCountdown ? 38 : 20, lineHeight: 1.1 }}>{message}</div>
          </div>
        </div>

        <div style={styles.grid}>
          <div style={styles.metric}>
            <div style={styles.metricLabel}>Tiempo restante</div>
            <div style={{ ...styles.metricValue, color: '#4cc9f0' }}>{secondsLeft}s</div>
          </div>
          <div style={styles.metric}>
            <div style={styles.metricLabel}>Clics actuales</div>
            <div
              style={{
                ...styles.metricValue,
                color: '#14d7a0',
                animation: pressed ? 'pop .12s ease' : undefined,
              }}
            >
              {score}
            </div>
          </div>
        </div>

        <div style={styles.progressWrap}>
          <div style={{ ...styles.progressFill, width: `${progressPercent}%` }} />
        </div>

        <div style={styles.controls}>
          <button
            onClick={startGame}
            disabled={!canStart}
            style={{
              ...styles.button,
              background: 'linear-gradient(90deg, #4f7cff, #7950f2)',
              color: '#fff',
              opacity: canStart ? 1 : 0.45,
              cursor: canStart ? 'pointer' : 'not-allowed',
            }}
          >
            {status === 'finished' ? 'Iniciar otra ronda' : 'Iniciar Juego'}
          </button>

          <button
            onClick={handlePlayClick}
            disabled={!isPlaying}
            style={{
              ...styles.button,
              background: isPlaying
                ? 'linear-gradient(90deg, #14d7a0, #00b1ff)'
                : '#24314f',
              color: '#09101d',
              opacity: isPlaying ? 1 : 0.6,
              cursor: isPlaying ? 'pointer' : 'not-allowed',
              transform: pressed ? 'scale(.98)' : 'scale(1)',
            }}
          >
            ¡Click aquí!
          </button>
        </div>

        {newRecord && status === 'finished' && (
          <div
            style={{
              marginTop: 14,
              borderRadius: 10,
              border: '1px solid #5ecf9a',
              padding: '10px 12px',
              backgroundColor: '#18382f',
              color: '#8ef0c2',
              fontWeight: 700,
            }}
          >
            🎉 Nuevo récord desbloqueado: {highScore}
          </div>
        )}
      </section>
    </div>
  );
};

export default Counter;