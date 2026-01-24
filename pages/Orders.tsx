import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../components/ConfirmDialog';
import { useApp } from '../contexts/AppContext';
import { Order } from '../types/order';
import { useToast } from '../contexts/ToastContext';
import {
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  Clock,
  Activity,
  ShieldCheck,
  LayoutGrid,
  List
} from 'lucide-react';

// New Components
import { useDashboardTheme } from '../contexts/DashboardThemeContext';
import PageShell from '../components/layout/PageShell';
import Toolbar from '../components/layout/Toolbar';
import DataTable from '../components/tables/DataTable';
import ServiceOrderDrawer from '../components/dashboard/ServiceOrderDrawer';

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const { orders, deleteOrder } = useApp();
  const { showToast } = useToast();
  const { theme } = useDashboardTheme();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = o.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'todas'
        ? true
        : activeTab === 'leads'
          ? o.origin?.startsWith('landing_')
          : o.status === activeTab;
      return matchesSearch && matchesTab;
    }).sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime());
  }, [orders, searchQuery, activeTab]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'nova': return { color: 'text-gray-400 bg-gray-50/50 dark:bg-white/5', label: 'Lançada' };
      case 'em_andamento': return { color: 'text-blue-500 bg-blue-500/10', label: 'Em Curso' };
      case 'pendente': return { color: 'text-[#F97316] bg-[#F97316]/10', label: 'Backlog' };
      case 'concluida': return { color: 'text-emerald-500 bg-emerald-500/10', label: 'Finalizada' };
      default: return { color: 'text-gray-500 bg-gray-50', label: status };
    }
  };

  const handleEdit = (id: string) => {
    setSelectedOrderId(id);
    setDrawerOpen(true);
  };

  const handleNew = () => {
    setSelectedOrderId('new');
    setDrawerOpen(true);
  };

  const handleDelete = (id: string) => {
    setOrderToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const tableColumns = [
    {
      header: 'Identificação',
      accessor: (row: Order) => (
        <div className="flex flex-col">
          <span className="text-[11px] font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">{row.clientName}</span>
          <span className="text-[9px] font-bold text-slate-400">OS #{row.id.substring(0, 8)}</span>
        </div>
      )
    },
    { header: 'Serviço', accessor: 'serviceType' as const },
    { header: 'Técnico', accessor: 'technicianName' as const },
    {
      header: 'Previsão',
      accessor: (row: Order) => new Date(row.scheduledDate).toLocaleDateString('pt-BR')
    },
    {
      header: 'Status',
      accessor: (row: Order) => {
        const config = getStatusConfig(row.status);
        return (
          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${config.color} border border-current opacity-80`}>
            {config.label}
          </span>
        );
      }
    },
    {
      header: 'Budget',
      accessor: (row: Order) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row.value),
      className: 'text-right font-black italic'
    }
  ];

  if (theme === 'commandCenter') {
    return (
      <PageShell title="Controle de Serviços" breadcrumb={['Home', 'Serviços']}>
        <div className="space-y-4">
          <Toolbar
            primaryAction={{
              label: 'Nova OS',
              icon: <Plus size={14} />,
              onClick: handleNew
            }}
            views={[
              { id: 'list', label: 'Lista', active: viewMode === 'list', onClick: () => setViewMode('list') },
              { id: 'grid', label: 'Cards', active: viewMode === 'grid', onClick: () => setViewMode('grid') }
            ]}
          >
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              {['todas', 'leads', 'nova', 'pendente', 'em_andamento', 'concluida'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-950 text-primary shadow-sm' : 'text-slate-400'}`}
                >
                  {tab === 'todas' ? 'Tudo' : tab === 'leads' ? 'Leads' : getStatusConfig(tab).label}
                </button>
              ))}
            </div>
          </Toolbar>

          <DataTable
            columns={tableColumns}
            data={filteredOrders}
            onRowClick={(row) => handleEdit(row.id)}
            rowActions={(row) => (
              <div className="flex items-center gap-1">
                <button onClick={(e) => { e.stopPropagation(); navigate(`/orders/${row.id}`); }} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-primary"><Eye size={14} /></button>
                <button onClick={(e) => { e.stopPropagation(); handleEdit(row.id); }} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-blue-500"><Edit2 size={14} /></button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
              </div>
            )}
          />

          <ServiceOrderDrawer
            open={drawerOpen}
            orderId={selectedOrderId}
            onClose={() => setDrawerOpen(false)}
          />

          <ConfirmDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={() => { if (orderToDelete) deleteOrder(orderToDelete); setIsDeleteDialogOpen(false); showToast('success', 'Registro removido.'); }}
            title="Excluir OS"
            message="Tem certeza que deseja remover este registro permanentemente?"
            type="danger"
          />
        </div>
      </PageShell>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 p-6">
      <div className="flex justify-between items-end border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase">Ordens de Serviço</h1>
          <p className="text-slate-500 text-sm">Gerenciamento tradicional de serviços.</p>
        </div>
        <button onClick={handleNew} className="bg-[#1e293b] text-white px-8 py-3 rounded-xl font-black uppercase text-xs hover:bg-primary transition-all shadow-lg">Nova OS</button>
      </div>

      <DataTable columns={tableColumns} data={filteredOrders} onRowClick={(row) => handleEdit(row.id)} />

      <ServiceOrderDrawer
        open={drawerOpen}
        orderId={selectedOrderId}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
};

export default Orders;
