import React from 'react';
import { Coins, Home, Target, User, Wallet, Edit3 } from 'lucide-react';

const Header = ({ currentView, setCurrentView, user }) => {
  const navItems = [
    { id: 'dashboard', label: 'Inicio', icon: Home },
    { id: 'missions', label: 'Misiones', icon: Target },
    { id: 'avatar', label: 'Avatar', icon: User },
    { id: 'wallet', label: 'Billetera', icon: Wallet },
    { id: 'editor', label: 'Editor', icon: Edit3 },
  ];

  return (
    <header className="bg-white shadow-lg rounded-b-2xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        {/* Barra superior */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-edu-primary to-edu-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">BW</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">BlockWorld</h1>
              <p className="text-sm text-gray-600">Aprende jugando</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-2 rounded-full">
              <Coins className="w-5 h-5 text-yellow-600" />
              <span className="font-bold text-yellow-700">{user?.wallet?.balance || 0} EDU</span>
            </div>
            <div className="text-sm text-gray-600">
              Nvl. {user?.progress?.level || 1}
            </div>
          </div>
        </div>

        {/* Navegación móvil-first */}
        <nav className="flex overflow-x-auto pb-2 space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  isActive 
                    ? 'bg-edu-primary text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;