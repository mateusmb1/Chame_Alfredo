import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';

const Agenda: React.FC = () => {
  const { appointments } = useApp();

  // Get current month and year
  const [currentDate] = useState(new Date());
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Calculate days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Map appointments to calendar days
  const getEventsForDay = (day: number) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.startTime);
      return aptDate.getDate() === day &&
        aptDate.getMonth() === currentMonth &&
        aptDate.getFullYear() === currentYear;
    }).map(apt => ({
      id: apt.id,
      title: apt.title,
      person: apt.location || 'Não especificado',
      color: apt.status === 'agendado' ? 'bg-[#AEC6CF]' :
        apt.status === 'confirmado' ? 'bg-[#FFD700]' :
          apt.status === 'concluido' ? 'bg-[#77DD77]' :
            'bg-[#FF6961] text-white',
      appointment: apt
    }));
  };

  return (
    <div class="flex h-full flex-col overflow-hidden">
      {/* Page Header */}
      <header class="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-[#18202F]">
        <div class="flex items-center gap-4">
          <h1 class="text-2xl font-bold text-[#0d121b] dark:text-white">Setembro 2024</h1>
          <div class="flex items-center gap-1 rounded-lg border border-gray-300 p-1 dark:border-gray-600">
            <button class="flex h-8 w-8 items-center justify-center rounded text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
              <span class="material-symbols-outlined text-xl">chevron_left</span>
            </button>
            <button class="flex h-8 w-8 items-center justify-center rounded text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
              <span class="material-symbols-outlined text-xl">chevron_right</span>
            </button>
          </div>
          <button class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
            Hoje
          </button>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex h-10 w-64 items-center justify-center rounded-lg bg-background-light p-1 dark:bg-background-dark">
            <label class="flex h-full flex-1 cursor-pointer items-center justify-center rounded-lg bg-white shadow-sm px-2 text-sm font-medium text-primary dark:bg-gray-700 dark:text-white">
              <span class="truncate">Mês</span>
              <input type="radio" name="view-selector" value="Mês" class="sr-only" defaultChecked />
            </label>
            <label class="flex h-full flex-1 cursor-pointer items-center justify-center rounded-lg px-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <span class="truncate">Semana</span>
              <input type="radio" name="view-selector" value="Semana" class="sr-only" />
            </label>
            <label class="flex h-full flex-1 cursor-pointer items-center justify-center rounded-lg px-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <span class="truncate">Dia</span>
              <input type="radio" name="view-selector" value="Dia" class="sr-only" />
            </label>
          </div>
          <button class="flex h-10 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary px-4 text-sm font-bold text-white hover:bg-primary/90">
            <span class="material-symbols-outlined text-xl">add</span>
            <span class="truncate">Novo Agendamento</span>
          </button>
        </div>
      </header>

      <div class="flex flex-1 overflow-hidden">
        {/* Filter Panel */}
        <aside class="w-72 flex-shrink-0 border-r border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-[#18202F] overflow-y-auto">
          <h2 class="mb-4 text-lg font-semibold text-[#0d121b] dark:text-white">Filtros</h2>
          <div class="space-y-6">
            <div>
              <h3 class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Técnicos</h3>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input type="checkbox" defaultChecked class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span class="ml-2 text-sm text-gray-800 dark:text-gray-200">João Silva</span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" defaultChecked class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span class="ml-2 text-sm text-gray-800 dark:text-gray-200">Maria Oliveira</span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span class="ml-2 text-sm text-gray-800 dark:text-gray-200">Carlos Pereira</span>
                </label>
              </div>
            </div>
            <div>
              <h3 class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Status do Serviço</h3>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input type="checkbox" defaultChecked class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span class="ml-2 text-sm text-gray-800 dark:text-gray-200">Agendado</span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" defaultChecked class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span class="ml-2 text-sm text-gray-800 dark:text-gray-200">Em Andamento</span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span class="ml-2 text-sm text-gray-800 dark:text-gray-200">Concluído</span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span class="ml-2 text-sm text-gray-800 dark:text-gray-200">Cancelado</span>
                </label>
              </div>
            </div>
            <div>
              <h3 class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Legenda</h3>
              <div class="space-y-2">
                <div class="flex items-center">
                  <span class="block h-3 w-3 rounded-full bg-[#AEC6CF]"></span>
                  <span class="ml-2 text-xs text-gray-700 dark:text-gray-300">Agendado</span>
                </div>
                <div class="flex items-center">
                  <span class="block h-3 w-3 rounded-full bg-[#FFD700]"></span>
                  <span class="ml-2 text-xs text-gray-700 dark:text-gray-300">Em Andamento</span>
                </div>
                <div class="flex items-center">
                  <span class="block h-3 w-3 rounded-full bg-[#77DD77]"></span>
                  <span class="ml-2 text-xs text-gray-700 dark:text-gray-300">Concluído</span>
                </div>
                <div class="flex items-center">
                  <span class="block h-3 w-3 rounded-full bg-[#FF6961]"></span>
                  <span class="ml-2 text-xs text-gray-700 dark:text-gray-300">Cancelado</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Calendar Grid */}
        <div class="flex flex-1 flex-col overflow-auto bg-white p-4 dark:bg-background-dark/50">
          <div class="grid flex-1 grid-cols-7 auto-rows-fr gap-px border border-gray-200 bg-gray-200 dark:border-gray-700 dark:bg-gray-700 rounded-lg overflow-hidden">
            {/* Header Days */}
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} class="bg-gray-50 dark:bg-gray-800 p-2 text-center text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
                {day}
              </div>
            ))}

            {/* Days */}
            {days.map(day => {
              const dayEvents = getEventsForDay(day);
              const today = new Date().getDate();
              const isToday = day === today && currentMonth === new Date().getMonth();

              return (
                <div key={day} className={`min-h-24 sm:min-h-28 md:min-h-32 bg-white dark:bg-[#18202F] p-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative ${isToday ? 'ring-2 ring-inset ring-primary z-10' : ''}`}>
                  <span className={`text-sm font-medium ${isToday ? 'bg-primary text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-gray-800 dark:text-gray-200'}`}>{day}</span>

                  <div className="mt-1 space-y-1">
                    {dayEvents.map((evt, idx) => (
                      <div key={idx} className={`cursor-pointer rounded-md ${evt.color} p-1 text-xs text-gray-800 shadow-sm`}>
                        <p className="font-bold truncate">{evt.title}</p>
                        <p className="truncate opacity-90">{evt.person}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Empty cells filler for grid */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={`empty-${i}`} class="min-h-24 sm:min-h-28 md:min-h-32 bg-gray-50/50 dark:bg-gray-800/50 p-2">
                <span class="text-sm font-medium text-gray-400 dark:text-gray-600">{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agenda;
