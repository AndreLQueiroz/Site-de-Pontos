import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Flag, TrendingUp, RotateCcw, User, Trophy } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  
  // Estado para guardar o usuário logado na sessão
  const [currentUser, setCurrentUser] = useState<{name: string, points: number} | null>(null);

  useEffect(() => {
    // Toda vez que a rota mudar, verificamos quem está logado
    const user = sessionStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    } else {
      setCurrentUser(null);
    }
  }, [location]);

  const logout = () => {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentLap');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-racing-black border-b border-racing-gray sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Flag className="text-f1-red" size={24} />
            <h1 className="text-xl font-bold hidden md:block text-white">Ford Racing Simulator</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Se tiver alguém logado, mostra o mini perfil no topo */}
            {currentUser && !isHomePage && (
              <div className="flex items-center gap-3 bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700">
                <div className="flex items-center gap-1.5 border-r border-gray-600 pr-3">
                  <User size={16} className="text-f1-red" />
                  <span className="text-sm font-medium text-white">{currentUser.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Trophy size={16} className="text-yellow-400" />
                  <span className="text-sm font-bold text-yellow-400">{currentUser.points || 0} pts</span>
                </div>
              </div>
            )}

            {!isHomePage && (
              <div className="flex gap-2">
                <Link 
                  to="/ranking" 
                  className="p-2 rounded-lg bg-racing-gray hover:bg-gray-700 transition-colors text-white"
                  title="Ranking"
                >
                  <TrendingUp size={20} />
                </Link>
                
                <button 
                  onClick={logout}
                  className="p-2 rounded-lg bg-racing-gray hover:bg-red-900/30 text-red-400 border border-transparent hover:border-red-500 transition-colors"
                  title="Sair da conta"
                >
                  <RotateCcw size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="bg-racing-black border-t border-racing-gray py-4 text-center text-gray-500 text-xs">
        <p>Ford Racing Simulator &copy; 2026 | Sistema de Pilotos Ativo</p>
      </footer>
    </div>
  );
};

export default Layout;