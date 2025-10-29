import React from 'react';
import { Coins, ArrowUpRight, ArrowDownLeft, Gift, ShoppingCart } from 'lucide-react';

const Wallet = ({ user }) => {
  const transactions = user?.wallet?.transactions || [];

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'reward':
        return <Gift className="w-5 h-5 text-green-500" />;
      case 'purchase':
        return <ShoppingCart className="w-5 h-5 text-blue-500" />;
      case 'transfer':
        return <ArrowUpRight className="w-5 h-5 text-orange-500" />;
      default:
        return <Coins className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTransactionColor = (amount) => {
    return amount > 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Resumen de Wallet */}
      <div className="bg-gradient-to-r from-edu-primary to-edu-secondary rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Tu Billetera EDU</h2>
          <Coins className="w-8 h-8" />
        </div>
        
        <div className="text-center mb-6">
          <div className="text-4xl font-bold mb-2">{user?.wallet?.balance || 0}</div>
          <div className="text-blue-100">EduCoins Disponibles</div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{transactions.filter(t => t.amount > 0).length}</div>
            <div className="text-blue-100 text-sm">Ingresos</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{transactions.filter(t => t.amount < 0).length}</div>
            <div className="text-blue-100 text-sm">Gastos</div>
          </div>
        </div>
      </div>

      {/* Transacciones */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Historial de Transacciones</h3>
        
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Coins className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Aún no tienes transacciones</p>
            <p className="text-sm">Completa misiones para ganar tus primeros EduCoins</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.slice().reverse().map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <div className="font-medium text-gray-800">{transaction.reason}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className={`font-bold ${getTransactionColor(transaction.amount)}`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount} EDU
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Información Blockchain Simulada */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
        <h4 className="font-bold text-yellow-800 mb-2">⚠️ Modo Simulación</h4>
        <p className="text-yellow-700 text-sm">
          Esta billetera funciona en modo local con PouchDB. En la versión final, 
          los EduCoins estarán respaldados por contratos inteligentes en Stellar Testnet.
        </p>
      </div>
    </div>
  );
};

export default Wallet;