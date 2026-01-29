import { create } from "zustand";

import type { Service } from "../types";

type BookingState = {
  selectedServices: Service[];
  addService: (service: Service) => void;
  removeService: (serviceId: string) => void;
  toggleService: (service: Service) => void;
  clearServices: () => void;
  setServices: (services: Service[]) => void;
};

export const useBookingStore = create<BookingState>((set) => ({
  selectedServices: [],
  addService: (service) =>
    set((state) => {
      if (state.selectedServices.some((s) => s.id === service.id)) {
        return state;
      }
      return { selectedServices: [...state.selectedServices, service] };
    }),
  removeService: (serviceId) =>
    set((state) => ({
      selectedServices: state.selectedServices.filter(
        (s) => s.id !== serviceId,
      ),
    })),
  toggleService: (service) =>
    set((state) => {
      const exists = state.selectedServices.some((s) => s.id === service.id);
      return {
        selectedServices: exists
          ? state.selectedServices.filter((s) => s.id !== service.id)
          : [...state.selectedServices, service],
      };
    }),
  clearServices: () => set({ selectedServices: [] }),
  setServices: (services) => set({ selectedServices: services }),
}));
