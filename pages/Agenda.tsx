import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  List,
  MapPin,
  Clock,
  User,
  Zap,
  Target
} from 'lucide-react';
import AppointmentModal from '../components/AppointmentModal';
import { Appointment } from '../types/appointment';

// New Components
import { useDashboardTheme } from '../contexts/DashboardThemeContext';
import PageShell from '../components/layout/PageShell';
import Toolbar from '../components/layout/Toolbar';

const Agenda: React.FC = () => {
  const { appointments } = useApp();
  const { theme } = useDashboardTheme();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');

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
    aberta: 'bg-blue-500/10 text-blue-600',
    agendada: 'bg-purple-500/10 text-purple-600',
    em_andamento: 'bg-amber-500/10 text-amber-600',
    concluida: 'bg-emerald-500/10 text-emerald-600',
    cancelada: 'bg-rose-500/10 text-rose-600',
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

  if (theme === 'commandCenter') {
    return (
      <PageShell
        title="Cronograma de Operações"
        breadcrumb={['Home', 'Agenda']}
      >
        <div className="space-y-4">
          <Toolbar
            primaryAction={{
              label: 'Agendar',
              icon: <Plus size={14} />,
              onClick: () => { setSelectedDate(new Date()); setSelectedAppointment(null); setIsModalOpen(true); }
            }}
            views={[
              { id: 'month', label: 'Calendário', active: viewMode === 'month', onClick: () => setViewMode('month') },
              { id: 'list', label: 'Timeline', active: viewMode === 'list', onClick: () => setViewMode('list') }
            ]}
          >
            <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
              <button onClick={handlePrevMonth} className="p-1 hover:text-primary transition-colors"><ChevronLeft size={16} /></button>
              <span className="text-[10px] font-black uppercase italic min-w-[120px] text-center">{monthNames[currentMonth]} {currentYear}</span>
              <button onClick={handleNextMonth} className="p-1 hover:text-primary transition-colors"><ChevronRight size={16} /></button>
            </div>
          </Toolbar>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            {viewMode === 'month' ? (
              <div className="p-6">
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map(day => (
                    <div key={day} className="text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2 auto-rows-[100px]">
                  {paddingDays.map(d => <div key={`pad-${d}`} className="bg-slate-50/50 dark:bg-slate-800/10 rounded-xl" />)}
                  {days.map(day => {
                    const dayEvents = getEventsForDay(day);
                    const isToday = day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();

                    return (
                      <div
                        key={day}
                        onClick={() => handleDayClick(day)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 overflow-hidden
                          ${isToday ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'}`}
                      >
                        <span className={`text-[11px] font-black italic ${isToday ? 'text-primary' : 'text-slate-400'}`}>
                          {day < 10 ? `0${day}` : day}
                        </span>
                        <div className="flex flex-col gap-1 overflow-y-auto no-scrollbar">
                          {dayEvents.slice(0, 3).map((evt, i) => (
                            <div key={i} className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase truncate border border-current ${statusColors[evt.status as keyof typeof statusColors] || 'bg-slate-100'}`}>
                              {evt.title}
                            </div>
                          ))}
                          {dayEvents.length > 3 && <div className="text-[7px] font-bold text-center text-slate-400">+ {dayEvents.length - 3}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {appointments.length === 0 ? (
                  <div className="p-20 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Nenhum agendamento</div>
                ) : (
                  appointments.slice(0, 20).map((apt, i) => (
                    <div key={i} className="p-4 flex items-center gap-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={(e) => handleEventClick(e, apt)}>
                      <div className="w-12 text-center">
                        <p className="text-[9px] font-black text-slate-300 uppercase">{new Date(apt.startTime).toLocaleDateString('pt-BR', { weekday: 'short' })}</p>
                        <p className="text-xl font-black text-slate-900 dark:text-white italic">{new Date(apt.startTime).getDate()}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-wider ${statusColors[apt.status as keyof typeof statusColors] || 'bg-slate-100'}`}>{apt.status}</span>
                          <span className="text-[9px] font-bold text-slate-400">@{new Date(apt.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}h</span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase italic truncate tracking-tight">{apt.title}</h4>
                      </div>
                      <div className="flex items-center gap-3 text-slate-400">
                        <MapPin size={14} />
                        <User size={14} />
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
      </PageShell>
    );
  }

  // Classic view simplified
  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-8">
      <div className="flex justify-between items-end border-b pb-6">
        <h1 className="text-3xl font-black text-slate-900">Agenda</h1>
        <button onClick={() => { setSelectedDate(new Date()); setSelectedAppointment(null); setIsModalOpen(true); }} className="bg-primary text-white px-6 py-2 rounded-lg font-bold">Novo Evento</button>
      </div>
      <div className="grid grid-cols-7 gap-4">
        {days.map(d => <div key={d} className="p-4 bg-white border rounded-xl">{d}</div>)}
      </div>
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialDate={selectedDate}
        appointment={selectedAppointment}
      />
    </div>
  );
};

export default Agenda;
