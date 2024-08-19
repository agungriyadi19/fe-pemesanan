import React from 'react';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full relative">
        <button
          className="absolute top-2 right-5 text-gray-700 hover:text-gray-900"
          onClick={onClose}
          style={{ fontSize: '28px' }}
        >
          &times;
        </button>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
