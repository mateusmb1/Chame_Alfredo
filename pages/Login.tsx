import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Lock, User, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { authenticateTechnician, authenticateClient } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulate network delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));

      // 1. Try Technician/Admin Login
      const tech = authenticateTechnician(username, password);
      if (tech) {
        localStorage.setItem('alfredo_user', JSON.stringify(tech));
        if (tech.username === 'martes') {
          // Admin specific logic if needed, for now both go to dashboard
          navigate('/dashboard');
        } else {
          // Technician usually goes to mobile views if mobile, or dashboard
          navigate('/dashboard');
        }
        return;
      }

      // 2. Try Client Login
      const client = authenticateClient(username, password);
      if (client) {
        navigate('/client/dashboard');
        return;
      }

      // 3. Fail
      setError('Usuário ou senha incorretos. Tente novamente.');
    } catch (err) {
      setError('Erro ao processar login. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      {/* Left Panel - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col w-1/2 bg-[#1e293b] relative overflow-hidden text-white p-12 justify-between">
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F97316] rounded-full filter blur-[100px] opacity-10 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-[100px] opacity-10 -ml-20 -mb-20"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/10">
              <span className="font-black text-[#F97316] text-xl">A</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Chame Alfredo</span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center bg-[#F97316]/20 border border-[#F97316]/30 text-[#F97316] rounded-full px-3 py-1 mb-6 text-sm font-bold backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Sistema de Gestão 4.0
          </div>
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Gerencie seus serviços com <span className="text-[#F97316]">agilidade</span> e precisão.
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Plataforma unificada para técnicos, administradores e clientes.
            Controle de ordens, estoques e chamados em tempo real.
          </p>
          <div className="mt-10">
            <img src="/alfredo.png" alt="Mascote Chame Alfredo" className="w-64 h-auto object-contain drop-shadow-2xl" />
          </div>
        </div>

        <div className="relative z-10 text-xs text-gray-500 font-medium tracking-wide uppercase">
          © 2026 Chame Alfredo Soluções para Corporativa, Administradoras e Condomínio

        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md space-y-8 animate-fade-in-up">
          <div className="text-center lg:text-left">
            <div className="inline-block lg:hidden mb-6">
              <img src="/alfredo.png" alt="Mascote" className="w-20 h-20 mx-auto object-contain" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Bem-vindo de volta!</h2>
            <p className="mt-2 text-gray-500">Acesse sua conta para continuar.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 mt-8">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-700 animate-shake">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <div className="space-y-5">
              <div className="relative group">
                <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${focusedInput === 'username' || username ? '-top-2.5 bg-white px-2 text-xs text-[#F97316] font-bold' : 'top-3.5 text-gray-400'}`}>
                  Usuário ou E-mail
                </label>
                <div className="relative">
                  <User className={`absolute left-4 top-3.5 w-5 h-5 transition-colors ${focusedInput === 'username' ? 'text-[#F97316]' : 'text-gray-300'}`} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setFocusedInput('username')}
                    onBlur={() => setFocusedInput(null)}
                    className={`w-full bg-white border-2 rounded-xl py-3 pl-12 pr-4 outline-none transition-all duration-200 ${focusedInput === 'username' ? 'border-[#F97316] shadow-lg shadow-orange-100' : 'border-gray-100'}`}
                    required
                  />
                </div>
              </div>

              <div className="relative group">
                <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${focusedInput === 'password' || password ? '-top-2.5 bg-white px-2 text-xs text-[#F97316] font-bold' : 'top-3.5 text-gray-400'}`}>
                  Senha
                </label>
                <div className="relative">
                  <Lock className={`absolute left-4 top-3.5 w-5 h-5 transition-colors ${focusedInput === 'password' ? 'text-[#F97316]' : 'text-gray-300'}`} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                    className={`w-full bg-white border-2 rounded-xl py-3 pl-12 pr-4 outline-none transition-all duration-200 ${focusedInput === 'password' ? 'border-[#F97316] shadow-lg shadow-orange-100' : 'border-gray-100'}`}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#F97316] focus:ring-[#F97316]" />
                <span className="ml-2 text-sm text-gray-500">Lembrar de mim</span>
              </label>
              <a href="#" className="text-sm font-bold text-[#F97316] hover:text-[#c2410c] transition-colors">
                Esqueceu a senha?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1e293b] hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-xl shadow-gray-200 flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Entrar na Plataforma <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-8">
            Ainda não é cliente? <a href="/" className="font-bold text-[#F97316] hover:underline">Solicite uma proposta</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
