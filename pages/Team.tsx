import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Mail,
  Shield,
  MapPin,
  Phone,
  Edit2,
  Trash2,
  UserCheck,
  UserX,
  ChevronRight,
  TrendingUp,
  Award,
  Briefcase
} from 'lucide-react';

const Team: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('Todos');

  const teamMembers = [
    { name: 'Ana Silva', email: 'ana.silva@empresa.com', role: 'Administrador', status: 'Ativo', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', performance: '98%', projects: 12 },
    { name: 'Carlos Pereira', email: 'carlos.p@empresa.com', role: 'Técnico de Campo', status: 'Ativo', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150', performance: '92%', projects: 45 },
    { name: 'Bruna Costa', email: 'bruna.costa@empresa.com', role: 'Gerente de Estoque', status: 'Inativo', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150', performance: '85%', projects: 8 },
    { name: 'Juliana Martins', email: 'juliana.m@empresa.com', role: 'Técnico de Campo', status: 'Ativo', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150', performance: '95%', projects: 32 },
  ];

  const filteredMembers = teamMembers.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'Todos' || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0d121b] dark:text-white tracking-tight">Equipe</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Gerenciamento de membros e permissões de acesso.</p>
        </div>
        <button
          className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          <span>Novo Membro</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Membros', value: teamMembers.length, icon: UserCheck, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Ativos Agora', value: teamMembers.filter(m => m.status === 'Ativo').length, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Produtividade', value: '94%', icon: Award, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Ocupação', value: '78%', icon: Briefcase, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#101622] p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-1">{stat.label}</p>
            <p className="text-xl font-bold text-[#0d121b] dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters Search */}
      <div className="bg-white dark:bg-[#101622] rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 dark:text-white"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          {['Todos', 'Administrador', 'Técnico de Campo', 'Gerente'].map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap
                ${roleFilter === role
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredMembers.map((member, i) => (
          <div key={i} className="bg-white dark:bg-[#101622] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            {/* Background Decoration */}
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full ${member.status === 'Ativo' ? 'bg-emerald-500/5' : 'bg-gray-500/5'} transition-transform group-hover:scale-150`} />

            <div className="flex items-center justify-between mb-6 relative">
              <div className="relative">
                <img src={member.avatar} alt={member.name} className="w-16 h-16 rounded-2xl object-cover shadow-md" />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-[#101622] ${member.status === 'Ativo' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
              </div>
              <div className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all cursor-pointer">
                <MoreVertical className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-1 mb-6">
              <h3 className="text-lg font-bold text-[#0d121b] dark:text-white leading-tight">{member.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <Shield className="w-3.5 h-3.5 text-primary/60" />
                <span>{member.role}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 truncate">
                <Mail className="w-3.5 h-3.5 opacity-60" />
                <span className="truncate">{member.email}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-2xl mb-6">
              <div className="flex flex-col italic">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Performance</span>
                <span className="text-sm font-bold text-emerald-600">{member.performance}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Obras</span>
                <span className="text-sm font-bold text-[#0d121b] dark:text-white">{member.projects}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex-1 py-2.5 px-4 bg-gray-50 dark:bg-white/5 text-[#0d121b] dark:text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                <Edit2 className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>
              {member.status === 'Ativo' ? (
                <button className="p-2.5 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/5 rounded-xl transition-all" title="Desativar">
                  <UserX className="w-5 h-5" />
                </button>
              ) : (
                <button className="p-2.5 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/5 rounded-xl transition-all" title="Ativar">
                  <UserCheck className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Add New Empty Card */}
        <button className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all group min-h-[280px]">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-bold text-sm uppercase tracking-wider">Convidar Membro</span>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default Team;
