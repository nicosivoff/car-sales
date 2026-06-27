/**
 * Representa el formato crudo de los datos recibidos del servidor.
 * Sigue la convención snake_case común en backends de bases de datos.
 */
export interface VehicleDTO {
  id: string;
  brand: string;
  model: string;
  year: number;
  kilometers: number;
  price: number;
  min_down_payment?: number; // Anticipo mínimo para financiación (opcional)
  currency: 'ARS' | 'USD';
  condition: 'nuevo' | 'usado';
  fuel_type: 'gasolina' | 'diesel' | 'hibrido' | 'electrico' | 'gnc';
  transmission: 'manual' | 'automatico';
  images: string[];
  featured: boolean;
  sold: boolean;
  dealership_id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Representa el modelo de dominio del vehículo listo para el consumo del Frontend.
 * Propiedades tipadas y nombres en camelCase.
 */
export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  kilometers: number;
  price: number;
  minDownPayment?: number; // Anticipo mínimo para financiación (opcional)
  currency: 'ARS' | 'USD';
  condition: 'nuevo' | 'usado';
  fuelType: 'gasolina' | 'diesel' | 'hibrido' | 'electrico' | 'gnc';
  transmission: 'manual' | 'automatico';
  images: string[];
  isFeatured: boolean;
  isSold: boolean;
  dealershipId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mapeador estático de datos puro para aislar el frontend del esquema del backend.
 */
export class VehicleMapper {
  
  static fromDTO(dto: VehicleDTO): Vehicle {
    return {
      id: dto.id,
      brand: dto.brand,
      model: dto.model,
      year: dto.year,
      kilometers: dto.kilometers,
      price: dto.price,
      minDownPayment: dto.min_down_payment,
      currency: dto.currency,
      condition: dto.condition,
      fuelType: dto.fuel_type,
      transmission: dto.transmission,
      images: dto.images && dto.images.length > 0 ? dto.images : ['assets/placeholder-car.jpg'],
      isFeatured: !!dto.featured,
      isSold: !!dto.sold,
      dealershipId: dto.dealership_id,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at)
    };
  }

  static toDTO(model: Vehicle): VehicleDTO {
    return {
      id: model.id,
      brand: model.brand,
      model: model.model,
      year: model.year,
      kilometers: model.kilometers,
      price: model.price,
      min_down_payment: model.minDownPayment,
      currency: model.currency,
      condition: model.condition,
      fuel_type: model.fuelType,
      transmission: model.transmission,
      images: model.images,
      featured: model.isFeatured,
      sold: model.isSold,
      dealership_id: model.dealershipId,
      created_at: model.createdAt.toISOString(),
      updated_at: model.updatedAt.toISOString()
    };
  }
}
