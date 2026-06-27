import { VehicleDTO } from '../models/vehicle.model';

export const VEHICLES_MOCK_DTO: VehicleDTO[] = [
  {
    id: '1',
    brand: 'Volkswagen',
    model: 'Amarok Confortline V6 3.0TDI',
    year: 2019,
    kilometers: 175000,
    price: 35500000,
    min_down_payment: 17800000,
    currency: 'ARS',
    condition: 'usado',
    fuel_type: 'diesel',
    transmission: 'automatico',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'
    ],
    featured: true,
    sold: false,
    dealership_id: 'ds-01',
    created_at: '2026-06-01T10:00:00Z',
    updated_at: '2026-06-01T10:00:00Z'
  },
  {
    id: '2',
    brand: 'Volkswagen',
    model: 'Golf Confortline 1.4TSI',
    year: 2018,
    kilometers: 53000,
    price: 26300000,
    min_down_payment: 13000000,
    currency: 'ARS',
    condition: 'usado',
    fuel_type: 'gasolina',
    transmission: 'manual',
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800'
    ],
    featured: true,
    sold: false,
    dealership_id: 'ds-01',
    created_at: '2026-06-02T11:00:00Z',
    updated_at: '2026-06-02T11:00:00Z'
  },
  {
    id: '3',
    brand: 'Volkswagen',
    model: 'Tiguan 2.0TDI',
    year: 2010,
    kilometers: 193000,
    price: 18500000,
    min_down_payment: 12000000,
    currency: 'ARS',
    condition: 'usado',
    fuel_type: 'diesel',
    transmission: 'manual',
    images: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=800'
    ],
    featured: false,
    sold: false,
    dealership_id: 'ds-01',
    created_at: '2026-06-03T09:30:00Z',
    updated_at: '2026-06-03T09:30:00Z'
  },
  {
    id: '4',
    brand: 'Ford',
    model: 'Focus SE AT 2.0',
    year: 2019,
    kilometers: 92000,
    price: 20950000,
    min_down_payment: 10500000,
    currency: 'ARS',
    condition: 'usado',
    fuel_type: 'gasolina',
    transmission: 'automatico',
    images: [
      'https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&q=80&w=800'
    ],
    featured: true,
    sold: false,
    dealership_id: 'ds-01',
    created_at: '2026-06-04T15:00:00Z',
    updated_at: '2026-06-04T15:00:00Z'
  },
  {
    id: '5',
    brand: 'Jeep',
    model: 'Compass Longitude 1.3T',
    year: 2024,
    kilometers: 13900,
    price: 42000000,
    min_down_payment: 19000000,
    currency: 'ARS',
    condition: 'usado',
    fuel_type: 'gasolina',
    transmission: 'automatico',
    images: [
      'https://images.unsplash.com/photo-1623860840536-a3dcca59942a?auto=format&fit=crop&q=80&w=800'
    ],
    featured: true,
    sold: false,
    dealership_id: 'ds-01',
    created_at: '2026-06-05T12:00:00Z',
    updated_at: '2026-06-05T12:00:00Z'
  },
  {
    id: '6',
    brand: 'Jeep',
    model: 'Gran Cherokee Overland ATX 3.6',
    year: 2012,
    kilometers: 126000,
    price: 28000000,
    min_down_payment: 16800000,
    currency: 'ARS',
    condition: 'usado',
    fuel_type: 'gasolina',
    transmission: 'automatico',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800'
    ],
    featured: false,
    sold: false,
    dealership_id: 'ds-01',
    created_at: '2026-06-06T08:00:00Z',
    updated_at: '2026-06-06T08:00:00Z'
  },
  {
    id: '7',
    brand: 'Renault',
    model: 'Kwid E-Tech',
    year: 2023,
    kilometers: 6000,
    price: 25950000,
    min_down_payment: 10100000,
    currency: 'ARS',
    condition: 'usado',
    fuel_type: 'electrico',
    transmission: 'automatico',
    images: [
      'https://images.unsplash.com/photo-1605558158382-95993a8e9725?auto=format&fit=crop&q=80&w=800'
    ],
    featured: false,
    sold: false,
    dealership_id: 'ds-01',
    created_at: '2026-06-07T10:00:00Z',
    updated_at: '2026-06-07T10:00:00Z'
  },
  {
    id: '8',
    brand: 'Nissan',
    model: 'Kicks Advance AT 1.6',
    year: 2021,
    kilometers: 80000,
    price: 28900000,
    min_down_payment: 13000000,
    currency: 'ARS',
    condition: 'usado',
    fuel_type: 'gasolina',
    transmission: 'automatico',
    images: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=800'
    ],
    featured: false,
    sold: false,
    dealership_id: 'ds-01',
    created_at: '2026-06-08T11:00:00Z',
    updated_at: '2026-06-08T11:00:00Z'
  },
  {
    id: '9',
    brand: 'Audi',
    model: 'A3 S-TRONIC 1.4T',
    year: 2017,
    kilometers: 82000,
    price: 30200000,
    min_down_payment: 15000000,
    currency: 'ARS',
    condition: 'usado',
    fuel_type: 'gnc',
    transmission: 'automatico',
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800'
    ],
    featured: false,
    sold: false,
    dealership_id: 'ds-01',
    created_at: '2026-06-09T09:30:00Z',
    updated_at: '2026-06-09T09:30:00Z'
  },
  {
    id: '10',
    brand: 'Renault',
    model: 'Kwid Icon 1.0',
    year: 2026,
    kilometers: 1,
    price: 4800000,
    currency: 'ARS',
    condition: 'nuevo',
    fuel_type: 'gasolina',
    transmission: 'manual',
    images: [
      'https://images.unsplash.com/photo-1605558158382-95993a8e9725?auto=format&fit=crop&q=80&w=800'
    ],
    featured: false,
    sold: false,
    dealership_id: 'ds-01',
    created_at: '2026-06-10T12:00:00Z',
    updated_at: '2026-06-10T12:00:00Z'
  }
];
