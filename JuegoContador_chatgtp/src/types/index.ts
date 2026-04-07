export type RoundStatus = 'idle' | 'countdown' | 'playing' | 'finished';

export interface CountdownStep {
  label: 'Preparados' | 'Listos' | 'Ya';
  delayMs: number;
}

export interface CounterGameState {
  status: RoundStatus;
  score: number;
  highScore: number;
  timeLeftMs: number;
  message: string;
}