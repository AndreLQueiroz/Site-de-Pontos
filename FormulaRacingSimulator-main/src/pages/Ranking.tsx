import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Usamos "as UsersIcon" para não dar conflito com o tipo "User"
import { 
  ArrowLeft, 
  Medal, 
  Clock, 
  Trophy, 
  Users as UsersIcon, 
  Activity,
} from 'lucide-react';
import { LapRecord, User } from '../types';
import { getRankedLaps, getGlobalRanking } from '../utils/storage';
import { formatTime } from '../utils/calculations';
import {
  LineChart, Line,
  BarChart, Bar,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Ranking: React.FC = () => {
  const [rankedLaps, setRankedLaps] = useState<LapRecord[]>([]);
  const [globalUsers, setGlobalUsers] = useState<User[]>([]);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');
  const navigate = useNavigate();

  useEffect(() => {
    setRankedLaps(getRankedLaps());
    setGlobalUsers(getGlobalRanking());
  }, []);

  const handleBack = () => {
    const hasCurrentLap = sessionStorage.getItem('currentLap');
    if (hasCurrentLap) {
      navigate('/results');
    } else {
      navigate('/');
    }
  };

  // Prepara dados para o gráfico (últimas 10 voltas para não poluir o visual)
  const chartData = rankedLaps.slice(0, 10).map((lap, index) => ({
    name: `V${rankedLaps.length - index}`,
    tempo: lap.time,
    piloto: lap.name
  })).reverse();

  const getMedalColor = (index: number): string => {
    switch (index) {
      case 0: return 'text-yellow-400';
      case 1: return 'text-gray-400';
      case 2: return 'text-amber-600';
      default: return 'text-white';
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={handleBack} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-4xl font-bold text-shadow text-white">Hall da Fama</h1>
        </div>
      </div>

      {/* SEÇÃO DE GRÁFICOS RESTAURADA */}
      {rankedLaps.length > 0 && (
        <div className="racing-card card-f1 mb-8 bg-racing-gray border-l-4 border-f1-red p-6 rounded-xl">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
              <Activity className="text-f1-red" size={20} /> Telemetria de Desempenho
            </h2>
            <div className="flex bg-black/40 p-1 rounded-lg border border-gray-700">
              <button 
                onClick={() => setChartType('line')}
                className={`px-3 py-1 rounded text-sm transition-colors ${chartType === 'line' ? 'bg-f1-red text-white' : 'text-gray-400 hover:text-white'}`}
              >Linha</button>
              <button 
                onClick={() => setChartType('bar')}
                className={`px-3 py-1 rounded text-sm transition-colors ${chartType === 'bar' ? 'bg-f1-red text-white' : 'text-gray-400 hover:text-white'}`}
              >Barra</button>
              <button 
                onClick={() => setChartType('area')}
                className={`px-3 py-1 rounded text-sm transition-colors ${chartType === 'area' ? 'bg-f1-red text-white' : 'text-gray-400 hover:text-white'}`}
              >Área</button>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  <Legend />
                  <Line type="monotone" dataKey="tempo" stroke="#e10600" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} name="Tempo (s)" />
                </LineChart>
              ) : chartType === 'bar' ? (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  <Legend />
                  <Bar dataKey="tempo" fill="#e10600" radius={[4, 4, 0, 0]} name="Tempo (s)" />
                </BarChart>
              ) : (
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  <Legend />
                  <Area type="monotone" dataKey="tempo" stroke="#e10600" fill="#e10600" fillOpacity={0.3} name="Tempo (s)" />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* RANKING GLOBAL DE PONTOS ACUMULADOS */}
        <div className="racing-card card-fe overflow-hidden p-0 border-l-4 border-fe-green bg-racing-gray rounded-xl">
          <div className="p-4 border-b border-gray-800 bg-black/20 flex items-center gap-2">
            <Trophy className="text-yellow-400" size={20} />
            <h2 className="text-xl font-bold text-white">Ranking de Pontuação</h2>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full text-left">
              <thead className="bg-black/40 text-gray-400 text-xs uppercase">
                <tr>
                  <th className="p-4 font-semibold">Pos</th>
                  <th className="p-4 font-semibold">Piloto</th>
                  <th className="p-4 text-right font-semibold">Pontos</th>
                </tr>
              </thead>
              <tbody>
                {globalUsers.length > 0 ? globalUsers.map((user, index) => (
                  <tr key={user.email} className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-white">{index + 1}º</td>
                    <td className="p-4 text-gray-300">{user.name}</td>
                    <td className="p-4 text-right font-bold text-yellow-400">{user.points || 0} pts</td>
                  </tr>
                )) : (
                   <tr><td colSpan={3} className="p-10 text-center text-gray-500 italic">Aguardando primeiros pilotos...</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RANKING DE MELHORES TEMPOS */}
        <div className="racing-card card-f1 overflow-hidden p-0 border-l-4 border-f1-red bg-racing-gray rounded-xl">
          <div className="p-4 border-b border-gray-800 bg-black/20 flex items-center gap-2">
            <Clock className="text-f1-red" size={20} />
            <h2 className="text-xl font-bold text-white">Recordes de Pista</h2>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full text-left">
              <thead className="bg-black/40 text-gray-400 text-xs uppercase">
                <tr>
                  <th className="p-4 font-semibold">Pos</th>
                  <th className="p-4 font-semibold">Piloto</th>
                  <th className="p-4 text-right font-semibold">Tempo</th>
                </tr>
              </thead>
              <tbody>
                {rankedLaps.length > 0 ? rankedLaps.map((lap, index) => (
                  <tr key={index} className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                    <td className={`p-4 font-bold ${getMedalColor(index)}`}>
                      {index < 3 && <Medal className="inline mr-1" size={16} />}
                      {index + 1}º
                    </td>
                    <td className="p-4 text-gray-300">{lap.name}</td>
                    <td className="p-4 text-right font-mono font-bold text-f1-red">{formatTime(lap.time)}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={3} className="p-10 text-center text-gray-500 italic">Nenhum recorde registrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RODAPÉ COM RESUMO */}
      <div className="mt-10 p-6 bg-racing-gray rounded-xl border border-gray-700 flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-f1-red/20 rounded-full text-f1-red shadow-inner">
             <UsersIcon size={32} /> 
           </div>
           <div>
             <p className="text-gray-400 text-sm uppercase tracking-tighter">Comunidade Ford Simulator</p>
             <p className="text-2xl font-bold text-white">{globalUsers.length} Pilotos Registrados</p>
           </div>
        </div>
        <button 
          onClick={() => navigate('/race')} 
          className="racing-btn-red bg-f1-red hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg shadow-red-900/40"
        >
          Acelerar Novamente
        </button>
      </div>
    </div>
  );
};

export default Ranking;