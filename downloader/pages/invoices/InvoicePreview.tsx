import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Mail, Link as LinkIcon, Download, ArrowLeft, Printer } from 'lucide-react';
import InvoicePaper from '../../components/invoices/InvoicePaper';

export default function InvoicePreview() {
  const { id } = useParams();
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Pré-visualizar Fatura</h1>
        <Link to="/invoices" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Voltar
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Document Preview */}
        <div className="lg:col-span-2">
          <InvoicePaper />
        </div>

        {/* Action Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Ações</h2>
            <div className="space-y-3">
              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-primary-700 transition-colors">
                <Mail className="h-5 w-5" />
                Enviar por E-mail
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-gray-200 transition-colors">
                <LinkIcon className="h-5 w-5" />
                Copiar Link
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-gray-200 transition-colors">
                <Download className="h-5 w-5" />
                Baixar PDF
              </button>
              <Link to={`/invoices/${id}/print-config`} className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:bg-gray-50 transition-colors">
                <Printer className="h-5 w-5" />
                Imprimir
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
