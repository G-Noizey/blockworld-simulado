import PouchDB from 'pouchdb-browser';
import PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind);

// Base de datos local para el usuario
export const userDB = new PouchDB('blockworld_user');
export const gameDB = new PouchDB('blockworld_games');
export const missionDB = new PouchDB('blockworld_missions');

// Inicializar datos de ejemplo
export const initSampleData = async () => {
  try {
    // Verificar si ya existen datos
    const existingUser = await userDB.get('current_user').catch(() => null);
    
    if (!existingUser) {
      // Datos de usuario por defecto
      const user = {
        _id: 'current_user',
        email: 'usuario@ejemplo.com',
        name: 'Explorador BlockWorld',
        role: 'student',
        age: 12,
        parentalConsent: true,
        avatar: {
          type: '2d',
          color: '#3B82F6',
          accessories: ['hat_basic'],
          level: 1
        },
        wallet: {
          balance: 50,
          transactions: []
        },
        progress: {
          completedMissions: [],
          xp: 0,
          level: 1
        },
        createdAt: new Date().toISOString()
      };

      await userDB.put(user);
    }

    // Inicializar misiones de ejemplo
    const missionsExist = await missionDB.get('mission_list').catch(() => null);
    if (!missionsExist) {
      const missions = {
        _id: 'mission_list',
        missions: [
          {
            id: 'mission_1',
            title: 'Introducción a Blockchain',
            module: 'Blockchain Básico',
            description: 'Aprende los conceptos fundamentales de blockchain',
            xpReward: 100,
            eduCoinReward: 10,
            type: 'quiz',
            questions: [
              {
                question: "¿Qué es blockchain?",
                options: [
                  "Una cadena de bloques descentralizada",
                  "Un tipo de videojuego",
                  "Una red social"
                ],
                correct: 0
              }
            ],
            completed: false
          },
          {
            id: 'mission_2',
            title: 'Primeros Pasos en Finanzas',
            module: 'Educación Financiera',
            description: 'Aprende a manejar tu dinero virtual',
            xpReward: 150,
            eduCoinReward: 15,
            type: 'interactive',
            completed: false
          }
        ]
      };
      await missionDB.put(missions);
    }

  } catch (error) {
    console.error('Error inicializando datos:', error);
  }
};

// Simular contrato Soroban para EduCoins
export const EduCoinContract = {
  mint: async (amount, reason) => {
    try {
      const user = await userDB.get('current_user');
      user.wallet.balance += amount;
      user.wallet.transactions.push({
        id: Date.now().toString(),
        type: 'reward',
        amount: amount,
        reason: reason,
        timestamp: new Date().toISOString()
      });
      
      await userDB.put(user);
      return { success: true, newBalance: user.wallet.balance };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  transfer: async (toUser, amount) => {
    try {
      const user = await userDB.get('current_user');
      if (user.wallet.balance < amount) {
        return { success: false, error: 'Saldo insuficiente' };
      }

      user.wallet.balance -= amount;
      user.wallet.transactions.push({
        id: Date.now().toString(),
        type: 'transfer',
        amount: -amount,
        to: toUser,
        timestamp: new Date().toISOString()
      });

      await userDB.put(user);
      return { success: true, newBalance: user.wallet.balance };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};