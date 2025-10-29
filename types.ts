
export interface Vehicle {
  id: string;
  plate: string;
  trailerPlate?: string;
}

export enum SevStatus {
  Active = 'ATIVA',
  Expired = 'EXPIRADA',
  Completed = 'CONCLUÍDA',
}

export interface Sev {
  id: string;
  operationDate: string;
  shipName: string;
  workPlanNumber: string;
  vehicleId: string;
  trailerPlate?: string;
  requester: string;
  sevNumber: string;
  expiryDate: string;
  operator: string;
  status: SevStatus;
  observations?: string;
}