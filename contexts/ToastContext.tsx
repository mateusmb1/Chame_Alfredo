import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    showToast: (type: ToastType, message: string, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (type: ToastType, message: string, duration: number = 3000) => {
        const id = `toast-${Date.now()}`;
        const newToast: Toast = { id, type, message, duration };

        setToasts(prev => [...prev, newToast]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

// Toast Container Component
const ToastContainer: React.FC<{ toasts: Toast[]; removeToast: (id: string) => void }> = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
};

// Toast Item Component
const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
    const getToastStyles = () => {
        switch (toast.type) {
            case 'success':
                return 'bg-green-500 text-white';
            case 'error':
                return 'bg-red-500 text-white';
            case 'warning':
                return 'bg-yellow-500 text-white';
            case 'info':
                return 'bg-blue-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    const getIcon = () => {
        switch (toast.type) {
            case 'success':
                return 'check_circle';
            case 'error':
                return 'error';
            case 'warning':
                return 'warning';
            case 'info':
                return 'info';
            default:
                return 'notifications';
        }
    };

    return (
        <div
            className={`flex items-center gap-3 min-w-[300px] max-w-md rounded-lg px-4 py-3 shadow-lg pointer-events-auto animate-slide-in ${getToastStyles()}`}
            style={{ animation: 'slideIn 0.3s ease-out' }}
        >
            <span className="material-symbols-outlined text-2xl">{getIcon()}</span>
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
                onClick={onClose}
                className="flex items-center justify-center hover:opacity-80 transition-opacity"
            >
                <span className="material-symbols-outlined text-xl">close</span>
            </button>
        </div>
    );
};
