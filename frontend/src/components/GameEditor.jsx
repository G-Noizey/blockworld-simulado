import React, { useState } from 'react';
import { Plus, Play, Save, Trash2, Layout, Puzzle, Star } from 'lucide-react';
import { gameDB } from '../db/pouchdb';

const GameEditor = ({ user }) => {
  const [games, setGames] = useState([]);
  const [currentGame, setCurrentGame] = useState(null);
  const [gameTitle, setGameTitle] = useState('');
  const [gameDescription, setGameDescription] = useState('');

  const gameTemplates = [
    {
      id: 'quiz_template',
      name: 'Quiz Educativo',
      description: 'Crea preguntas y respuestas para evaluar conocimientos',
      icon: Puzzle,
      color: 'bg-blue-500'
    },
    {
      id: 'memory_template',
      name: 'Juego de Memoria',
      description: 'Empareja conceptos relacionados',
      icon: Layout,
      color: 'bg-green-500'
    },
    {
      id: 'adventure_template',
      name: 'Aventura Interactiva',
      description: 'Historia con decisiones y consecuencias',
      icon: Star,
      color: 'bg-purple-500'
    }
  ];

  const loadGames = async () => {
    try {
      const gamesData = await gameDB.allDocs({ include_docs: true });
      const userGames = gamesData.rows
        .map(row => row.doc)
        .filter(game => game.authorId === user?.email);
      setGames(userGames);
    } catch (error) {
      console.error('Error cargando juegos:', error);
    }
  };

  React.useEffect(() => {
    loadGames();
  }, [user]);

  const createNewGame = (template) => {
    const newGame = {
      _id: `game_${Date.now()}`,
      title: `Mi ${template.name}`,
      description: '',
      template: template.id,
      authorId: user?.email,
      authorName: user?.name,
      status: 'draft',
      createdAt: new Date().toISOString(),
      content: {
        questions: [],
        cards: [],
        story: []
      },
      metadata: {
        estimatedTime: '10 min',
        difficulty: 'beginner',
        subject: 'General'
      }
    };
    
    setCurrentGame(newGame);
    setGameTitle(newGame.title);
    setGameDescription(newGame.description);
  };

  const saveGame = async () => {
    if (!currentGame) return;

    try {
      const gameToSave = {
        ...currentGame,
        title: gameTitle,
        description: gameDescription,
        status: gameDescription && gameTitle ? 'pending' : 'draft'
      };

      await gameDB.put(gameToSave);
      await loadGames();
      setCurrentGame(null);
      setGameTitle('');
      setGameDescription('');
      
      alert(gameToSave.status === 'pending' 
        ? '¡Juego enviado para revisión! 🎮' 
        : 'Borrador guardado correctamente');
    } catch (error) {
      console.error('Error guardando juego:', error);
      alert('Error al guardar el juego');
    }
  };

  const deleteGame = async (gameId) => {
    if (confirm('¿Estás seguro de que quieres eliminar este juego?')) {
      try {
        const game = await gameDB.get(gameId);
        await gameDB.remove(game);
        await loadGames();
      } catch (error) {
        console.error('Error eliminando juego:', error);
      }
    }
  };

  const renderGameEditor = () => {
    if (!currentGame) return null;

    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Editando: {currentGame.title}</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título del Juego
            </label>
            <input
              type="text"
              value={gameTitle}
              onChange={(e) => setGameTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-edu-primary focus:border-transparent"
              placeholder="Ej: Quiz de Blockchain Básico"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={gameDescription}
              onChange={(e) => setGameDescription(e.target.value)}
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-edu-primary focus:border-transparent"
              placeholder="Describe tu juego educativo..."
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              💡 <strong>Próximamente:</strong> En la versión final podrás agregar preguntas, 
              contenido interactivo y personalizar completamente tu juego educativo.
            </p>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={saveGame}
            className="flex-1 bg-edu-primary text-white py-3 rounded-lg font-bold flex items-center justify-center space-x-2 hover:bg-blue-600 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Juego</span>
          </button>
          
          <button
            onClick={() => setCurrentGame(null)}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  };

  const renderGameList = () => (
    <div className="space-y-6">
      {/* Plantillas */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Crear Nuevo Juego</h3>
        <p className="text-gray-600 mb-4">Elige una plantilla para empezar</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gameTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <button
                key={template.id}
                onClick={() => createNewGame(template)}
                className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-edu-primary hover:bg-blue-50 transition-all group"
              >
                <div className={`w-12 h-12 ${template.color} rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">{template.name}</h4>
                <p className="text-sm text-gray-600">{template.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Juegos existentes */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Mis Juegos</h3>
        
        {games.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Layout className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Aún no has creado ningún juego</p>
            <p className="text-sm">¡Usa una plantilla para crear tu primer juego educativo!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {games.map((game) => (
              <div key={game._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">{game.title}</h4>
                  <p className="text-sm text-gray-600">{game.description || 'Sin descripción'}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      game.status === 'published' 
                        ? 'bg-green-100 text-green-800'
                        : game.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {game.status === 'published' ? 'Publicado' : 
                       game.status === 'pending' ? 'En revisión' : 'Borrador'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(game.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => deleteGame(game._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar juego"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Editor de Juegos</h2>
        <p className="text-gray-600">Crea tus propios juegos educativos para BlockWorld</p>
      </div>

      {currentGame ? renderGameEditor() : renderGameList()}

      {/* Información Blockchain Simulada */}
      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
        <h4 className="font-bold text-purple-800 mb-2">🎮 Registro de Autoría (Simulado)</h4>
        <p className="text-purple-700 text-sm">
          En la versión final con Soroban, cada juego publicado generará un hash único 
          registrado en blockchain para proteger tu propiedad intelectual.
        </p>
      </div>
    </div>
  );
};

export default GameEditor;