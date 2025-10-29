
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { Vehicle, Sev } from './types';
import { SevStatus } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import VehicleManager from './components/VehicleManager';
import SevForm from './components/SevForm';
import SevList from './components/SevList';

const App: React.FC = () => {
  const [vehicles, setVehicles] = useLocalStorage<Vehicle[]>('sev-vehicles', []);
  const [sevs, setSevs] = useLocalStorage<Sev[]>('sev-requests', []);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message: string) => {
    setNotification(message);
  };

  const addVehicle = useCallback((plate: string, trailerPlate?: string): boolean => {
    if (vehicles.some(v => v.plate === plate)) {
      return false;
    }
    const newVehicle: Vehicle = {
      id: crypto.randomUUID(),
      plate,
      trailerPlate,
    };
    setVehicles(prev => [...prev, newVehicle]);
    showNotification(`Veículo ${plate} adicionado com sucesso!`);
    return true;
  }, [vehicles, setVehicles]);

  const deleteVehicle = useCallback((id: string) => {
    if (sevs.some(s => s.vehicleId === id && s.status === SevStatus.Active && new Date(s.expiryDate) > new Date())) {
        showNotification("Não é possível excluir um veículo com SEV ativa.");
        return;
    }
    setVehicles(prev => prev.filter(v => v.id !== id));
    showNotification("Veículo removido.");
  }, [sevs, setVehicles]);

  const addSev = useCallback((sevData: Omit<Sev, 'id' | 'status'>) => {
    const newSev: Sev = {
      ...sevData,
      id: crypto.randomUUID(),
      status: SevStatus.Active,
    };
    setSevs(prev => [...prev, newSev]);
    showNotification(`SEV ${newSev.sevNumber} criada com sucesso!`);
  }, [setSevs]);

  const completeSev = useCallback((id: string) => {
    setSevs(prev => prev.map(sev => sev.id === id ? { ...sev, status: SevStatus.Completed } : sev));
    showNotification("SEV marcada como concluída.");
  }, [setSevs]);

  const activeVehicleIds = useMemo(() => {
    const now = new Date();
    return new Set(
      sevs
        .filter(sev => sev.status === SevStatus.Active && new Date(sev.expiryDate) > now)
        .map(sev => sev.vehicleId)
    );
  }, [sevs]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
            CONTROLE DE VEÍCULOS E SEV
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Criado por ADRIANO DEMETRIO
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <VehicleManager
              vehicles={vehicles}
              addVehicle={addVehicle}
              deleteVehicle={deleteVehicle}
              activeVehicleIds={activeVehicleIds}
            />
            <SevForm 
              vehicles={vehicles} 
              activeVehicleIds={activeVehicleIds}
              addSev={addSev}
              onSuccess={() => showNotification('SEV adicionada com sucesso!')}
            />
          </div>
          <div>
            <SevList sevs={sevs} vehicles={vehicles} completeSev={completeSev} />
          </div>
        </main>
      </div>

      {notification && (
        <div className="fixed bottom-5 right-5 bg-gray-700 text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-out">
          {notification}
        </div>
      )}
      <style>{`
        @keyframes fade-in-out {
          0% { opacity: 0; transform: translateY(10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(10px); }
        }
        .animate-fade-in-out {
          animation: fade-in-out 3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
