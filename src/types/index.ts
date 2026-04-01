export interface User {
  name: string;
  email: string;
  id?: string; // Adicionei id opcional
  points: number;
}

export interface LapRecord {
  userId: string;
  name: string;
  email: string;
  time: number; // time in seconds
  completed: boolean;
  emissionF1: number;
  emissionFE: number;
  difference: number;
  date: string;
}

export interface RacingData {
  users: User[];
  laps: LapRecord[];
}