import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { TrendingUp, User, Lock, ArrowRight } from 'lucide-react';

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
            localStorage.setItem('technician', JSON.stringify(technician));
            showToast('success', `Bem-vindo, ${technician.name}! Força no trabalho.`);
            navigate('/mobile/dashboard');
        } else {
            showToast('error', 'Usuário ou senha inválidos');
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#1e293b] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Design Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F97316]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative w-full max-w-sm">
                {/* Branding */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl mb-6 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#F97316]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <TrendingUp className="w-10 h-10 text-[#F97316]" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase leading-none mb-2">Chame Alfredo</h1>
                    <div className="flex items-center justify-center gap-2">
                        <div className="h-px w-8 bg-white/10"></div>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Portal do Técnico</p>
                        <div className="h-px w-8 bg-white/10"></div>
                    </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#F97316] transition-colors">
                            <User className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full h-18 bg-white/5 border border-white/10 rounded-3xl pl-14 pr-6 text-white font-bold placeholder:text-white/10 focus:outline-none focus:ring-4 focus:ring-[#F97316]/5 focus:border-[#F97316]/50 transition-all"
                            placeholder="USUÁRIO"
                            required
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#F97316] transition-colors">
                            <Lock className="w-5 h-5" />
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-18 bg-white/5 border border-white/10 rounded-3xl pl-14 pr-6 text-white font-bold placeholder:text-white/10 focus:outline-none focus:ring-4 focus:ring-[#F97316]/5 focus:border-[#F97316]/50 transition-all"
                            placeholder="SENHA"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-18 bg-white text-[#1e293b] font-black rounded-3xl shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50 uppercase tracking-widest text-sm border-b-[6px] border-gray-300 active:border-b-0"
                    >
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-4 border-[#1e293b] border-t-transparent" />
                        ) : (
                            <>
                                <span>Acessar Painel</span>
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                {/* Access Hint */}
                <div className="mt-10 p-6 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-1.5 h-6 bg-[#F97316] rounded-full"></div>
                        <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Credenciais de Teste</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-[8px] font-black text-white/30 uppercase">Login</p>
                            <p className="text-xs font-bold text-white tracking-widest leading-none">joao.silva</p>
                        </div>
                        <div className="space-y-1 text-right">
                            <p className="text-[8px] font-black text-white/30 uppercase">Pass</p>
                            <p className="text-xs font-bold text-white tracking-widest leading-none">tecnico123</p>
                        </div>
                    </div>
                </div>

                <div className="mt-10 text-center">
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] leading-relaxed">
                        Sistema Exclusivo para Membros da Equipe Alfredo<br />
                        © 2024 • Todos os direitos reservados
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TechnicianLogin;
