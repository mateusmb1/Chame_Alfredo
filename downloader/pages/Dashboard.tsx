import React from 'react';
import { TrendingUp, Users, Package, AlertCircle, Receipt, FileText, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { name: 'Receita Total', value: 'R$ 45.231,89', icon: TrendingUp, change: '+20.1%', changeType: 'positive' },
  { name: 'Clientes Ativos', value: '24', icon: Users, change: '+2', changeType: 'positive' },
  { name: 'Produtos em Baixo Estoque', value: '3', icon: AlertCircle, change: 'Urgent', changeType: 'negative' },
  { name: 'Total Serviços', value: '156', icon: Package, change: '+12%', changeType: 'positive' },
];

const quickActions = [
  { name: 'Faturas', description: 'Gerenciar faturas e pagamentos', icon: Receipt, href: '/invoices', color: 'bg-blue-500' },
  { name: 'Contratos', description: 'Gerenciar contratos recorrentes', icon: FileText, href: '/contracts', color: 'bg-green-500' },
  { name: 'Produtos', description: 'Gerenciar produtos e serviços', icon: ShoppingCart, href: '/products', color: 'bg-purple-500' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <dt>
              <div className="absolute rounded-md bg-primary/10 p-3">
                <item.icon className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-1 sm:pb-2">
              <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
            </dd>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {quickActions.map((action) => (
          <Link
            key={action.name}
            to={action.href}
            className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className={`${action.color} rounded-lg p-3 text-white`}>
                <action.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  {action.name}
                </h3>
                <p className="text-sm text-gray-500">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Bem-vindo ao GestãoPro</h3>
        <p className="mt-1 text-sm text-gray-500">Selecione uma opção no menu lateral ou use os atalhos acima para começar.</p>
      </div>
    </div>
  );
}