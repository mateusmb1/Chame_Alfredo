import React from 'react';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    type = 'danger'
}) => {
    if (!isOpen) return null;

    const getButtonStyles = () => {
        switch (type) {
            case 'danger':
                return 'bg-red-600 hover:bg-red-700 text-white';
            case 'warning':
                return 'bg-yellow-600 hover:bg-yellow-700 text-white';
            case 'info':
                return 'bg-blue-600 hover:bg-blue-700 text-white';
            default:
                return 'bg-red-600 hover:bg-red-700 text-white';
        }
    };

    const getIconColor = () => {
        switch (type) {
            case 'danger':
                return 'text-red-600';
            case 'warning':
                return 'text-yellow-600';
            case 'info':
                return 'text-blue-600';
            default:
                return 'text-red-600';
        }
    };

    return (
        <div class="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 backdrop-blur-sm p-4">
            <div class="relative w-full max-w-md bg-white dark:bg-[#18202F] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800">
                {/* Icon */}
                <div class="flex items-center justify-center pt-6">
                    <div class={`flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20`}>
                        <span class={`material-symbols-outlined text-4xl ${getIconColor()}`}>
                            {type === 'danger' ? 'delete' : type === 'warning' ? 'warning' : 'info'}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div class="px-6 py-4 text-center">
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {title}
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        {message}
                    </p>
                </div>

                {/* Actions */}
                <div class="flex items-center justify-center gap-3 px-6 pb-6">
                    <button
                        onClick={onClose}
                        class="flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        class={`flex h-10 items-center justify-center gap-2 rounded-lg px-6 text-sm font-medium transition-colors ${getButtonStyles()}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
