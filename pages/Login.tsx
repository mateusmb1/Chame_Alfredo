import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../src/lib/supabase';
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

  // Check for Supabase Session on Mount (for OAuth redirect)
  useEffect(() => {
    const handleAuthChange = async () => {
      // Check if we have a session (e.g. after redirect)
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user?.email) {
        setIsLoading(true);
        try {
          // Check if client exists by email
          const { data: existingClients, error: fetchError } = await supabase
            .from('clients')
            .select('*')
            .eq('email', session.user.email);

          if (fetchError) throw fetchError;

          let clientUser = existingClients?.[0];

          // If no client exists, create one (Auto-Registration)
          if (!clientUser) {
            const newClient = {
              name: session.user.user_metadata.full_name || session.user.email.split('@')[0],
              email: session.user.email,
              status: 'active',
              phone: '',
              address: '',
              cpf_cnpj: '',
              type: 'pf', // Default to Person
              preferences: { notifications: true, emailAlerts: true }
            };

            const { data: createdClient, error: createError } = await supabase
              .from('clients')
              .insert([newClient])
              .select()
              .single();

            if (createError) throw createError;
            clientUser = createdClient;
          }

          // Log in the user locally
          if (clientUser) {
            // Map DB fields to app Client type expected by localStorage if needed
            // NOTE: The app seems to use raw DB objects or mapped objects. 
            // AppContext maps keys (camelCase). For localStorage consistency, we should ideally use the mapped object.
            // But for now, we'll store the raw return or minimal needed. 
            // Better to fetch via AppContext if possible? 
            // We'll mimic the current "fail to client dashboard" flow.
            // If Client Dashboard uses 'alfredo_user' from localStorage:
            localStorage.setItem('alfredo_user', JSON.stringify({ ...clientUser, type: 'client' }));
            navigate('/client/dashboard');
          }
        } catch (err) {
          console.error("OAuth Error:", err);
          setError('Erro ao autenticar com provedor social.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    handleAuthChange();

    // Listen for auth changes (if handling popup or same-tab dynamics)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // handleAuthChange logic could be repeated here or just rely on the effect above
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

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
        // Fix: Save client to local storage for persistence if needed by Client Dashboard
        localStorage.setItem('alfredo_user', JSON.stringify(client));
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

  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/login`,
        },
      });
      if (error) throw error;
    } catch (err) {
      console.error(err);
      setError(`Erro ao iniciar login com ${provider}.`);
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

          {/* Social Login Section */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500 uppercase">ou continue com</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              disabled={isLoading}
              className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="font-medium text-gray-700">Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuthLogin('apple')}
              disabled={isLoading}
              className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
            >
              <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.78.79.05 2.1-.71 3.54-.59.6.04 2.27.14 3.42 1.83-2.9 1.84-2.43 5.75.56 7.15-.62 1.69-1.42 3.38-2.6 4.67-.32.35-.65.71-1 1.13zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.3 4.5-3.74 4.25z" />
              </svg>
              <span className="font-medium text-gray-700">Apple</span>
            </button>
          </div>

          <p className="text-center text-sm text-gray-400 mt-8">
            Ainda não é cliente? <a href="/" className="font-bold text-[#F97316] hover:underline">Solicite uma proposta</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
