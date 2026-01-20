import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuoteForm from '../components/QuoteForm';
import { useApp } from '../contexts/AppContext';

const QuoteEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { quotes } = useApp();
    const navigate = useNavigate();
    const [quote, setQuote] = useState<any>(null); // Type 'any' initially to avoid strict type mismatch if context is not yet updated

    useEffect(() => {
        if (id && quotes.length > 0) {
            const foundQuote = quotes.find(q => q.id === id);
            if (foundQuote) {
                setQuote(foundQuote);
            } else {
                // navigate('/quotes'); // Redirect if not found?
            }
        }
    }, [id, quotes, navigate]);

    if (!quote) {
        return <div className="p-8">Carregando...</div>;
    }

    return (
        <div className="p-8 mx-auto max-w-5xl">
            {/* PageHeading */}
            <div className="flex flex-wrap justify-between gap-3 mb-8">
                <div className="flex min-w-72 flex-col gap-2">
                    <p className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Editar Orçamento</p>
                    <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">Atualize os detalhes do orçamento abaixo.</p>
                </div>
            </div>
            <QuoteForm initialData={quote} isEditing={true} />
        </div>
    );
};

export default QuoteEdit;
