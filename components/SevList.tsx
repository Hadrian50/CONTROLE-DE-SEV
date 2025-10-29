
import React from 'react';
import type { Sev, Vehicle } from '../types';
import { SevStatus } from '../types';
import { ShipIcon, CheckCircleIcon, WarningIcon } from './icons';

interface SevListProps {
  sevs: Sev[];
  vehicles: Vehicle[];
  completeSev: (id: string) => void;
}

const SevCard: React.FC<{ sev: Sev; vehicle?: Vehicle; onComplete: () => void }> = ({ sev, vehicle, onComplete }) => {
  const now = new Date();
  const expiryDateObj = new Date(sev.expiryDate);
  const isExpired = now > expiryDateObj;

  const twoDaysFromNow = new Date();
  twoDaysFromNow.setDate(now.getDate() + 2);
  const isExpiringSoon = sev.status === SevStatus.Active && !isExpired && expiryDateObj <= twoDaysFromNow;

  let currentStatus = sev.status;
  if (sev.status === SevStatus.Active && isExpired) {
    currentStatus = SevStatus.Expired;
  }

  const statusStyles: { [key in SevStatus]: string } = {
    [SevStatus.Active]: 'border-green-500 bg-green-500/10',
    [SevStatus.Expired]: 'border-gray-500 bg-gray-500/10 opacity-70',
    [SevStatus.Completed]: 'border-blue-500 bg-blue-500/10',
  };

  const statusBadgeStyles: { [key in SevStatus]: string } = {
    [SevStatus.Active]: 'bg-green-500 text-green-900',
    [SevStatus.Expired]: 'bg-gray-500 text-gray-900',
    [SevStatus.Completed]: 'bg-blue-500 text-blue-900',
  };
  
  const formatDate = (dateString: string) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  };

  let cardStyle = statusStyles[currentStatus];
  let badgeStyle = statusBadgeStyles[currentStatus];
  let badgeText: React.ReactNode = currentStatus;
  
  if (isExpiringSoon) {
    cardStyle = 'border-yellow-500 bg-yellow-500/10 animate-pulse-slow';
    badgeStyle = 'bg-yellow-500 text-yellow-900';
    badgeText = (
      <>
        <WarningIcon />
        <span>EXPIRANDO</span>
      </>
    );
  }

  return (
    <div className={`border-l-4 p-4 rounded-r-lg shadow-md transition-all ${cardStyle}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-gray-200">SEV Nr: {sev.sevNumber}</h3>
          <p className="text-sm text-gray-400"><ShipIcon />{sev.shipName || "Navio não informado"}</p>
        </div>
        <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 ${badgeStyle}`}>{badgeText}</span>
      </div>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm">
        <div>
          <span className="font-semibold text-gray-400 block">Veículo</span>
          <span className="text-gray-200 font-mono">{vehicle?.plate || 'N/A'}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-400 block">Validade</span>
          <span className="text-gray-200">{formatDate(sev.expiryDate)}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-400 block">Operador</span>
          <span className="text-gray-200">{sev.operator || 'N/A'}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-400 block">Solicitante</span>
          <span className="text-gray-200">{sev.requester || 'N/A'}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-400 block">Plano de Trabalho</span>
          <span className="text-gray-200">{sev.workPlanNumber || 'N/A'}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-400 block">Operação</span>
          <span className="text-gray-200">{new Date(sev.operationDate).toLocaleDateString('pt-BR')}</span>
        </div>
      </div>
       {currentStatus === SevStatus.Active && (
        <div className="mt-4 text-right">
            <button
            onClick={onComplete}
            className="flex items-center gap-2 ml-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-1 px-3 rounded-md transition-colors duration-300"
            >
            <CheckCircleIcon /> Concluir Manualmente
            </button>
        </div>
        )}
    </div>
  );
};


const SevList: React.FC<SevListProps> = ({ sevs, vehicles, completeSev }) => {
  const vehicleMap = new Map(vehicles.map(v => [v.id, v]));
  const sortedSevs = [...sevs].sort((a, b) => new Date(b.operationDate).getTime() - new Date(a.operationDate).getTime());

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-300">Histórico de SEVs ({sevs.length})</h2>
      <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
        {sevs.length === 0 ? (
          <p className="text-gray-400 text-center py-4">Nenhuma SEV criada ainda.</p>
        ) : (
          sortedSevs.map(sev => (
            <SevCard 
              key={sev.id} 
              sev={sev} 
              vehicle={vehicleMap.get(sev.vehicleId)} 
              onComplete={() => completeSev(sev.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SevList;