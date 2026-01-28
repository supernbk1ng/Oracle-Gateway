
export enum Screen {
  Loading = 'LOADING',
  Gateway = 'GATEWAY',
  TaoistCasting = 'TAOIST_CASTING',
  TarotDraw = 'TAROT_DRAW',
  Result = 'RESULT'
}

export type DivinationPath = 'TAOIST' | 'TAROT';

export interface DivinationResult {
  title: string;
  subtitle?: string;
  interpretation: string;
  successRate: number;
  energyAlign: number;
  hexagramSymbol?: string;
  cards?: string[];
  lineInterpretations?: string[];
  cardInterpretations?: string[];
}
