
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', ...props }) => {
  const baseClasses = "px-6 py-2 font-bold rounded-md text-lg shadow-lg transform transition-transform duration-150 focus:outline-none focus:ring-4";
  const variantClasses = {
    primary: "bg-cyan-500 hover:bg-cyan-600 text-white focus:ring-cyan-400 active:scale-95 shadow-cyan-500/50",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500 active:scale-95 shadow-gray-600/50",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 active:scale-95 shadow-red-600/50",
  };
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`bg-gray-800/50 border border-gray-700 rounded-lg shadow-xl p-6 backdrop-blur-sm ${className}`}>
      {children}
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className, ...props }) => {
  return (
    <div>
      {label && <label className="block mb-2 text-sm font-bold text-gray-400">{label}</label>}
      <input
        className={`w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all ${className}`}
        {...props}
      />
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-md animate-fade-in">
      <div className="bg-gray-900 border-2 border-cyan-500/50 rounded-xl shadow-2xl w-full max-w-md m-4 transform transition-transform duration-300 scale-95 animate-slide-up">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold font-orbitron text-cyan-400">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
