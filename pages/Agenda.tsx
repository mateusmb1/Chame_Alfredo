import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  List,
  MapPin,
  Filter,
  X,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  User,
  MoreVertical
} from 'lucide-react';

const Agenda: React.FC = () => {
  const { appointments } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'list'>('month');
  const [showFilters, setShowFilters] = useState(false);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getEventsForDay = (day: number) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.startTime);
      return aptDate.getDate() === day &&
        aptDate.getMonth() === currentMonth &&
        aptDate.getFullYear() === currentYear;
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const statusColors = {
    agendado: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    confirmado: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    concluido: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    cancelado: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  };

  return (
    <div className="flex h-full flex-col space-y-4 md:space-y-6">
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#101622] p-4 md:p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-[#0d121b] dark:text-white tracking-tight">
              {monthNames[currentMonth]} {currentYear}
            </h1>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mt-1">Sua agenda de compromissos</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-50 dark:bg-white/5 rounded-2xl p-1">
            <button onClick={handlePrevMonth} className="p-2 text-gray-400 hover:text-primary transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="px-4 py-1.5 text-xs font-bold text-gray-500 hover:text-primary transition-colors border-x border-gray-200 dark:border-gray-800">
              Hoje
            </button>
            <button onClick={handleNextMonth} className="p-2 text-gray-400 hover:text-primary transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <button
            className="hidden sm:flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Novo Evento</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Mobile View Toggle & Action */}
        <div className="flex sm:hidden items-center justify-between gap-2">
          <div className="flex items-center bg-white dark:bg-[#101622] rounded-2xl p-1 border border-gray-100 dark:border-gray-800 shadow-sm h-12 flex-1 mr-2">
            <button
              onClick={() => setViewMode('month')}
              className={`flex-1 flex items-center justify-center rounded-xl transition-all ${viewMode === 'month' ? 'bg-primary text-white shadow-md' : 'text-gray-400'}`}
            >
              <CalendarIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 flex items-center justify-center rounded-xl transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-md' : 'text-gray-400'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <button className="w-12 h-12 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center active:scale-90 transition-transform">
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Sidebar Filters - Desktop or Expandable Mobile */}
        <div className={`lg:w-72 space-y-6 ${showFilters ? 'fixed inset-0 z-50 bg-white dark:bg-[#0d121b] p-6 lg:relative lg:p-0 lg:bg-transparent' : 'hidden lg:block'}`}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-black uppercase text-gray-400 tracking-widest leading-none">Filtros de Agenda</h2>
            <button onClick={() => setShowFilters(false)} className="lg:hidden p-2 text-gray-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-white dark:bg-[#101622] rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
            <div>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Técnicos de Campo</h3>
              <div className="space-y-3">
                {['João Silva', 'Maria Oliveira', 'Carlos Pereira'].map(name => (
                  <label key={name} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input type="checkbox" defaultChecked className="peer opacity-0 absolute size-5 cursor-pointer" />
                      <div className="size-5 rounded-lg border-2 border-gray-200 dark:border-gray-800 peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors">{name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Status</h3>
              <div className="space-y-3">
                {['Agendado', 'Confirmado', 'Concluído', 'Cancelado'].map(status => (
                  <label key={status} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input type="checkbox" defaultChecked className="peer opacity-0 absolute size-5 cursor-pointer" />
                      <div className="size-5 rounded-lg border-2 border-gray-200 dark:border-gray-800 peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${status === 'Agendado' ? 'bg-blue-500' : status === 'Confirmado' ? 'bg-amber-500' : status === 'Concluído' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors">{status}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-primary/5 rounded-3xl p-5 border border-primary/10">
            <h3 className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Dica Premium</h3>
            <p className="text-xs font-medium text-primary/80 leading-relaxed">Arraste e solte eventos no grid para reagendar rapidamente sem abrir o formulário.</p>
          </div>
        </div>

        {/* Calendar Grid / List Area */}
        <div className="flex-1 min-w-0 bg-white dark:bg-[#101622] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
          {viewMode === 'month' ? (
            <div className="flex-1 flex flex-col p-4">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'].map(day => (
                  <div key={day} className="text-center py-2 text-[10px] font-black text-gray-400 tracking-wider">
                    {day}
                  </div>
                ))}
              </div>
              <div className="flex-1 grid grid-cols-7 grid-rows-5 gap-1 min-h-0">
                {paddingDays.map(d => (
                  <div key={`pad-${d}`} className="bg-gray-50/50 dark:bg-white/2 rounded-2xl" />
                ))}
                {days.map(day => {
                  const dayEvents = getEventsForDay(day);
                  const isToday = day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();

                  return (
                    <div
                      key={day}
                      className={`relative group rounded-2xl flex flex-col border border-transparent transition-all overflow-hidden ${isToday ? 'bg-primary/5 border-primary/20' : 'bg-gray-50/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 hover:shadow-xl hover:shadow-primary/5 hover:z-10 hover:scale-[1.02]'} min-h-[80px] sm:min-h-[120px] p-2`}
                    >
                      <span className={`text-xs font-black mb-1 block ${isToday ? 'text-primary' : 'text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                        {day}
                      </span>
                      <div className="space-y-1 overflow-y-auto no-scrollbar">
                        {dayEvents.map((evt, i) => (
                          <div
                            key={i}
                            className={`px-2 py-0.5 rounded-lg border text-[9px] font-bold truncate transition-all active:scale-95 ${statusColors[evt.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-500 border-gray-200'}`}
                            title={evt.title}
                          >
                            {evt.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {appointments.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                  <CalendarIcon className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-medium text-sm">Nenhum evento para este período</p>
                </div>
              ) : (
                appointments.map((apt, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-white/5 rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex items-start gap-4">
                    <div className="flex flex-col items-center gap-1 w-12 pt-1">
                      <span className="text-[10px] font-black text-gray-400 uppercase">{new Date(apt.startTime).toLocaleDateString('pt-BR', { weekday: 'short' })}</span>
                      <span className="text-xl font-black text-[#0d121b] dark:text-white leading-none">{new Date(apt.startTime).getDate()}</span>
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-[#0d121b] dark:text-white truncate">{apt.title}</h3>
                        <div className={`px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase ${statusColors[apt.status as keyof typeof statusColors]}`}>
                          {apt.status}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                          <Clock className="w-3.5 h-3.5 text-primary/60" />
                          <span>{new Date(apt.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium truncate">
                          <MapPin className="w-3.5 h-3.5 text-rose-500/60" />
                          <span className="truncate">{apt.location || 'Não informado'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                          <User className="w-3.5 h-3.5 text-emerald-500/60" />
                          <span>{apt.technicianId || 'Sem técnico'}</span>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-primary hover:bg-white dark:hover:bg-white/10 rounded-xl transition-all h-10 w-10 flex items-center justify-center border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};
export default Agenda;
