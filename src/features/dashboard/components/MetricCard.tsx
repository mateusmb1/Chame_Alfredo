import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
    icon: LucideIcon;
    number: string;
    text: string;
    subtext: string;
    color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon: Icon, number, text, subtext, color = "text-[#F97316]" }) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300 group">
            <div className={`p-4 rounded-full bg-gray-50 mb-4 group-hover:bg-opacity-80 transition-colors`}>
                <Icon className={`w-8 h-8 ${color}`} />
            </div>
            <h3 className="text-3xl font-black text-slate-800 mb-1">{number}</h3>
            <p className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-1">{text}</p>
            <p className="text-xs text-gray-400">{subtext}</p>
        </div>
    );
};

export default MetricCard;
