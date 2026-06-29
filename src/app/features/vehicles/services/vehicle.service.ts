import { Injectable, computed, signal } from '@angular/core';
import { Vehicle, VehicleMapper } from '../models/vehicle.model';
import { VEHICLES_MOCK_DTO } from '../mockData/vehicles.mock';

export interface VehicleFilters {
  search?: string;
  brand?: string[];
  minYear?: number;
  maxYear?: number;
  year?: number[];
  minPrice?: number;
  maxPrice?: number;
  transmission?: ('manual' | 'automatico')[];
  condition?: ('nuevo' | 'usado')[];
  fuelType?: ('gasolina' | 'diesel' | 'gnc' | 'electrico' | 'hibrido')[];
}

interface VehicleState {
  vehicles: Vehicle[];
  filters: VehicleFilters;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  
  // Estado privado reactivo mediante un único Signal conteniendo el objeto de estado
  private readonly _state = signal<VehicleState>({
    vehicles: [],
    filters: {},
    loading: true,
    error: null
  });

  constructor() {
    this.fetchVehicles();
  }

  private fetchVehicles(): void {
    this._state.update(state => ({ ...state, loading: true }));
    setTimeout(() => {
      this._state.update(state => ({
        ...state,
        vehicles: VEHICLES_MOCK_DTO.map(dto => VehicleMapper.fromDTO(dto)),
        loading: false
      }));
    }, 1000);
  }

  // Selectores expuestos como Read-Only Signals para prevenir mutación directa desde componentes
  readonly vehicles = computed(() => this._state().vehicles);
  readonly filters = computed(() => this._state().filters);
  readonly loading = computed(() => this._state().loading);
  readonly error = computed(() => this._state().error);

  // Lista de marcas disponibles calculada dinámicamente
  readonly brands = computed(() => {
    const brandsSet = new Set(this.vehicles().map(v => v.brand));
    return Array.from(brandsSet).sort();
  });

  // Lista filtrada reactiva basada en los filtros activos
  readonly filteredVehicles = computed(() => {
    const { vehicles, filters } = this._state();
    return vehicles.filter(vehicle => {
      // Búsqueda por texto (marca o modelo)
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesBrand = vehicle.brand.toLowerCase().includes(query);
        const matchesModel = vehicle.model.toLowerCase().includes(query);
        if (!matchesBrand && !matchesModel) return false;
      }
      // Filtro de marca (múltiple)
      if (filters.brand && filters.brand.length > 0 && !filters.brand.includes(vehicle.brand)) {
        return false;
      }
      // Filtro de año mínimo
      if (filters.minYear && vehicle.year < filters.minYear) {
        return false;
      }
      // Filtro de año máximo
      if (filters.maxYear && vehicle.year > filters.maxYear) {
        return false;
      }
      // Filtro de año exacto (múltiple)
      if (filters.year && filters.year.length > 0 && !filters.year.includes(vehicle.year)) {
        return false;
      }
      // Filtro de precio mínimo
      if (filters.minPrice && vehicle.price < filters.minPrice) {
        return false;
      }
      // Filtro de precio máximo
      if (filters.maxPrice && vehicle.price > filters.maxPrice) {
        return false;
      }
      // Filtro de transmisión (múltiple)
      if (filters.transmission && filters.transmission.length > 0 && !filters.transmission.includes(vehicle.transmission)) {
        return false;
      }
      // Filtro de condición (nuevo / usado) (múltiple)
      if (filters.condition && filters.condition.length > 0 && !filters.condition.includes(vehicle.condition)) {
        return false;
      }
      // Filtro de combustible (múltiple)
      if (filters.fuelType && filters.fuelType.length > 0 && !filters.fuelType.includes(vehicle.fuelType)) {
        return false;
      }
      return true;
    });
  });

  /**
   * Actualiza los filtros activos del listado.
   */
  updateFilters(newFilters: Partial<VehicleFilters>): void {
    this._state.update(state => ({
      ...state,
      filters: {
        ...state.filters,
        ...newFilters
      }
    }));
  }

  /**
   * Resetea todos los filtros de búsqueda.
   */
  clearFilters(): void {
    this._state.update(state => ({
      ...state,
      filters: {}
    }));
  }

  /**
   * ABMC: Obtiene un vehículo individual por ID.
   */
  getVehicleById(id: string): Vehicle | undefined {
    return this.vehicles().find(v => v.id === id);
  }

  /**
   * ABMC: Alta de vehículo.
   */
  addVehicle(newCarData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt' | 'isSold'>): void {
    this._state.update(state => ({ ...state, loading: true }));
    setTimeout(() => {
      const newVehicle: Vehicle = {
        ...newCarData,
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
        isSold: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this._state.update(state => ({
        ...state,
        vehicles: [newVehicle, ...state.vehicles],
        loading: false
      }));
    }, 500);
  }

  /**
   * ABMC: Modificación de vehículo.
   */
  updateVehicle(id: string, updatedFields: Partial<Vehicle>): void {
    this._state.update(state => ({ ...state, loading: true }));
    setTimeout(() => {
      this._state.update(state => ({
        ...state,
        vehicles: state.vehicles.map(v => 
          v.id === id 
            ? { ...v, ...updatedFields, updatedAt: new Date() } 
            : v
        ),
        loading: false
      }));
    }, 500);
  }

  /**
   * ABMC: Baja de vehículo (Eliminación).
   */
  deleteVehicle(id: string): void {
    this._state.update(state => ({ ...state, loading: true }));
    setTimeout(() => {
      this._state.update(state => ({
        ...state,
        vehicles: state.vehicles.filter(v => v.id !== id),
        loading: false
      }));
    }, 500);
  }
}
