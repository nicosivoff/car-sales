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
          <div>
            <a routerLink="/" class="flex items-center text-slate-500 hover:text-brand-primary transition-colors gap-1.5 text-xs font-bold select-none cursor-pointer">
              <span class="material-symbols-outlined text-sm">arrow_back</span>
              Volver al Sitio
            </a>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-display font-bold text-base text-brand-dark tracking-wider uppercase">LUXEMOTORS <span class="text-xs text-brand-primary font-bold lowercase bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md ml-1">admin</span></span>
          </div>
        </nav>
      </header>

      <main class="flex-grow max-w-7xl w-full mx-auto px-6 pt-24 pb-12">
        <!-- Dashboard Title -->
        <div class="mb-8">
          <h1 class="text-xl font-black text-brand-dark">Panel de Control</h1>
          <p class="text-xs text-brand-text-muted mt-1">Gestioná el inventario de la concesionaria, modificá precios y publicá nuevos vehículos.</p>
        </div>

        <!-- KPI Cards -->
        <div class="hidden md:grid grid-cols-3 gap-4 mb-8">
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Vehículos</span>
            <div class="text-2xl font-black text-brand-dark">{{ totalVehicles() }}</div>
          </div>
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span class="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block mb-1">En Venta (Disponibles)</span>
            <div class="text-2xl font-black text-brand-dark">{{ availableVehicles() }}</div>
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

          <!-- Filtros Rápidos -->
          <div class="hidden md:flex px-6 py-3 bg-slate-50/50 border-b border-slate-200 flex-wrap gap-2 items-center">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2">Filtros rápidos:</span>
            <button 
              (click)="activeQuickFilter.set('all')"
              [ngClass]="activeQuickFilter() === 'all' ? 'bg-brand-primary text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
              class="px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer"
            >
              Todos
            </button>
            <button 
              (click)="activeQuickFilter.set('new')"
              [ngClass]="activeQuickFilter() === 'new' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
              class="px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer"
            >
              Nuevos (0km)
            </button>
            <button 
              (click)="activeQuickFilter.set('used')"
              [ngClass]="activeQuickFilter() === 'used' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
              class="px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer"
            >
              Usados
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider select-none">
                  <th class="p-4 md:hidden">Acciones</th>
                  <th class="p-4">Vehículo</th>
                  <th 
                    (click)="toggleSort('year')"
                    class="p-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div class="flex items-center gap-1">
                      Año
                      @if (sortKey() === 'year') {
                        <span class="material-symbols-outlined text-[14px]">
                          {{ sortAsc() ? 'arrow_upward' : 'arrow_downward' }}
                        </span>
                      }
                    </div>
                  </th>
                  <th 
                    (click)="toggleSort('kilometers')"
                    class="p-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div class="flex items-center gap-1">
                      Kilómetros
                      @if (sortKey() === 'kilometers') {
                        <span class="material-symbols-outlined text-[14px]">
                          {{ sortAsc() ? 'arrow_upward' : 'arrow_downward' }}
                        </span>
                      }
                    </div>
                  </th>
                  <th 
                    (click)="toggleSort('price')"
                    class="p-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div class="flex items-center gap-1">
                      Precio
                      @if (sortKey() === 'price') {
                        <span class="material-symbols-outlined text-[14px]">
                          {{ sortAsc() ? 'arrow_upward' : 'arrow_downward' }}
                        </span>
                      }
                    </div>
                  </th>
                  <th class="p-4">Especificaciones</th>
                  <th class="p-4">Estado</th>
                  <th class="p-4 text-center hidden md:table-cell">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (car of filteredList(); track car.id) {
                  <tr class="hover:bg-slate-50/50 transition-colors">
                    <td class="p-2 w-12 text-center md:hidden">
                      <div class="flex flex-col gap-0.5 items-center justify-center">
                        <button
                          (click)="openEditModal(car)"
                          class="p-1 text-slate-400 hover:text-brand-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Editar vehículo"
                        >
                          <span class="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button
                          (click)="deleteVehicle(car.id)"
                          class="p-1 text-slate-400 hover:text-brand-error hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar vehículo"
                        >
                          <span class="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </td>
                    <td class="p-4">
                      <div class="flex items-center gap-3">
                        <div class="hidden md:block w-12 h-9 rounded-md overflow-hidden bg-slate-100 flex-shrink-0">
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
                    <td class="p-2 w-12 text-center hidden md:table-cell">
                      <div class="flex flex-col gap-0.5 items-center justify-center">
                        <button
                          (click)="openEditModal(car)"
                          class="p-1 text-slate-400 hover:text-brand-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Editar vehículo"
                        >
                          <span class="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button
                          (click)="deleteVehicle(car.id)"
                          class="p-1 text-slate-400 hover:text-brand-error hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar vehículo"
                        >
                          <span class="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </td>
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

      <!-- Botón Agregar Vehículo Flotante (Bottom Right) -->
      <button
        (click)="openAddModal()"
        class="fixed bottom-6 right-6 bg-brand-primary hover:bg-indigo-700 text-white p-4 rounded-full font-bold text-xs transition-all flex items-center gap-2 shadow-2xl z-40 cursor-pointer active:scale-95 group"
        title="Agregar Vehículo"
      >
        <span class="material-symbols-outlined text-[24px]">add</span>
        <span class="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold ease-in-out whitespace-nowrap">
          Agregar Vehículo
        </span>
      </button>

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

              <!-- Imágenes (File Upload / Drag and Drop) -->
              <div class="space-y-2">
                <label class="font-bold text-slate-500 uppercase tracking-wider block">Imágenes del Vehículo (JPG, PNG)</label>
                
                <!-- Drag and Drop Dropzone -->
                <div 
                  (dragover)="onDragOver($event)"
                  (dragleave)="onDragLeave($event)"
                  (drop)="onDrop($event)"
                  (click)="fileInput.click()"
                  [ngClass]="isDragging() ? 'border-brand-primary bg-indigo-50/50' : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50'"
                  class="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2 group"
                >
                  <input 
                    #fileInput
                    type="file" 
                    multiple
                    accept="image/png, image/jpeg"
                    (change)="onFileSelected($event)"
                    class="hidden"
                  >
                  <span class="material-symbols-outlined text-[36px] text-slate-400 group-hover:text-brand-primary transition-colors">upload_file</span>
                  <div class="space-y-0.5">
                    <p class="font-bold text-slate-705 text-xs">Arrastrá tus imágenes acá o <span class="text-brand-primary hover:underline">explorá</span></p>
                    <p class="text-[10px] text-slate-400 font-medium">Soporta archivos JPG y PNG</p>
                  </div>
                </div>

                <!-- Preview of Uploaded Images -->
                @if (uploadedImages().length > 0) {
                  <div class="grid grid-cols-4 gap-2 mt-2">
                    @for (img of uploadedImages(); track img; let idx = $index) {
                      <div class="relative aspect-video rounded-lg overflow-hidden border border-slate-200 group">
                        <img [src]="img" class="w-full h-full object-cover">
                        <button 
                          type="button"
                          (click)="removeUploadedImage(idx)"
                          class="absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-md transition-colors cursor-pointer flex items-center justify-center"
                          title="Eliminar imagen"
                        >
                          <span class="material-symbols-outlined text-xs">close</span>
                        </button>
                      </div>
                    }
                  </div>
                }
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

      <!-- Premium Toast Notification -->
      @if (showToast()) {
        <div class="fixed top-20 left-1/2 -translate-x-1/2 z-100 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-emerald-500/20 animate-fade-in select-none">
          <span class="material-symbols-outlined text-sm font-bold">check_circle</span>
          <span class="font-bold text-[11px] tracking-wide">{{ toastMessage() }}</span>
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

  // Sorting State
  readonly sortKey = signal<'year' | 'kilometers' | 'price' | null>(null);
  readonly sortAsc = signal<boolean>(true);

  // Quick Filter State
  readonly activeQuickFilter = signal<'all' | 'available' | 'sold' | 'new' | 'used' | 'featured'>('all');

  // Drag and Drop File Upload State
  readonly isDragging = signal(false);
  readonly uploadedImages = signal<string[]>([]);

  // Custom Confirm State
  readonly isConfirmOpen = signal(false);
  readonly confirmTitle = signal('');
  readonly confirmMessage = signal('');
  readonly confirmAction = signal<(() => void) | null>(null);

  // Success Toast Notification State
  readonly showToast = signal(false);
  readonly toastMessage = signal('');

  showToastNotification(message: string): void {
    this.toastMessage.set(message);
    this.showToast.set(true);
    setTimeout(() => {
      this.showToast.set(false);
    }, 3000);
  }

  // Form State
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

  // Inventario Filtrado por Búsqueda, Filtros Rápidos y Ordenamiento
  readonly filteredList = computed(() => {
    let list = this.vehicleService.vehicles();
    
    // 1. Filtros Rápidos
    const quick = this.activeQuickFilter();
    if (quick === 'available') {
      list = list.filter(v => !v.isSold);
    } else if (quick === 'sold') {
      list = list.filter(v => v.isSold);
    } else if (quick === 'new') {
      list = list.filter(v => v.condition === 'nuevo');
    } else if (quick === 'used') {
      list = list.filter(v => v.condition === 'usado');
    } else if (quick === 'featured') {
      list = list.filter(v => v.isFeatured);
    }

    // 2. Búsqueda por Texto
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      list = list.filter(v =>
        v.brand.toLowerCase().includes(query) ||
        v.model.toLowerCase().includes(query)
      );
    }
    
    // 3. Ordenamiento
    const key = this.sortKey();
    if (key) {
      const asc = this.sortAsc();
      list = [...list].sort((a, b) => {
        const valA = a[key] ?? 0;
        const valB = b[key] ?? 0;
        if (valA === valB) return 0;
        return asc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
      });
    }
    return list;
  });

  toggleSort(key: 'year' | 'kilometers' | 'price'): void {
    if (this.sortKey() === key) {
      this.sortAsc.update(asc => !asc);
    } else {
      this.sortKey.set(key);
      this.sortAsc.set(true);
    }
  }

  openAddModal(): void {
    this.modalMode.set('add');
    this.selectedVehicleId.set(null);
    this.uploadedImages.set([]);
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
    this.uploadedImages.set([...vehicle.images]);
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
    
    const images = this.uploadedImages();

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
      this.showToastNotification('¡Vehículo publicado con éxito!');
    } else {
      const id = this.selectedVehicleId();
      if (id) {
        this.vehicleService.updateVehicle(id, vehicleData);
        this.showToastNotification('¡Cambios guardados con éxito!');
      }
    }
    this.closeModal();
  }

  // Drag & Drop Event Handlers
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
    
    if (event.dataTransfer?.files) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(input.files);
    }
  }

  handleFiles(files: FileList): void {
    Array.from(files).forEach(file => {
      if (file.type === 'image/png' || file.type === 'image/jpeg') {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const result = e.target?.result as string;
          if (result) {
            this.uploadedImages.update(imgs => [...imgs, result]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  removeUploadedImage(index: number): void {
    this.uploadedImages.update(imgs => imgs.filter((_, i) => i !== index));
  }

  toggleSoldStatus(vehicle: Vehicle): void {
    this.vehicleService.updateVehicle(vehicle.id, { isSold: !vehicle.isSold });
    this.showToastNotification(`¡Estado de venta actualizado a ${!vehicle.isSold ? 'Vendido' : 'Disponible'}!`);
  }

  deleteVehicle(id: string): void {
    this.confirmTitle.set('Eliminar Vehículo');
    this.confirmMessage.set('¿Estás seguro de que deseas eliminar este vehículo del inventario? Esta acción es permanente y no se puede deshacer.');
    this.confirmAction.set(() => {
      this.vehicleService.deleteVehicle(id);
      this.closeConfirm();
      this.showToastNotification('¡Vehículo eliminado con éxito!');
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
