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
        <div className="group flex flex-col h-full p-8 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:border-t-4 hover:border-t-[#F97316]">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#F97316] transition-colors duration-300">
                <Icon className="w-8 h-8 text-[#F97316] group-hover:text-white transition-colors duration-300" />
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#F97316] transition-colors">
                {title}
            </h3>

            <p className="text-gray-600 text-sm mb-6 leading-relaxed flex-grow">
                {description}
            </p>

            <ul className="space-y-3 mb-8">
                {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                        <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                    </li>
                ))}
            </ul>

            <button
                onClick={onCtaClick}
                className="mt-auto w-full py-3 px-4 rounded-xl border-2 border-slate-100 font-bold text-slate-600 hover:border-[#F97316] hover:text-[#F97316] hover:bg-orange-50 transition-all flex items-center justify-center group-hover:shadow-md"
            >
                {ctaText} <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
        </div>
    );
};

export default ServiceCard;
