import { create } from 'zustand';

export interface Client {
  id: number;
  name: string;
  phone: string;
  vehicle: string;
  licensePlate: string;
}

interface ClientStore {
  client: Client | null;
  setClient: (client: Client) => void;
  clearClient: () => void;
}

export const useClientStore = create<ClientStore>((set) => ({
  client: null,
  setClient: (client) => set({ client }),
  clearClient: () => set({ client: null }),
}));