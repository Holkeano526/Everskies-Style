
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg">
            <i className="fas fa-magic"></i>
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Pixel<span className="text-indigo-600 font-extrabold">Everskies</span>
          </h1>
        </div>
        <div className="hidden md:flex items-center space-x-4 text-sm font-medium text-gray-500">
          <span>Style Transfer</span>
          <span className="text-gray-300">•</span>
          <span>Pixel Art</span>
          <span className="text-gray-300">•</span>
          <span>Character Design</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
