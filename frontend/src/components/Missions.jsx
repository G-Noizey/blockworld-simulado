import React, { useState, useEffect } from 'react';
import { missionDB, EduCoinContract } from '../db/pouchdb';
import { Target, Star, Clock, CheckCircle } from 'lucide-react'; // ← Target ya está aquí

const Missions = ({ user, updateUser }) => {
  const [missions, setMissions] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = async () => {
    try {
      const missionData = await missionDB.get('mission_list');
      setMissions(missionData.missions);
    } catch (error) {
      console.error('Error cargando misiones:', error);
    }
  };

  const completeMission = async (mission) => {
    try {
      // Actualizar progreso del usuario
      const updatedProgress = {
        ...user.progress,
        xp: (user.progress.xp || 0) + mission.xpReward,
        completedMissions: [...(user.progress.completedMissions || []), {
          id: mission.id,
          title: mission.title,
          xpReward: mission.xpReward,
          eduCoinReward: mission.eduCoinReward,
          completedAt: new Date().toISOString()
        }],
        level: Math.floor(((user.progress.xp || 0) + mission.xpReward) / 1000) + 1
      };

      await updateUser({ progress: updatedProgress });

      // Recompensa en EduCoins (simulando contrato Soroban)
      await EduCoinContract.mint(mission.eduCoinReward, `Completaste: ${mission.title}`);

      // Actualizar estado local de misión
      const updatedMissions = missions.map(m => 
        m.id === mission.id ? { ...m, completed: true } : m
      );
      setMissions(updatedMissions);

      alert(`¡Misión completada! Ganaste ${mission.xpReward} XP y ${mission.eduCoinReward} EDU Coins`);
      
    } catch (error) {
      console.error('Error completando misión:', error);
      alert('Error al completar la misión');
    }
  };

  const startQuiz = (mission) => {
    if (mission.type === 'quiz') {
      setCurrentQuiz(mission);
      setSelectedAnswer(null);
    } else {
      completeMission(mission);
    }
  };

  const submitQuiz = () => {
    if (selectedAnswer === currentQuiz.questions[0].correct) {
      completeMission(currentQuiz);
      setCurrentQuiz(null);
    } else {
      alert('Respuesta incorrecta. ¡Sigue aprendiendo!');
      setSelectedAnswer(null);
    }
  };

  if (currentQuiz) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{currentQuiz.title}</h2>
        <div className="space-y-4">
          <p className="text-lg text-gray-700">{currentQuiz.questions[0].question}</p>
          <div className="space-y-2">
            {currentQuiz.questions[0].options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedAnswer(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedAnswer === index
                    ? 'border-edu-primary bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            onClick={submitQuiz}
            disabled={selectedAnswer === null}
            className="w-full bg-edu-primary text-white py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar Respuesta
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Misiones de Aprendizaje</h2>
        <p className="text-gray-600">Completa misiones para ganar XP y EduCoins</p>
      </div>

      <div className="space-y-4">
        {missions.map((mission) => (
          <div key={mission.id} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{mission.title}</h3>
                <p className="text-gray-600 mb-2">{mission.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Target className="w-4 h-4" />
                    <span>{mission.module}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{mission.xpReward} XP</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>15 min</span>
                  </div>
                </div>
              </div>
              
              {mission.completed ? (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-medium">Completada</span>
                </div>
              ) : (
                <button
                  onClick={() => startQuiz(mission)}
                  className="bg-edu-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors"
                >
                  {mission.type === 'quiz' ? 'Comenzar Quiz' : 'Iniciar Misión'}
                </button>
              )}
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  +{mission.eduCoinReward} EDU
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  +{mission.xpReward} XP
                </div>
              </div>
              
              {mission.completed && (
                <div className="text-sm text-gray-500">
                  Completada
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Missions;