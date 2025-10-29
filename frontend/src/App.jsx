import React, { useState, useEffect } from 'react';
import { userDB, initSampleData } from './db/pouchdb';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Missions from './components/Missions';
import AvatarEditor from './components/AvatarEditor';
import Wallet from './components/Wallet';
import GameEditor from './components/GameEditor';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      await initSampleData();
      const userData = await userDB.get('current_user');
      setUser(userData);
      setLoading(false);
    };

    initializeApp();
  }, []);

  const updateUser = async (updates) => {
    try {
      const userDoc = await userDB.get('current_user');
      const updatedUser = { ...userDoc, ...updates };
      await userDB.put(updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error('Error actualizando usuario:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-edu-primary mx-auto"></div>
          <p className="mt-4 text-edu-primary font-edu">Cargando BlockWorld...</p>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'missions':
        return <Missions user={user} updateUser={updateUser} />;
      case 'avatar':
        return <AvatarEditor user={user} updateUser={updateUser} />;
      case 'wallet':
        return <Wallet user={user} updateUser={updateUser} />;
      case 'editor':
        return <GameEditor user={user} />;
      default:
        return <Dashboard user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 font-edu">
      <Header currentView={currentView} setCurrentView={setCurrentView} user={user} />
      <main className="container mx-auto px-4 py-6">
        {renderView()}
      </main>
    </div>
  );
}

export default App;