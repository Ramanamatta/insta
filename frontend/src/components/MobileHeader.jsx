import React from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MobileHeader = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const navigate = useNavigate();

  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <h1 className="font-bold text-xl">Logo</h1>
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/chat')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <MessageCircle size={24} />
        </button>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </div>
  );
};

export default MobileHeader;