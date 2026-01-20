import React from 'react';
import QuoteForm from '../components/QuoteForm';

const QuoteCreate: React.FC = () => {
    return (
        <div className="p-8 mx-auto max-w-5xl">
            {/* PageHeading */}
            <div className="flex flex-wrap justify-between gap-3 mb-8">
                <div className="flex min-w-72 flex-col gap-2">
                    <p className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Criar Orçamento</p>
                    <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">Preencha os detalhes abaixo para gerar um novo orçamento.</p>
                </div>
            </div>
            <QuoteForm />
        </div>
    );
};

export default QuoteCreate;
