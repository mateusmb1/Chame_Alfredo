import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';

const TechnicianLogin: React.FC = () => {
    const navigate = useNavigate();
    const { authenticateTechnician } = useApp();
    const { showToast } = useToast();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const technician = authenticateTechnician(username, password);

        if (technician) {
            // Store technician data in localStorage
            localStorage.setItem('technician', JSON.stringify(technician));
            showToast('success', `Bem-vindo, ${technician.name}!`);
            navigate('/mobile/dashboard');
        } else {
            showToast('error', 'Usuário ou senha inválidos');
        }

        setIsLoading(false);
    };

    return (
        <div class="min-h-screen bg-gradient-to-br from-primary via-blue-600 to-purple-700 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div class="absolute inset-0 opacity-10">
                <div class="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            </div>

            <div class="relative w-full max-w-md">
                {/* Logo/Header */}
                <div class="text-center mb-8">
                    <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                        <span class="material-symbols-outlined text-5xl text-white">engineering</span>
                    </div>
                    <h1 class="text-3xl font-bold text-white mb-2">Chame Alfredo</h1>
                    <p class="text-white/80 text-sm">Portal do Técnico</p>
                </div>

                {/* Login Card */}
                <div class="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8">
                    <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Entrar</h2>

                    <form onSubmit={handleLogin} class="space-y-5">
                        {/* Username */}
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Usuário
                            </label>
                            <div class="relative">
                                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">person</span>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    class="w-full h-12 pl-11 pr-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors text-gray-900"
                                    placeholder="seu.usuario"
                                    required
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Senha
                            </label>
                            <div class="relative">
                                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">lock</span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    class="w-full h-12 pl-11 pr-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors text-gray-900"
                                    placeholder="••••••••"
                                    required
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            class="w-full h-12 bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <span class="material-symbols-outlined animate-spin">progress_activity</span>
                                    <span>Entrando...</span>
                                </>
                            ) : (
                                <>
                                    <span class="material-symbols-outlined">login</span>
                                    <span>Entrar</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Help Text */}
                    <div class="mt-6 text-center">
                        <p class="text-sm text-gray-500">
                            Credenciais fornecidas pela administração
                        </p>
                    </div>

                    {/* Demo Credentials */}
                    <div class="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <p class="text-xs font-semibold text-blue-900 mb-2">Credenciais de Teste:</p>
                        <div class="space-y-1 text-xs text-blue-700">
                            <p><strong>Usuário:</strong> joao.silva</p>
                            <p><strong>Senha:</strong> tecnico123</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div class="text-center mt-6">
                    <p class="text-white/60 text-xs">
                        © 2024 Chame Alfredo. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TechnicianLogin;
