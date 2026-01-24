import React, { useState } from 'react';
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
  User,
  MoreVertical,
  Activity,
  ShieldCheck,
  Zap,
  Building,
  Target
} from 'lucide-react';
import AppointmentModal from '../components/AppointmentModal';
import { Appointment } from '../types/appointment';

const Agenda: React.FC = () => {
  const { appointments } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'list'>('month');
  const [showFilters, setShowFilters] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

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

  const statusColors = {
    aberta: 'bg-blue-500/10 text-blue-500 border-blue-500/10',
    agendada: 'bg-purple-500/10 text-purple-500 border-purple-500/10',
    em_andamento: 'bg-amber-500/10 text-amber-500 border-amber-500/10',
    concluido: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10',
    concluida: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10', // Map both just in case
    faturada: 'bg-green-500/10 text-green-500 border-green-500/10',
    cancelada: 'bg-rose-500/10 text-rose-500 border-rose-500/10',
  };

  const handlePrevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));

  const handleDayClick = (dayNum: number) => {
    const date = new Date(currentYear, currentMonth, dayNum);
    setSelectedDate(date);
    setSelectedAppointment(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (e: React.MouseEvent, apt: Appointment) => {
    e.stopPropagation();
    setSelectedAppointment(apt);
    setSelectedDate(undefined);
    setIsModalOpen(true);
  };

  const handleNewResource = () => {
    setSelectedDate(new Date());
    setSelectedAppointment(null);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-[1700px] mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Premium Header Control */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-gray-100 dark:border-gray-800/50">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-8 bg-primary rounded-full"></div>
            <p className="text-primary text-xs font-black uppercase tracking-[0.3em] leading-none">Cronograma Operacional</p>
          </div>
          <h1 className="text-5xl font-black text-[#1e293b] dark:text-white tracking-tighter leading-none mb-3 italic">
            Planejamento<span className="text-primary">.</span>
          </h1>
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2 bg-white dark:bg-[#101622] px-6 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <button onClick={handlePrevMonth} className="p-2 text-gray-300 hover:text-primary transition-all"><ChevronLeft className="w-6 h-6" /></button>
              <span className="text-lg font-black uppercase italic text-[#1e293b] dark:text-white px-4 border-x border-gray-100 dark:border-gray-800 min-w-[200px] text-center">{monthNames[currentMonth]} {currentYear}</span>
              <button onClick={handleNextMonth} className="p-2 text-gray-300 hover:text-primary transition-all"><ChevronRight className="w-6 h-6" /></button>
            </div>
            <button onClick={() => setCurrentDate(new Date())} className="h-14 px-8 bg-gray-50 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-all rounded-2xl">Voltar para Hoje</button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white dark:bg-[#101622] p-2 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <button onClick={() => setViewMode('month')} className={`h-12 w-14 flex items-center justify-center rounded-xl transition-all ${viewMode === 'month' ? 'bg-primary text-white shadow-lg' : 'text-gray-300'}`}><CalendarIcon className="w-5 h-5" /></button>
            <button onClick={() => setViewMode('list')} className={`h-12 w-14 flex items-center justify-center rounded-xl transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-lg' : 'text-gray-300'}`}><List className="w-5 h-5" /></button>
          </div>
          <button
            onClick={handleNewResource}
            className="h-16 px-10 bg-[#1e293b] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center gap-4 hover:bg-primary transition-all shadow-2xl hover:shadow-primary/20 hover:-translate-y-1"
          >
            <Zap className="w-5 h-5" />
            <span>Alocar Recurso</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Dynamic Navigation/Filters */}
        <aside className="lg:w-80 space-y-8">
          <div className="bg-white dark:bg-[#101622] rounded-[3rem] p-8 border border-gray-100 dark:border-gray-800/50 shadow-sm">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50 dark:border-gray-800">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Segmentação</h3>
              <Filter className="w-4 h-4 text-gray-200" />
            </div>

            <div className="space-y-8">
              <section>
                <h4 className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-4">Corpo Técnico</h4>
                <div className="space-y-4">
                  {['Especialista A', 'Especialista B', 'Trainee C'].map((name, i) => (
                    <label key={name} className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center text-[10px] font-bold text-gray-400 group-hover:bg-primary group-hover:text-white transition-all">{name[name.length - 1]}</div>
                        <span className="text-xs font-black uppercase tracking-widest text-[#1e293b]/60 dark:text-gray-400 group-hover:text-primary transition-colors">{name}</span>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded-md border-2 border-gray-100 dark:border-gray-800 text-primary focus:ring-primary/10" />
                    </label>
                  ))}
                </div>
              </section>

              <section>
                <h4 className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-4">Tipos de Alocação</h4>
                <div className="space-y-3">
                  {['Preventiva', 'Corretiva', 'Emergencial'].map(type => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-2 h-2 rounded-full ${type === 'Emergencial' ? 'bg-red-500 animate-pulse' : type === 'Corretiva' ? 'bg-amber-500' : 'bg-primary'}`} />
                      <span className="text-xs font-black uppercase tracking-widest text-[#1e293b]/60 dark:text-gray-400 group-hover:text-primary transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <div className="bg-[#1e293b] rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform"><Target className="w-20 h-20" /></div>
            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 relative z-10">Meta Diária</h4>
            <div className="flex items-end gap-3 mb-4 relative z-10">
              <span className="text-5xl font-black italic tracking-tighter">85%</span>
              <span className="text-[10px] uppercase font-bold text-white/40 mb-2">Conclusão</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative z-10">
              <div className="h-full bg-primary" style={{ width: '85%' }} />
            </div>
          </div>
        </aside>

        {/* Main Grid Area */}
        <div className="flex-1 bg-white dark:bg-[#101622] rounded-[3.5rem] border border-gray-100 dark:border-gray-800/50 shadow-2xl overflow-hidden min-h-[800px] flex flex-col">
          {viewMode === 'month' ? (
            <div className="flex-1 flex flex-col p-10">
              <div className="grid grid-cols-7 gap-4 mb-8">
                {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'].map(day => (
                  <div key={day} className="text-center text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">
                    {day}
                  </div>
                ))}
              </div>
              <div className="flex-1 grid grid-cols-7 gap-4 auto-rows-fr min-h-0">
                {paddingDays.map(d => (
                  <div key={`pad-${d}`} className="bg-gray-50/20 dark:bg-white/1 rounded-3xl opacity-30" />
                ))}
                {days.map(day => {
                  const dayEvents = getEventsForDay(day);
                  const isToday = day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();

                  return (
                    <div
                      key={day}
                      onClick={() => handleDayClick(day)}
                      className={`relative group rounded-[2.5rem] flex flex-col transition-all p-4 border overflow-hidden cursor-pointer
                      ${isToday
                          ? 'bg-[#1e293b] text-white shadow-2xl scale-[1.05] z-10 border-transparent'
                          : 'bg-gray-50/50 dark:bg-white/5 border-gray-50 dark:border-gray-800 hover:border-primary/20 hover:bg-white dark:hover:bg-white/10 hover:shadow-xl'}`}
                    >
                      <span className={`text-base font-black italic tracking-tighter mb-4 block ${isToday ? 'text-primary' : 'text-gray-300 group-hover:text-[#1e293b] dark:group-hover:text-white'}`}>
                        {day < 10 ? `0${day}` : day}
                      </span>
                      <div className="space-y-2 overflow-y-auto no-scrollbar max-h-[120px]">
                        {dayEvents.map((evt, i) => (
                          <div
                            key={i}
                            onClick={(e) => handleEventClick(e, evt)}
                            className={`px-3 py-1.5 rounded-xl border text-[8px] font-black uppercase tracking-widest truncate transition-all active:scale-95 shadow-sm
                            ${isToday ? 'bg-white/10 border-white/10 text-white' : statusColors[evt.status as keyof typeof statusColors] || 'bg-white text-gray-400'}`}
                          >
                            {evt.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-[8px] font-black text-primary uppercase tracking-widest text-center">+ {dayEvents.length - 3} Eventos</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-12 space-y-6 no-scrollbar">
              {appointments.length === 0 ? (
                <div className="py-32 flex flex-col items-center justify-center text-gray-200">
                  <Activity className="w-20 h-20 mb-6 opacity-20" />
                  <p className="font-black text-xs uppercase tracking-[0.3em]">Fluxo Operacional Limpo</p>
                </div>
              ) : (
                appointments.map((apt, i) => (
                  <div
                    key={i}
                    onClick={(e) => handleEventClick(e, apt)}
                    className="group flex items-center gap-8 bg-gray-50/50 dark:bg-white/5 rounded-[3rem] p-8 border border-transparent hover:border-primary/20 hover:bg-white dark:hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden"
                  >
                    {/* Event Type Accent */}
                    <div className="absolute left-0 top-0 h-full w-2 bg-primary"></div>

                    <div className="flex flex-col items-center justify-center w-20 text-center border-r border-gray-100 dark:border-gray-800 pr-8">
                      <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">{new Date(apt.startTime).toLocaleDateString('pt-BR', { weekday: 'short' })}</span>
                      <span className="text-4xl font-black text-[#1e293b] dark:text-white italic tracking-tighter italic">{new Date(apt.startTime).getDate()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4 mb-3">
                        <div className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] shadow-sm ${statusColors[apt.status as keyof typeof statusColors]}`}>
                          {apt.status}
                        </div>
                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest leading-none">ID #{String(i).padStart(3, '0')}</span>
                      </div>
                      <h3 className="text-2xl font-black text-[#1e293b] dark:text-white italic uppercase tracking-tighter mb-4 group-hover:text-primary transition-colors truncate">{apt.title}</h3>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-primary/60"><Clock className="w-4 h-4" /></div>
                          <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{new Date(apt.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}h</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-rose-500/60"><MapPin className="w-4 h-4" /></div>
                          <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest truncate">{apt.location?.split(',')[0] || 'Base'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-emerald-500/60"><User className="w-4 h-4" /></div>
                          <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{apt.technicianId?.split('-')[0] || 'Unassigned'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="h-14 w-14 rounded-2xl bg-white dark:bg-white/10 shadow-sm flex items-center justify-center text-gray-400 hover:text-primary transition-all"><ShieldCheck className="w-6 h-6" /></button>
                      <button className="h-14 w-14 rounded-2xl bg-white dark:bg-white/10 shadow-sm flex items-center justify-center text-gray-400 hover:text-primary transition-all"><MoreVertical className="w-6 h-6" /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialDate={selectedDate}
        appointment={selectedAppointment}
      />

      <style dangerouslySetInnerHTML={{
        __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};
export default Agenda;
