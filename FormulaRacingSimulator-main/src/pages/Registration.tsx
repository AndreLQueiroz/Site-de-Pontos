import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveUser, generateUserId } from '../utils/storage';
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

    const userId = generateUserId();
    const user = {
      name: name.trim(),
      email: email.trim()
    };

    saveUser(user);

    sessionStorage.setItem(
      'currentUser',
      JSON.stringify({
        ...user,
        userId
      })
    );

    setShowSuccess(true);

    setTimeout(() => {
      navigate('/race');
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8 animate-pulse">
        <Flag className="inline-block text-blue-500" size={48} />
        <h1 className="text-3xl font-bold mt-2 text-shadow">Ford Racing Simulator</h1>
        <p className="text-gray-300 mt-2">
          Tenha uma experiencia unica dirigindo com a gente
        </p>
      </div>

      <div className="racing-card card-f1">
        <h2 className="text-xl font-bold mb-4">Cadastro Inicial</h2>

        {showSuccess ? (
          <div className="bg-fe-green bg-opacity-20 border border-fe-green text-white p-4 rounded-lg text-center animate-pulse-light">
            <p className="font-bold">Cadastro realizado com sucesso!</p>
            <p className="text-sm mt-2">Redirecionando para a corrida...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 flex items-center gap-2">
                <User size={16} />
                <span>Nome</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="racing-input"
                placeholder="Digite seu nome"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 flex items-center gap-2">
                <Mail size={16} />
                <span>E-mail</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="racing-input"
                placeholder="Digite seu e-mail"
              />
            </div>

            {error && (
              <div className="bg-blue-500 bg-opacity-20 border border-blue-500 text-white p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="racing-btn-red w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processando...' : 'Iniciar'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Registration;