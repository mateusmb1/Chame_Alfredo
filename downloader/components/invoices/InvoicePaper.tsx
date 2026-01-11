import React from 'react';

type Model = 'modern' | 'classic' | 'compact';
type Paper = 'A4' | 'letter';

type Margins = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

type Props = {
  model?: Model;
  paper?: Paper;
  margins?: Margins;
  showLogo?: boolean;
  showTerms?: boolean;
  showSignature?: boolean;
};

export default function InvoicePaper({
  model = 'modern',
  paper = 'A4',
  margins = { top: 48, right: 48, bottom: 48, left: 48 },
  showLogo = true,
  showTerms = true,
  showSignature = true,
}: Props) {
  const size = paper === 'A4' ? { width: 794, height: 1123 } : { width: 816, height: 1056 };
  const wrapperClasses =
    'bg-white shadow-lg rounded-sm border border-gray-200 flex flex-col justify-between';

  const headerTitleClasses =
    model === 'classic'
      ? 'text-4xl font-bold text-gray-300 mb-2'
      : model === 'compact'
      ? 'text-3xl font-bold text-gray-300 mb-2'
      : 'text-4xl font-bold text-gray-200 mb-2';

  const sectionTitleClasses =
    model === 'compact' ? 'text-xs font-bold text-gray-400 uppercase tracking-wider mb-2' : 'text-xs font-bold text-gray-400 uppercase tracking-wider mb-2';

  const paddingStyle: React.CSSProperties = {
    paddingTop: margins.top,
    paddingRight: margins.right,
    paddingBottom: margins.bottom,
    paddingLeft: margins.left,
    width: size.width,
    height: size.height,
  };

  return (
    <div className={wrapperClasses} style={paddingStyle}>
      <div>
        <div className="flex justify-between items-start mb-12">
          <div className="flex items-center gap-3">
            {showLogo && (
              <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center text-white">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            )}
            <div>
              <h2 className={model === 'classic' ? 'text-xl font-semibold text-slate-800' : 'text-xl font-bold text-slate-900'}>Sua Empresa de Serviços</h2>
              <p className="text-sm text-gray-500">Rua Exemplo, 123</p>
              <p className="text-sm text-gray-500">CNPJ: 00.000.000/0001-00</p>
            </div>
          </div>
          <div className="text-right">
            <h1 className={headerTitleClasses}>FATURA</h1>
            <p className="font-medium text-slate-900">#INV-2024-00123</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className={sectionTitleClasses}>Faturado Para</h3>
            <p className="font-bold text-slate-900">Cliente Exemplo Ltda.</p>
            <p className="text-sm text-gray-500">Rua do Cliente, 456</p>
            <p className="text-sm text-gray-500">cliente@exemplo.com</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className={sectionTitleClasses}>Data Emissão</h3>
              <p className="text-sm font-medium text-slate-900">15 Ago, 2024</p>
            </div>
            <div>
              <h3 className={sectionTitleClasses}>Vencimento</h3>
              <p className="text-sm font-medium text-slate-900">30 Ago, 2024</p>
            </div>
          </div>
        </div>

        <div className={model === 'compact' ? 'mb-6' : 'mb-8'}>
          <table className="min-w-full">
            <thead>
              <tr className={model === 'classic' ? 'border-b border-gray-200' : 'border-b-2 border-gray-100'}>
                <th className="py-3 text-left text-xs font-bold text-gray-400 uppercase">Descrição</th>
                <th className="py-3 text-center text-xs font-bold text-gray-400 uppercase">Qtd</th>
                <th className="py-3 text-right text-xs font-bold text-gray-400 uppercase">Preço Unit.</th>
                <th className="py-3 text-right text-xs font-bold text-gray-400 uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-4 text-sm font-medium text-slate-900">Desenvolvimento Web</td>
                <td className="py-4 text-center text-sm text-gray-500">1</td>
                <td className="py-4 text-right text-sm text-gray-500">R$ 2.500,00</td>
                <td className="py-4 text-right text-sm font-medium text-slate-900">R$ 2.500,00</td>
              </tr>
              <tr>
                <td className="py-4 text-sm font-medium text-slate-900">Manutenção Mensal</td>
                <td className="py-4 text-center text-sm text-gray-500">3</td>
                <td className="py-4 text-right text-sm text-gray-500">R$ 150,00</td>
                <td className="py-4 text-right text-sm font-medium text-slate-900">R$ 450,00</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mb-12">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal:</span>
              <span>R$ 2.950,00</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Impostos (5%):</span>
              <span>R$ 147,50</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-slate-900 border-t-2 border-gray-100 pt-3">
              <span>Total:</span>
              <span>R$ 3.097,50</span>
            </div>
          </div>
        </div>

        {showTerms && (
          <div className="text-xs text-gray-400 mb-4">
            <p>Os serviços descritos estão sujeitos aos termos acordados entre as partes.</p>
          </div>
        )}
      </div>

      <div>
        <div className="text-center text-sm text-gray-400 border-t border-gray-100 pt-8">
          {showSignature && (
            <div className="mb-6">
              <div className="h-10 border-b border-gray-200 mx-auto w-64"></div>
              <p className="text-xs text-gray-500 mt-2">Assinatura Autorizada</p>
            </div>
          )}
          <p>Obrigado pela preferência!</p>
          <p>Dúvidas? Entre em contato: suporte@suaempresa.com</p>
        </div>
      </div>
    </div>
  );
}

