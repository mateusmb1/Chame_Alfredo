import React from 'react';
import { LucideIcon, ArrowRight, Check } from 'lucide-react';

interface ServiceCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    benefits: string[];
    ctaText: string;
    onCtaClick: () => void;
    isEmergency?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
    icon: Icon,
    title,
    description,
    benefits,
    ctaText,
    onCtaClick,
    isEmergency = false,
}) => {
    if (isEmergency) {
        return (
            <div
                onClick={onCtaClick}
                className="group relative p-8 rounded-2xl bg-[#1e293b] text-white shadow-xl overflow-hidden cursor-pointer border border-gray-700 hover:border-[#F97316] transition-all duration-300 transform hover:-translate-y-1"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F97316]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -ml-12 -mb-12 pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-white/5 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-8 h-8 text-[#F97316] animate-pulse" />
                    </div>

                    <h3 className="text-2xl font-black mb-3 text-[#F97316] leading-tight">
                        {title}
                    </h3>

                    <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                        {description}
                    </p>

                    <button className="w-full bg-[#fa8639] hover:bg-[#ff6200] text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-orange-900/20">
                        {ctaText} <ArrowRight className="ml-2 w-5 h-5" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="group flex flex-col h-full p-8 rounded-3xl bg-white border border-slate-100 shadow-md shadow-slate-100 hover:shadow-xl hover:shadow-slate-200/50 hover:border-[#F97316]/40 transition-all duration-300 transform hover:-translate-y-1.5">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#F97316] transition-all duration-300 shadow-inner">
                <Icon className="w-7 h-7 text-[#F97316] group-hover:text-white transition-colors duration-300" />
            </div>

            <h3 className="text-xl font-black text-slate-800 mb-3 group-hover:text-[#F97316] transition-colors leading-tight">
                {title}
            </h3>

            <p className="text-slate-500 text-sm mb-6 leading-relaxed flex-grow">
                {description}
            </p>

            <ul className="space-y-3.5 mb-8 border-t border-slate-50 pt-5">
                {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start text-sm text-slate-600">
                        <div className="mr-3 mt-0.5 bg-emerald-50 rounded-full p-0.5 flex-shrink-0">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <span className="leading-tight font-medium">{benefit}</span>
                    </li>
                ))}
            </ul>

            <button
                onClick={onCtaClick}
                className="mt-auto w-full py-3.5 px-6 rounded-full border border-slate-200 text-slate-700 bg-slate-50 group-hover:bg-[#00A859] group-hover:text-white group-hover:border-transparent font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
            >
                {ctaText} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
        </div>
    );
};

export default ServiceCard;
