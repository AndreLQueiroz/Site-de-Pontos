import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveOrUpdateUser, generateUserId } from '../utils/storage'; // Mudamos saveUser para saveOrUpdateUser
import { Flag, Mail, User } from 'lucide-react';

const Registration: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor, informe um e-mail válido.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    // Criamos o objeto do usuário
    const userData = {
      name: name.trim(),
      email: email.trim()
    };

    // Agora usamos a função que verifica se o usuário já existe
    // Se existir, ela retorna o usuário com os pontos que ele já tinha
    const registeredUser = saveOrUpdateUser(userData);

    // Salva na sessão o usuário completo (incluindo o campo points)
    sessionStorage.setItem(
      'currentUser',
      JSON.stringify({
        ...registeredUser,
        userId: registeredUser.id || generateUserId() // Garante um ID para a sessão
      })
    );

    setShowSuccess(true);

    setTimeout(() => {
      navigate('/race');
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8 animate-fade-in">
        <div className="flex justify-center mb-4">
          <div className="bg-f1-red p-4 rounded-full shadow-lg shadow-red-900/20">
            <Flag className="text-white" size={48} />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2 text-shadow">Piloto, identifique-se!</h1>
        <p className="text-gray-400">Entre com seus dados para começar a acumular pontos.</p>
      </div>

      <div className="racing-card card-f1">
        {showSuccess ? (
          <div className="text-center py-8 animate-bounce">
            <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white">Bem-vindo de volta!</h2>
            <p className="text-gray-300 mt-2">Sincronizando seus pontos...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 flex items-center gap-2 text-gray-300">
                <User size={16} />
                <span>Nome Completo</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="racing-input"
                placeholder="Ex: Ayrton Senna"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 flex items-center gap-2 text-gray-300">
                <Mail size={16} />
                <span>E-mail</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="racing-input"
                placeholder="seu@email.com"
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="racing-btn-red w-full flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="animate-pulse">Acelerando...</span>
              ) : (
                <>
                  <span>Entrar no Cockpit</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Registration;