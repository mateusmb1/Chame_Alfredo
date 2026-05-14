import React from 'react';
import { Check } from 'lucide-react';

interface Brand {
    name: string;
    logo: string;
    text: string;
    url: string;
}

const BRAND_DATA: Brand[] = [
    {
        name: "Garen",
        logo: "/logos/garen.png",
        text: "Motor Portão nº1 Brasil",
        url: "https://garen.com.br"
    },
    {
        name: "Intelbras",
        logo: "/logos/intelbras.svg",
        text: "Segurança Eletrônica Premium",
        url: "https://intelbras.com.br"
    },
    {
        name: "Hikvision",
        logo: "/logos/hikvision.svg",
        text: "Câmeras IP (Nº1 Mundo)",
        url: "https://hikvision.com"
    },
    {
        name: "PPA",
        logo: "/logos/ppa.png",
        text: "Componentes Especializados",
        url: "https://ppabrasil.com.br"
    }
];

const BrandLogo: React.FC = () => {
    return (
        <div className="w-full">
            <div className="flex items-center justify-center mb-10 gap-2 opacity-80">
                <div className="h-px bg-gray-200 w-12"></div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Parceiros Oficiais</span>
                <div className="h-px bg-gray-200 w-12"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
                {BRAND_DATA.map((brand) => (
                    <a
                        key={brand.name}
                        href={brand.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col items-center justify-center p-4 w-full"
                    >
                        <div className="h-20 w-full flex items-center justify-center mb-4 transition-transform duration-300 transform group-hover:-translate-y-1">
                            <img
                                src={brand.logo}
                                alt={`Logo ${brand.name}`}
                                className="max-h-full max-w-[160px] object-contain filter drop-shadow-sm group-hover:drop-shadow-md transition-all"
                            />
                        </div>
                        <span className="text-xs font-medium text-gray-500 group-hover:text-[#F97316] transition-colors text-center opacity-80 group-hover:opacity-100">
                            {brand.text}
                        </span>
                    </a>
                ))}
            </div>

            <div className="mt-10 text-center border-t border-dashed border-gray-200 pt-6">
                <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Garantia de peças originais. Sem produtos 'similares'. Qualidade = segurança do seu patrimônio.
                </p>
            </div>
        </div>
    );
};

export default BrandLogo;
