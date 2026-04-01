import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Gauge, Cpu, ArrowRight } from 'lucide-react';

const ComparePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4">
      
      {/* Título */}
      <h1 className="text-3xl font-bold text-center mb-8 text-shadow">
        Ford vs Concorrência
      </h1>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* FORD */}
        <div className="racing-card border-2 border-f1-red">
          <h2 className="text-xl font-bold mb-4 text-f1-red">
            Ford
          </h2>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap /> <span>Alta performance</span>
            </div>
            <div className="flex items-center gap-2">
              <Gauge /> <span>Melhor aceleração</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu /> <span>Tecnologia avançada</span>
            </div>
          </div>
        </div>

        {/* CONCORRENTE */}
        <div className="racing-card border-2 border-gray-500">
          <h2 className="text-xl font-bold mb-4 text-gray-400">
            Concorrente
          </h2>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap /> <span>Performance padrão</span>
            </div>
            <div className="flex items-center gap-2">
              <Gauge /> <span>Aceleração média</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu /> <span>Tecnologia básica</span>
            </div>
          </div>
        </div>
      </div>

      {/* Botão */}
      <div className="mt-10 text-center">
        <button
          onClick={() => navigate('/lap')}
          className="racing-btn-red flex items-center justify-center gap-2 mx-auto"
        >
          <span>Ir para corrida</span>
          <ArrowRight />
        </button>
      </div>

    </div>
  );
};

export default ComparePage;