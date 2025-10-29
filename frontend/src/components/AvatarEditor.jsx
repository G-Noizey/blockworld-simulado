import React, { useState } from 'react';
import { Palette, Shirt, Glasses, Wand2, Save } from 'lucide-react';

const AvatarEditor = ({ user, updateUser }) => {
  const [avatar, setAvatar] = useState(user?.avatar || {
    type: '2d',
    color: '#3B82F6',
    accessories: ['hat_basic'],
    level: 1
  });

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', 
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];

  const accessories = [
    { id: 'hat_basic', name: 'Gorra Básica', type: 'hat', price: 0, unlocked: true },
    { id: 'glasses_cool', name: 'Gafas Geniales', type: 'glasses', price: 15, unlocked: user?.wallet?.balance >= 15 },
    { id: 'shirt_edu', name: 'Camiseta EDU', type: 'shirt', price: 25, unlocked: user?.wallet?.balance >= 25 },
    { id: 'badge_star', name: 'Insignia Estrella', type: 'badge', price: 30, unlocked: user?.wallet?.balance >= 30 },
    { id: 'hat_wizard', name: 'Sombrero Mágico', type: 'hat', price: 50, unlocked: user?.wallet?.balance >= 50 },
  ];

  const handleColorChange = (color) => {
    setAvatar(prev => ({ ...prev, color }));
  };

  const handleAccessoryToggle = (accessory) => {
    setAvatar(prev => {
      const accessories = prev.accessories.includes(accessory.id)
        ? prev.accessories.filter(a => a !== accessory.id)
        : [...prev.accessories, accessory.id];
      
      return { ...prev, accessories };
    });
  };

  const saveAvatar = async () => {
    await updateUser({ avatar });
    alert('¡Avatar guardado exitosamente!');
  };

  const getAccessoryIcon = (type) => {
    switch (type) {
      case 'hat': return <Wand2 className="w-4 h-4" />;
      case 'glasses': return <Glasses className="w-4 h-4" />;
      case 'shirt': return <Shirt className="w-4 h-4" />;
      default: return <Wand2 className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Editor de Avatar</h2>
        <p className="text-gray-600">Personaliza tu personaje de BlockWorld</p>
      </div>

      {/* Vista previa del avatar */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Vista Previa</h3>
        <div className="flex justify-center">
          <div className="relative w-32 h-32">
            {/* Cuerpo del avatar */}
            <div 
              className="w-20 h-20 rounded-full mx-auto"
              style={{ backgroundColor: avatar.color }}
            ></div>
            
            {/* Accesorios */}
            {avatar.accessories.includes('hat_basic') && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-4 bg-gray-800 rounded-t-lg"></div>
            )}
            {avatar.accessories.includes('glasses_cool') && (
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-black rounded-full"></div>
            )}
            {avatar.accessories.includes('badge_star') && (
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-6 h-6 text-yellow-500">
                ⭐
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">Nivel {avatar.level}</p>
        </div>
      </div>

      {/* Selector de colores */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Palette className="w-5 h-5 text-edu-primary" />
          <h3 className="text-lg font-bold text-gray-800">Color del Avatar</h3>
        </div>
        
        <div className="grid grid-cols-5 gap-3">
          {colors.map((color, index) => (
            <button
              key={index}
              onClick={() => handleColorChange(color)}
              className={`w-10 h-10 rounded-full border-2 transition-transform ${
                avatar.color === color ? 'border-gray-800 scale-110' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Accesorios */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Wand2 className="w-5 h-5 text-edu-primary" />
          <h3 className="text-lg font-bold text-gray-800">Accesorios</h3>
        </div>
        
        <div className="space-y-3">
          {accessories.map((accessory) => (
            <div
              key={accessory.id}
              className={`flex items-center justify-between p-3 border-2 rounded-lg transition-all ${
                avatar.accessories.includes(accessory.id)
                  ? 'border-edu-primary bg-blue-50'
                  : 'border-gray-200'
              } ${
                !accessory.unlocked ? 'opacity-50' : 'cursor-pointer hover:border-gray-300'
              }`}
              onClick={() => accessory.unlocked && handleAccessoryToggle(accessory)}
            >
              <div className="flex items-center space-x-3">
                {getAccessoryIcon(accessory.type)}
                <div>
                  <div className="font-medium text-gray-800">{accessory.name}</div>
                  <div className="text-sm text-gray-600">
                    {accessory.price > 0 ? `${accessory.price} EDU` : 'Gratis'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {!accessory.unlocked && (
                  <span className="text-xs text-red-500 font-medium">Fondos insuficientes</span>
                )}
                <div className={`w-4 h-4 rounded border-2 ${
                  avatar.accessories.includes(accessory.id)
                    ? 'bg-edu-primary border-edu-primary'
                    : 'bg-white border-gray-300'
                }`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botón de guardar */}
      <button
        onClick={saveAvatar}
        className="w-full bg-edu-primary text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 hover:bg-blue-600 transition-colors"
      >
        <Save className="w-5 h-5" />
        <span>Guardar Avatar</span>
      </button>

      {/* Información de saldo */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <p className="text-blue-800 text-sm text-center">
          💰 Saldo actual: <strong>{user?.wallet?.balance || 0} EDU</strong>
        </p>
        <p className="text-blue-700 text-xs text-center mt-1">
          Completa más misiones para desbloquear accesorios exclusivos
        </p>
      </div>
    </div>
  );
};

export default AvatarEditor;