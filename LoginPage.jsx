import React, { useState } from 'react';
import { Lock, User, LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const VALID_CREDENTIALS = [
    { username: 'user', password: '123', role: 'user' },
    { username: 'admin', password: 'password', role: 'admin' }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const validUser = VALID_CREDENTIALS.find(
      cred => cred.username === username && cred.password === password
    );

    if (validUser) {
      onLogin(validUser.role);
    } else {
      setError('Usuario o contraseña incorrectos');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-slate-900 to-red-900 flex items-center justify-center p-4">
      {/* Elemento decorativo fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Card Principal */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-green-700/30 overflow-hidden">
          {/* Header decorativo */}
          <div className="h-1 bg-gradient-to-r from-green-600 via-red-600 to-pink-600"></div>

          <div className="p-8">
            {/* Logo y título */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-full mb-4 shadow-lg">
                <img
                  src="https://i.postimg.cc/VvQp16sf/L-COLOR.png"
                  alt="Primero Tarija"
                  className="w-12 h-12 object-contain"
                />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-red-500 bg-clip-text text-transparent mb-2">
                DISTRITO 6
              </h1>
              <p className="text-slate-400 text-sm">Gestión de Campaña 2026</p>
            </div>

            {/* Mensajes de error */}
            {error && (
              <div className="mb-6 bg-red-900/30 border border-red-600 rounded-lg p-3 flex items-start gap-3">
                <AlertCircle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Campo Usuario */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Usuario
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-3 text-green-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="user o admin"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition"
                  />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-3 text-green-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-300"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Botón Login */}
              <button
                type="submit"
                className="w-full mt-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
              >
                <LogIn size={20} />
                Ingresar
              </button>
            </form>

            {/* Credenciales de demostración */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-xs text-slate-400 mb-3 font-medium">Credenciales de prueba:</p>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="bg-slate-700/30 p-2 rounded border border-slate-600">
                  <p className="text-green-400 font-mono">user / 123</p>
                  <p className="text-slate-500 text-xs">Solo lectura</p>
                </div>
                <div className="bg-slate-700/30 p-2 rounded border border-slate-600">
                  <p className="text-green-400 font-mono">admin / password</p>
                  <p className="text-slate-500 text-xs">Control total</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pie de página */}
        <div className="text-center mt-6 text-slate-400 text-xs">
          <p>Desarrollado por <span className="font-bold text-green-400">Sistemas Koffy's</span></p>
          <p className="mt-1">Equipo Marcelo Zenteno - Primero Tarija 2026</p>
        </div>
      </div>
    </div>
  );
}
