/** Fases del juego */
export enum GamePhase {
  IDLE = 'IDLE',           // Esperando a que el usuario inicie
  PREPARADOS = 'PREPARADOS',
  LISTOS = 'LISTOS',
  YA = 'YA',
  PLAYING = 'PLAYING',     // Los 5 segundos de clic
  FINISHED = 'FINISHED',   // Tiempo terminado
}

/** Estado completo del juego */
export interface GameState {
  phase: GamePhase;
  score: number;
  maxScore: number;
  timeLeft: number;       // Segundos restantes (durante PLAYING)
  message: string;        // Mensaje de la cuenta regresiva
}