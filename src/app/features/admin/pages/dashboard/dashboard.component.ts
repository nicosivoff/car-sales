import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { VehicleService } from '../../../vehicles/services/vehicle.service';
import { Vehicle } from '../../../vehicles/models/vehicle.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col font-body antialiased">
      <!-- Navbar Admin -->
      <header class="w-full bg-white border-b border-slate-200 shadow-xs fixed top-0 z-45">
        <nav class="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <a routerLink="/" class="flex items-center text-slate-500 hover:text-brand-primary transition-colors gap-1.5 text-xs font-bold">
              <span class="material-symbols-outlined text-sm">arrow_back</span>
              Volver al Sitio
            </a>
            <div class="h-4 w-px bg-slate-200"></div>
            <span class="font-display font-bold text-base text-brand-dark tracking-wider uppercase">LUXEMOTORS <span class="text-xs text-brand-primary font-bold lowercase bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md ml-1">admin</span></span>
          </div>
          <button
            (click)="openAddModal()"
            class="bg-brand-primary hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-indigo-500/10 cursor-pointer active:scale-95"
          >
            <span class="material-symbols-outlined text-base">add</span>
            Agregar Vehículo
          </button>
        </nav>
      </header>

      <main class="flex-grow max-w-7xl w-full mx-auto px-6 pt-24 pb-12">
        <!-- Dashboard Title -->
        <div class="mb-8">
          <h1 class="text-xl font-black text-brand-dark">Panel de Control</h1>
          <p class="text-xs text-brand-text-muted mt-1">Gestioná el inventario de la concesionaria, modificá precios y publicá nuevos vehículos.</p>
        </div>

        <!-- KPI Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Vehículos</span>
            <div class="text-2xl font-black text-brand-dark">{{ totalVehicles() }}</div>
          </div>
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span class="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block mb-1">En Venta (Disponibles)</span>
            <div class="text-2xl font-black text-brand-dark">{{ availableVehicles() }}</div>
          </div>
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span class="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block mb-1 font-display">Seminuevos y Usados</span>
            <div class="text-2xl font-black text-brand-dark">{{ totalUsados() }}</div>
          </div>
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span class="text-[10px] font-bold text-brand-error uppercase tracking-wider block mb-1">Vendidos</span>
            <div class="text-2xl font-black text-brand-dark">{{ totalSold() }}</div>
          </div>
        </div>

        <!-- Inventario List (Table) -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 class="font-bold text-sm text-brand-dark">Inventario Activo</h2>
            <div class="relative w-64">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <span class="material-symbols-outlined text-sm">search</span>
              </span>
              <input
                type="text"
                [ngModel]="searchQuery()"
                (ngModelChange)="searchQuery.set($event)"
                placeholder="Buscar por marca o modelo..."
                class="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-hidden transition-all text-slate-800"
              />
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th class="p-4">Vehículo</th>
                  <th class="p-4">Año</th>
                  <th class="p-4">Kilómetros</th>
                  <th class="p-4">Precio</th>
                  <th class="p-4">Especificaciones</th>
                  <th class="p-4">Estado</th>
                  <th class="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (car of filteredList(); track car.id) {
                  <tr class="hover:bg-slate-50/50 transition-colors">
                    <td class="p-4">
                      <div class="flex items-center gap-3">
                        <div class="w-12 h-9 rounded-md overflow-hidden bg-slate-100 flex-shrink-0">
                          <img [src]="car.images[0] || 'assets/placeholder-car.jpg'" class="w-full h-full object-cover">
                        </div>
                        <div>
                          <p class="font-bold text-brand-dark">{{ car.brand }} {{ car.model }}</p>
                          <span class="text-[10px] text-slate-400 block mt-0.5">ID: {{ car.id }}</span>
                        </div>
                      </div>
                    </td>
                    <td class="p-4 font-semibold text-slate-700">{{ car.year }}</td>
                    <td class="p-4 font-semibold text-slate-700">
                      {{ car.condition === 'nuevo' ? '0 Km' : (car.kilometers | number) + ' Km' }}
                    </td>
                    <td class="p-4 font-bold text-brand-primary">
                      {{ car.currency === 'ARS' ? '$' : 'USD' }} {{ car.price | number }}
                    </td>
                    <td class="p-4 text-slate-500 space-x-1.5">
                      <span class="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-sm capitalize">{{ car.transmission }}</span>
                      <span class="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-sm capitalize">{{ car.fuelType === 'gasolina' ? 'Nafta' : car.fuelType }}</span>
                    </td>
                    <td class="p-4">
                      <button
                        (click)="toggleSoldStatus(car)"
                        [ngClass]="car.isSold ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'"
                        class="border px-2.5 py-1 rounded-full font-bold text-[10px] cursor-pointer transition-all hover:brightness-95 flex items-center gap-1 select-none"
                      >
                        <span class="material-symbols-outlined text-[10px] font-bold">
                          {{ car.isSold ? 'cancel' : 'check_circle' }}
                        </span>
                        {{ car.isSold ? 'Vendido' : 'Disponible' }}
                      </button>
                    </td>
                    <td class="p-4 text-right space-x-1">
                      <button
                        (click)="openEditModal(car)"
                        class="p-2 text-slate-400 hover:text-brand-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Editar vehículo"
                      >
                        <span class="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button
                        (click)="deleteVehicle(car.id)"
                        class="p-2 text-slate-400 hover:text-brand-error hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar vehículo"
                      >
                        <span class="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="7" class="text-center py-12 text-slate-400">
                      <span class="material-symbols-outlined text-4xl block mb-2">directions_car</span>
                      No se encontraron vehículos en el inventario.
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <!-- Edit / Add Modal -->
      @if (isModalOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div class="bg-white rounded-3xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up">
            <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 class="font-display font-black text-sm text-brand-dark">
                {{ modalMode() === 'add' ? 'Agregar Nuevo Vehículo' : 'Editar Vehículo' }}
              </h3>
              <button (click)="closeModal()" class="text-slate-400 hover:text-slate-600 cursor-pointer">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <form (submit)="onSubmitForm($event)" class="p-6 space-y-4 text-xs">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Marca -->
                <div class="space-y-1">
                  <label class="font-bold text-slate-500 uppercase tracking-wider block">Marca</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Peugeot"
                    [(ngModel)]="formData.brand"
                    name="brand"
                    class="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-hidden transition-all text-slate-800"
                  />
                </div>

                <!-- Modelo -->
                <div class="space-y-1">
                  <label class="font-bold text-slate-500 uppercase tracking-wider block">Modelo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 208 GT"
                    [(ngModel)]="formData.model"
                    name="model"
                    class="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-hidden transition-all text-slate-800"
                  />
                </div>

                <!-- Año -->
                <div class="space-y-1">
                  <label class="font-bold text-slate-500 uppercase tracking-wider block">Año</label>
                  <input
                    type="number"
                    required
                    min="1900"
                    max="2027"
                    [(ngModel)]="formData.year"
                    name="year"
                    class="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-hidden transition-all text-slate-800"
                  />
                </div>

                <!-- Kilómetros -->
                <div class="space-y-1">
                  <label class="font-bold text-slate-500 uppercase tracking-wider block">Kilómetros</label>
                  <input
                    type="number"
                    required
                    min="0"
                    [(ngModel)]="formData.kilometers"
                    name="kilometers"
                    class="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-hidden transition-all text-slate-800"
                  />
                </div>

                <!-- Precio -->
                <div class="space-y-1">
                  <label class="font-bold text-slate-500 uppercase tracking-wider block">Precio</label>
                  <input
                    type="number"
                    required
                    min="0"
                    [(ngModel)]="formData.price"
                    name="price"
                    class="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-hidden transition-all text-slate-800"
                  />
                </div>

                <!-- Moneda -->
                <div class="space-y-1">
                  <label class="font-bold text-slate-500 uppercase tracking-wider block">Moneda</label>
                  <select
                    [(ngModel)]="formData.currency"
                    name="currency"
                    class="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-hidden transition-all text-slate-800"
                  >
                    <option value="USD">USD - Dólares</option>
                    <option value="ARS">ARS - Pesos</option>
                  </select>
                </div>

                <!-- Transmisión -->
                <div class="space-y-1">
                  <label class="font-bold text-slate-500 uppercase tracking-wider block">Transmisión</label>
                  <select
                    [(ngModel)]="formData.transmission"
                    name="transmission"
                    class="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-hidden transition-all text-slate-800"
                  >
                    <option value="manual">Manual</option>
                    <option value="automatico">Automático</option>
                  </select>
                </div>

                <!-- Condición -->
                <div class="space-y-1">
                  <label class="font-bold text-slate-500 uppercase tracking-wider block">Condición</label>
                  <select
                    [(ngModel)]="formData.condition"
                    name="condition"
                    class="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-hidden transition-all text-slate-800"
                  >
                    <option value="nuevo">Nuevo (0 Km)</option>
                    <option value="usado">Usado</option>
                  </select>
                </div>

                <!-- Combustible -->
                <div class="space-y-1">
                  <label class="font-bold text-slate-500 uppercase tracking-wider block">Combustible</label>
                  <select
                    [(ngModel)]="formData.fuelType"
                    name="fuelType"
                    class="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-hidden transition-all text-slate-800"
                  >
                    <option value="gasolina">Nafta</option>
                    <option value="diesel">Diésel</option>
                    <option value="gnc">GNC</option>
                    <option value="hibrido">Híbrido</option>
                    <option value="electrico">Eléctrico</option>
                  </select>
                </div>

                <!-- Anticipo Mínimo (Opcional) -->
                <div class="space-y-1">
                  <label class="font-bold text-slate-500 uppercase tracking-wider block">Anticipo Mínimo (Opcional)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Ej. 5000000"
                    [(ngModel)]="formData.minDownPayment"
                    name="minDownPayment"
                    class="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-hidden transition-all text-slate-800"
                  />
                </div>
              </div>

              <!-- Imágenes -->
              <div class="space-y-1">
                <label class="font-bold text-slate-500 uppercase tracking-wider block">Imágenes (Una URL por línea o separadas por comas)</label>
                <textarea
                  rows="3"
                  required
                  placeholder="https://ejemplo.com/auto1.jpg"
                  [(ngModel)]="rawImages"
                  name="rawImages"
                  class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-hidden transition-all text-slate-800 resize-none font-mono"
                ></textarea>
              </div>

              <!-- Checkboxes destacados -->
              <div class="flex items-center gap-6 pt-2">
                <label class="flex items-center gap-2 cursor-pointer font-semibold text-slate-600 select-none">
                  <input
                    type="checkbox"
                    [(ngModel)]="formData.isFeatured"
                    name="isFeatured"
                    class="h-4 w-4 rounded-md border-slate-300 text-brand-primary focus:ring-brand-primary/20"
                  />
                  Destacar Vehículo en Portada
                </label>
              </div>

              <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  (click)="closeModal()"
                  class="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="px-6 py-2.5 bg-brand-primary hover:bg-indigo-700 text-white font-bold rounded-xl cursor-pointer shadow-md shadow-indigo-500/10 active:scale-95"
                >
                  {{ modalMode() === 'add' ? 'Crear Publicación' : 'Guardar Cambios' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Custom Confirm Modal -->
      @if (isConfirmOpen()) {
        <div class="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div class="bg-white rounded-3xl border border-slate-200 w-full max-w-sm shadow-2xl p-6 space-y-5 animate-scale-up">
            <div class="flex items-center gap-3 text-brand-error">
              <span class="material-symbols-outlined text-2xl font-bold">warning</span>
              <h3 class="font-display font-black text-sm text-brand-dark">{{ confirmTitle() }}</h3>
            </div>
            <p class="text-xs text-brand-text-muted leading-relaxed">
              {{ confirmMessage() }}
            </p>
            <div class="flex justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                (click)="closeConfirm()"
                class="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl cursor-pointer text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                (click)="triggerConfirm()"
                class="px-4 py-2 bg-brand-error hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer shadow-md shadow-rose-500/10 active:scale-95 text-xs"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private readonly vehicleService = inject(VehicleService);

  readonly searchQuery = signal('');
  readonly isModalOpen = signal(false);
  readonly modalMode = signal<'add' | 'edit'>('add');
  readonly selectedVehicleId = signal<string | null>(null);

  // Custom Confirm State
  readonly isConfirmOpen = signal(false);
  readonly confirmTitle = signal('');
  readonly confirmMessage = signal('');
  readonly confirmAction = signal<(() => void) | null>(null);

  // Form State
  rawImages = '';
  formData = {
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    kilometers: 0,
    price: 0,
    minDownPayment: undefined as number | undefined,
    currency: 'USD' as 'USD' | 'ARS',
    condition: 'usado' as 'nuevo' | 'usado',
    fuelType: 'gasolina' as 'gasolina' | 'diesel' | 'gnc' | 'electrico' | 'hibrido',
    transmission: 'manual' as 'manual' | 'automatico',
    isFeatured: false,
    dealershipId: '1'
  };

  // KPIs
  readonly totalVehicles = computed(() => this.vehicleService.vehicles().length);
  readonly availableVehicles = computed(() => this.vehicleService.vehicles().filter(v => !v.isSold).length);
  readonly totalSold = computed(() => this.vehicleService.vehicles().filter(v => v.isSold).length);
  readonly totalUsados = computed(() => this.vehicleService.vehicles().filter(v => v.condition === 'usado').length);

  // Inventario Filtrado por Búsqueda local
  readonly filteredList = computed(() => {
    const list = this.vehicleService.vehicles();
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return list;
    return list.filter(v =>
      v.brand.toLowerCase().includes(query) ||
      v.model.toLowerCase().includes(query)
    );
  });

  openAddModal(): void {
    this.modalMode.set('add');
    this.selectedVehicleId.set(null);
    this.rawImages = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
    this.formData = {
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      kilometers: 0,
      price: 0,
      minDownPayment: undefined,
      currency: 'USD',
      condition: 'usado',
      fuelType: 'gasolina',
      transmission: 'manual',
      isFeatured: false,
      dealershipId: '1'
    };
    this.isModalOpen.set(true);
  }

  openEditModal(vehicle: Vehicle): void {
    this.modalMode.set('edit');
    this.selectedVehicleId.set(vehicle.id);
    this.rawImages = vehicle.images.join('\n');
    this.formData = {
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      kilometers: vehicle.kilometers,
      price: vehicle.price,
      minDownPayment: vehicle.minDownPayment,
      currency: vehicle.currency,
      condition: vehicle.condition,
      fuelType: vehicle.fuelType,
      transmission: vehicle.transmission,
      isFeatured: vehicle.isFeatured,
      dealershipId: vehicle.dealershipId
    };
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  onSubmitForm(event: Event): void {
    event.preventDefault();
    
    // Parse raw image text lines into array
    const images = this.rawImages
      .split(/[\n,]/)
      .map(img => img.trim())
      .filter(img => img.length > 0);

    const vehicleData = {
      brand: this.formData.brand.trim(),
      model: this.formData.model.trim(),
      year: Number(this.formData.year),
      kilometers: Number(this.formData.kilometers),
      price: Number(this.formData.price),
      minDownPayment: this.formData.minDownPayment ? Number(this.formData.minDownPayment) : undefined,
      currency: this.formData.currency,
      condition: this.formData.condition,
      fuelType: this.formData.fuelType,
      transmission: this.formData.transmission,
      isFeatured: this.formData.isFeatured,
      images: images.length > 0 ? images : ['assets/placeholder-car.jpg'],
      dealershipId: this.formData.dealershipId
    };

    if (this.modalMode() === 'add') {
      this.vehicleService.addVehicle(vehicleData);
    } else {
      const id = this.selectedVehicleId();
      if (id) {
        this.vehicleService.updateVehicle(id, vehicleData);
      }
    }
    this.closeModal();
  }

  toggleSoldStatus(vehicle: Vehicle): void {
    this.vehicleService.updateVehicle(vehicle.id, { isSold: !vehicle.isSold });
  }

  deleteVehicle(id: string): void {
    this.confirmTitle.set('Eliminar Vehículo');
    this.confirmMessage.set('¿Estás seguro de que deseas eliminar este vehículo del inventario? Esta acción es permanente y no se puede deshacer.');
    this.confirmAction.set(() => {
      this.vehicleService.deleteVehicle(id);
      this.closeConfirm();
    });
    this.isConfirmOpen.set(true);
  }

  closeConfirm(): void {
    this.isConfirmOpen.set(false);
    this.confirmAction.set(null);
  }

  triggerConfirm(): void {
    const action = this.confirmAction();
    if (action) {
      action();
    }
  }
}
