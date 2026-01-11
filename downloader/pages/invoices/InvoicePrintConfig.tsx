import React, { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import InvoicePaper from '../../components/invoices/InvoicePaper';

type Model = 'modern' | 'classic' | 'compact';
type Paper = 'A4' | 'letter';

export default function InvoicePrintConfig() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [model, setModel] = useState<Model>((searchParams.get('model') as Model) || 'modern');
  const [paper, setPaper] = useState<Paper>((searchParams.get('paper') as Paper) || 'A4');
  const [showLogo, setShowLogo] = useState(searchParams.get('logo') !== '0');
  const [showTerms, setShowTerms] = useState(searchParams.get('terms') !== '0');
  const [showSignature, setShowSignature] = useState(searchParams.get('signature') !== '0');
  const [mTop, setMTop] = useState<number>(Number(searchParams.get('mt')) || 48);
  const [mRight, setMRight] = useState<number>(Number(searchParams.get('mr')) || 48);
  const [mBottom, setMBottom] = useState<number>(Number(searchParams.get('mb')) || 48);
  const [mLeft, setMLeft] = useState<number>(Number(searchParams.get('ml')) || 48);
  const [zoom, setZoom] = useState<number>(Number(searchParams.get('zoom')) || 100);

  useMemo(() => {
    const params: Record<string, string> = {
      model,
      paper,
      logo: showLogo ? '1' : '0',
      terms: showTerms ? '1' : '0',
      signature: showSignature ? '1' : '0',
      mt: String(mTop),
      mr: String(mRight),
      mb: String(mBottom),
      ml: String(mLeft),
      zoom: String(zoom),
    };
    setSearchParams(params);
  }, [model, paper, showLogo, showTerms, showSignature, mTop, mRight, mBottom, mLeft, zoom]);

  const margins = { top: mTop, right: mRight, bottom: mBottom, left: mLeft };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Configuração de Impressão</h1>
        <Link to={`/invoices/${id}`} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Voltar
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-500">Pré-visualização</div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={50}
                  max={200}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                />
                <span className="text-sm font-medium text-slate-700">{zoom}%</span>
              </div>
            </div>
            <div className="overflow-auto border border-gray-200 rounded-md bg-gray-50">
              <div
                className="origin-top-left"
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left', width: 'max-content' }}
              >
                <InvoicePaper model={model} paper={paper} margins={margins} showLogo={showLogo} showTerms={showTerms} showSignature={showSignature} />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-3">Modelo</h2>
              <div className="grid grid-cols-3 gap-2">
                <button
                  className={`rounded-md px-3 py-2 text-sm font-bold ${model === 'modern' ? 'bg-primary text-white' : 'bg-gray-100 text-slate-700'}`}
                  onClick={() => setModel('modern')}
                >
                  Moderno
                </button>
                <button
                  className={`rounded-md px-3 py-2 text-sm font-bold ${model === 'classic' ? 'bg-primary text-white' : 'bg-gray-100 text-slate-700'}`}
                  onClick={() => setModel('classic')}
                >
                  Clássico
                </button>
                <button
                  className={`rounded-md px-3 py-2 text-sm font-bold ${model === 'compact' ? 'bg-primary text-white' : 'bg-gray-100 text-slate-700'}`}
                  onClick={() => setModel('compact')}
                >
                  Compacto
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-3">Tipo de Papel</h2>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={paper}
                onChange={(e) => setPaper(e.target.value as Paper)}
              >
                <option value="A4">A4</option>
                <option value="letter">Carta</option>
              </select>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-3">Margens (px)</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Superior</label>
                  <input type="number" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={mTop} onChange={(e) => setMTop(Number(e.target.value))} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Direita</label>
                  <input type="number" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={mRight} onChange={(e) => setMRight(Number(e.target.value))} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Inferior</label>
                  <input type="number" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={mBottom} onChange={(e) => setMBottom(Number(e.target.value))} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Esquerda</label>
                  <input type="number" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value={mLeft} onChange={(e) => setMLeft(Number(e.target.value))} />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-3">Opções de Exibição</h2>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Logo</span>
                  <input type="checkbox" checked={showLogo} onChange={(e) => setShowLogo(e.target.checked)} />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Termos</span>
                  <input type="checkbox" checked={showTerms} onChange={(e) => setShowTerms(e.target.checked)} />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Assinatura</span>
                  <input type="checkbox" checked={showSignature} onChange={(e) => setShowSignature(e.target.checked)} />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

