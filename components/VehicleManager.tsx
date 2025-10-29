
import React, { useState } from 'react';
import type { Vehicle } from '../types';
import { PlusIcon, TrashIcon, TruckIcon } from './icons';

interface VehicleManagerProps {
  vehicles: Vehicle[];
  addVehicle: (plate: string, trailerPlate?: string) => boolean;
  deleteVehicle: (id: string) => void;
  activeVehicleIds: Set<string>;
}

const VehicleManager: React.FC<VehicleManagerProps> = ({ vehicles, addVehicle, deleteVehicle, activeVehicleIds }) => {
  const [plate, setPlate] = useState('');
  const [trailerPlate, setTrailerPlate] = useState('');
  const [error, setError] = useState('');

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate.trim()) {
      setError('A placa principal é obrigatória.');
      return;
    }
    const success = addVehicle(plate.trim().toUpperCase(), trailerPlate.trim().toUpperCase());
    if (success) {
      setPlate('');
      setTrailerPlate('');
      setError('');
    } else {
      setError('Esta placa já existe.');
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-blue-400 flex items-center"><TruckIcon />Gerenciar Frota</h2>
      
      <form onSubmit={handleAddVehicle} className="mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="plate" className="block text-sm font-medium text-gray-300">Veículo/Placa*</label>
                <input
                id="plate"
                type="text"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                placeholder="ABC-1234"
                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-white"
                />
            </div>
            <div>
                <label htmlFor="trailerPlate" className="block text-sm font-medium text-gray-300">Reboque/Placa (Opcional)</label>
                <input
                id="trailerPlate"
                type="text"
                value={trailerPlate}
                onChange={(e) => setTrailerPlate(e.target.value)}
                placeholder="XYZ-5678"
                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-white"
                />
            </div>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button type="submit" className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300">
          <PlusIcon /> Adicionar Veículo
        </button>
      </form>

      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        <h3 className="text-lg font-semibold text-gray-300">Veículos Cadastrados ({vehicles.length})</h3>
        {vehicles.length === 0 ? (
            <p className="text-gray-400">Nenhum veículo cadastrado.</p>
        ) : (
            vehicles.map(v => (
            <div key={v.id} className="flex justify-between items-center bg-gray-700 p-3 rounded-md">
                <div>
                    <p className="font-mono font-bold text-lg">{v.plate}</p>
                    {v.trailerPlate && <p className="text-sm text-gray-400 font-mono">Reboque: {v.trailerPlate}</p>}
                </div>
                <div className="flex items-center gap-4">
                  {activeVehicleIds.has(v.id) ? (
                    <span className="text-xs font-semibold bg-yellow-500 text-gray-900 px-2 py-1 rounded-full">Em Uso</span>
                  ) : (
                    <span className="text-xs font-semibold bg-green-500 text-gray-900 px-2 py-1 rounded-full">Disponível</span>
                  )}
                  <button onClick={() => deleteVehicle(v.id)} className="text-red-400 hover:text-red-300 transition-colors">
                      <TrashIcon />
                  </button>
                </div>
            </div>
            ))
        )}
      </div>
      <p className="text-xs text-gray-500 mt-4">Os dados da frota são salvos localmente no seu navegador.</p>
    </div>
  );
};

export default VehicleManager;
