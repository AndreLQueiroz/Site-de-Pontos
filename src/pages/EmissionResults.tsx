import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LapRecord } from '../types';
// ADICIONEI Droplets AQUI NO IMPORT
import { ArrowLeft, TrendingUp, RotateCcw, Zap, Droplets } from 'lucide-react';
import { formatTime } from '../utils/calculations';
import { getRankedLaps, addPointsToUser } from '../utils/storage';

const EmissionResults: React.FC = () => {
  const [lapData, setLapData] = useState<LapRecord | null>(null);
  const [totalCompleted, setTotalCompleted] = useState<number>(0);
  const navigate = useNavigate();

  const earnedPoints = 3;

  useEffect(() => {
    const lapDataString = sessionStorage.getItem('currentLap');
    if (!lapDataString) {
      navigate('/lap');
      return;
    }

    const data: LapRecord = JSON.parse(lapDataString);
    setLapData(data);

    if (data.completed && data.email) {
      addPointsToUser(data.email, earnedPoints);
    }

    const allLaps = getRankedLaps();
    setTotalCompleted(allLaps.length);
  }, [navigate]);

  const handleNewLap = () => navigate('/lap');
  const viewRanking = () => navigate('/ranking');
  const startNewSession = () => {
    sessionStorage.removeItem('currentLap');
    navigate('/');
  };

  if (!lapData) return <div className="text-center p-10 text-white">Carregando...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Resultado da Corrida</h1>
      </div>

      {lapData.completed ? (
        <div className="space-y-6">
          <div className="racing-card card-f1 bg-gradient-to-br from-racing-gray to-gray-800">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-sm text-gray-400 uppercase">Tempo da Volta</p>
                <p className="text-3xl font-mono font-bold text-white">{formatTime(lapData.time)}</p>
              </div>
              <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-bounce">
                <Zap size={14} fill="currentColor" />
                +{earnedPoints} PONTOS
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-black/30 border border-f1-red/30 text-center">
                <p className="text-xs text-f1-red font-bold uppercase">Ford Racing</p>
                <p className="text-2xl font-bold">{lapData.emissionF1}L</p>
              </div>
              <div className="p-4 rounded-lg bg-black/30 border border-gray-600 text-center">
                <p className="text-xs text-gray-400 font-bold uppercase">Chevrolet</p>
                <p className="text-2xl font-bold">{lapData.emissionFE}L</p>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/50 flex items-center gap-4">
              <div className="bg-green-500 p-2 rounded-full text-black">
                <Droplets size={24} />
              </div>
              <div className="text-left">
                <p className="font-bold text-green-400 font-mono">Economia: {lapData.difference}L</p>
                <p className="text-xs text-gray-400">Total de voltas: {totalCompleted}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="racing-card card-f1 text-center py-10">
          <Droplets className="mx-auto mb-4 text-blue-400" size={48} />
          <h2 className="text-xl font-bold mb-4 text-f1-red">Corrida Incompleta</h2>
          <p className="text-gray-400">Voltas não finalizadas não somam pontos.</p>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button onClick={handleNewLap} className="racing-btn-dark flex items-center justify-center gap-2">
          <ArrowLeft size={18} /> Nova Volta
        </button>
        <button onClick={viewRanking} className="racing-btn-green flex items-center justify-center gap-2">
          <TrendingUp size={18} /> Ranking
        </button>
        <button onClick={startNewSession} className="racing-btn-red flex items-center justify-center gap-2">
          <RotateCcw size={18} /> Sair
        </button>
      </div>
    </div>
  );
};

export default EmissionResults;