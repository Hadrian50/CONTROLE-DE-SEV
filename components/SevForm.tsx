
import React, { useState } from 'react';
import type { Vehicle, Sev } from '../types';
import { SevStatus } from '../types';
import { PlusIcon } from './icons';

interface SevFormProps {
  vehicles: Vehicle[];
  activeVehicleIds: Set<string>;
  addSev: (sev: Omit<Sev, 'id' | 'status'>) => void;
  onSuccess: () => void;
}

const SevForm: React.FC<SevFormProps> = ({ vehicles, activeVehicleIds, addSev, onSuccess }) => {
  const [formState, setFormState] = useState({
    operationDate: new Date().toISOString().split('T')[0],
    shipName: '',
    workPlanNumber: '',
    vehicleId: '',
    useTrailer: false,
    requester: '',
    sevNumber: '',
    expiryDate: '',
    operator: '',
  });

  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    setFormState(prev => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { vehicleId, expiryDate, sevNumber } = formState;

    if (!vehicleId || !expiryDate || !sevNumber) {
      setError('Preencha todos os campos obrigatórios (*).');
      return;
    }
    
    setError('');
    addSev({
        ...formState,
    });
    
    // Reset form
    setFormState({
        operationDate: new Date().toISOString().split('T')[0],
        shipName: '',
        workPlanNumber: '',
        vehicleId: '',
        useTrailer: false,
        requester: '',
        sevNumber: '',
        expiryDate: '',
        operator: '',
    });
    onSuccess();
  };
  
  const availableVehicles = vehicles.filter(v => !activeVehicleIds.has(v.id));

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-green-400">Nova Solicitação de Entrada (SEV)</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="operationDate" className="block text-sm font-medium text-gray-300">Data e Operação</label>
              <input type="date" name="operationDate" value={formState.operationDate} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-white" />
            </div>
            <div>
              <label htmlFor="shipName" className="block text-sm font-medium text-gray-300">Nome do Navio</label>
              <input type="text" name="shipName" value={formState.shipName} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-white" />
            </div>
            <div>
              <label htmlFor="workPlanNumber" className="block text-sm font-medium text-gray-300">Nr. do Plano de Trabalho</label>
              <input type="text" name="workPlanNumber" value={formState.workPlanNumber} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-white" />
            </div>
            <div>
              <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-300">Veículo/Placa*</label>
              <select name="vehicleId" value={formState.vehicleId} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-white disabled:opacity-50">
                <option value="">Selecione um veículo</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id} disabled={activeVehicleIds.has(v.id)}>
                    {v.plate} {activeVehicleIds.has(v.id) ? '(SEV Ativa)' : ''}
                  </option>
                ))}
              </select>
            </div>
             <div>
              <label htmlFor="sevNumber" className="block text-sm font-medium text-gray-300">SEV Nr.*</label>
              <input type="text" name="sevNumber" value={formState.sevNumber} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-white" />
            </div>
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-300">Validade da SEV*</label>
              <input type="datetime-local" name="expiryDate" value={formState.expiryDate} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-white" />
            </div>
            <div>
              <label htmlFor="requester" className="block text-sm font-medium text-gray-300">Solicitante</label>
              <input type="text" name="requester" value={formState.requester} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-white" />
            </div>
            <div>
              <label htmlFor="operator" className="block text-sm font-medium text-gray-300">Operador</label>
              <input type="text" name="operator" value={formState.operator} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-white" />
            </div>
            <div className="flex items-center pt-6">
                <input id="useTrailer" name="useTrailer" type="checkbox" checked={formState.useTrailer} onChange={handleInputChange} className="h-4 w-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500" />
                <label htmlFor="useTrailer" className="ml-2 block text-sm text-gray-300">Uso de Reboque</label>
            </div>
        </div>

        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

        <button type="submit" className="w-full flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition-colors duration-300 disabled:bg-gray-500" disabled={availableVehicles.length === 0 && vehicles.length > 0}>
            <PlusIcon /> {availableVehicles.length === 0 && vehicles.length > 0 ? "Nenhum Veículo Disponível" : "Criar SEV"}
        </button>
      </form>
    </div>
  );
};

export default SevForm;
