import { LapRecord, RacingData, User } from '../types';

const STORAGE_KEY = 'racingData';

// Carrega dados do localStorage ao iniciar
const loadFromStorage = (): RacingData => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
    return { users: [], laps: [] };
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    return { users: [], laps: [] };
  }
};

// Salva dados no localStorage
const saveToStorage = (data: RacingData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
  }
};

let racingData: RacingData = loadFromStorage();

// Retorna todos os dados
export const getData = (): RacingData => {
  return racingData;
};

// Sobrescreve e salva os dados
export const saveData = (data: RacingData): void => {
  racingData = data;
  saveToStorage(data);
};

/**
 * LÓGICA DE USUÁRIO (LOGIN/CADASTRO)
 */

// Salva um novo usuário ou retorna um existente (mecanismo de conta)
export const saveOrUpdateUser = (userData: { name: string, email: string }): User => {
  const data = getData();
  
  // Tenta encontrar o usuário pelo email
  const existingUser = data.users.find(u => u.email === userData.email);

  if (existingUser) {
    // Se já existe, garante que ele tem o campo points e retorna
    if (existingUser.points === undefined) existingUser.points = 0;
    return existingUser;
  } else {
    // Se não existe, cria um novo com 0 pontos
    const newUser: User = {
      name: userData.name,
      email: userData.email,
      points: 0
    };
    data.users.push(newUser);
    saveData(data);
    return newUser;
  }
};

// Adiciona pontos a um usuário específico
export const addPointsToUser = (email: string, pointsToAdd: number): void => {
  const data = getData();
  const userIndex = data.users.findIndex(u => u.email === email);

  if (userIndex !== -1) {
    // Incrementa os pontos no array global
    const currentPoints = data.users[userIndex].points || 0;
    data.users[userIndex].points = currentPoints + pointsToAdd;
    saveData(data);
    
    // IMPORTANTE: Atualiza o sessionStorage para que o site reflita os pontos na hora
    const currentUserStr = sessionStorage.getItem('currentUser');
    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr);
      if (currentUser.email === email) {
        currentUser.points = data.users[userIndex].points;
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
      }
    }
  }
};

/**
 * LÓGICA DE CORRIDAS (LAP RECORDS)
 */

// Salva um novo registro de volta
export const saveLap = (lap: LapRecord): void => {
  const data = getData();
  data.laps.push(lap);
  saveData(data);
};

// Retorna o ranking de tempos (apenas voltas completadas, do menor tempo para o maior)
export const getRankedLaps = (): LapRecord[] => {
  const data = getData();
  return data.laps
    .filter(lap => lap.completed)
    .sort((a, b) => a.time - b.time);
};

// Retorna o ranking de pontos (usuários que mais acumularam pontos)
export const getGlobalRanking = (): User[] => {
  const data = getData();
  return [...data.users].sort((a, b) => (b.points || 0) - (a.points || 0));
};

// Gera um ID único simples (caso ainda precise)
export const generateUserId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};