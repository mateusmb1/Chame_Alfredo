import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw]'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-10 animate-in fade-in zoom-in duration-300">
      {/* Premium Backdrop */}
      <div
        className="absolute inset-0 bg-[#090E1A]/80 backdrop-blur-xl transition-all"
        onClick={onClose}
      />

      <div className={`relative w-full ${sizeClasses[size]} bg-white dark:bg-[#101622] rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10 dark:border-gray-800/50 max-h-full flex flex-col overflow-hidden z-10`}>
        {/* Header Design */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800/50 px-8 py-8">
          <div>
            <p className="text-[#F97316] text-[8px] font-black uppercase tracking-[0.4em] mb-1 opacity-60">Operação em curso</p>
            <h3 className="text-2xl font-black text-[#1e293b] dark:text-white italic uppercase tracking-tighter">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-[1.2rem] bg-gray-50 dark:bg-white/5 text-gray-400 hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
          {children}
        </div>

        {/* Footer Area */}
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-800/50 px-8 py-8 bg-gray-50/30 dark:bg-white/5">
            {footer}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.05); border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); }
      `}} />
    </div>
  );
};

export default Modal;
