import React from 'react';
import { Trophy, Star, Zap, Users, Target } from 'lucide-react'; // ← Añadir Target aquí

const Dashboard = ({ user }) => {
  const stats = [
    { icon: Trophy, label: 'XP Total', value: user?.progress?.xp || 0, color: 'text-orange-500' },
    { icon: Star, label: 'Misiones Completadas', value: user?.progress?.completedMissions?.length || 0, color: 'text-yellow-500' },
    { icon: Zap, label: 'Nivel Actual', value: user?.progress?.level || 1, color: 'text-green-500' },
    { icon: Users, label: 'Amigos', value: '0', color: 'text-blue-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Bienvenida */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          ¡Hola, {user?.name}!
        </h2>
        <p className="text-gray-600 mb-4">
          Continúa tu aventura de aprendizaje en BlockWorld
        </p>
        
        {/* Barra de progreso */}
        <div className="bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-edu-primary to-edu-secondary h-3 rounded-full transition-all duration-500"
            style={{ width: `${((user?.progress?.xp || 0) % 1000) / 10}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 text-center">
          {((user?.progress?.xp || 0) % 1000)} / 1000 XP para el siguiente nivel
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-md p-4 text-center">
              <Icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Misiones recientes */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Tus Progresos Recientes</h3>
        <div className="space-y-3">
          {user?.progress?.completedMissions?.slice(-3).map((mission, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-800">{mission.title}</div>
                <div className="text-sm text-gray-600">+{mission.xpReward} XP</div>
              </div>
              <div className="text-edu-secondary font-bold">+{mission.eduCoinReward} EDU</div>
            </div>
          ))}
          {(!user?.progress?.completedMissions || user.progress.completedMissions.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-2 opacity-50" /> {/* ← Aquí se usa Target */}
              <p>¡Completa tu primera misión para empezar a ganar recompensas!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;