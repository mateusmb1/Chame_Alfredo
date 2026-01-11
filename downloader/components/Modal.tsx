import React, { Fragment } from 'react';
import { X, CheckCircle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  type?: 'default' | 'success';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, type = 'default' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
        {type === 'success' && (
           <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
        )}
        
        <div className="p-6">
          {type === 'success' && (
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
          )}
          
          <div className={`text-center ${type === 'success' ? 'mt-2' : ''}`}>
            <h3 className="text-lg font-bold leading-6 text-gray-900">{title}</h3>
            <div className="mt-2">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};