import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { BadgeComponent } from '@shared/components/badge/badge.component';
import { DropdownComponent, DropdownOption } from '@shared/components/dropdown/dropdown.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, BadgeComponent, DropdownComponent],
  template: `
    <div class="max-w-7xl mx-auto px-6 py-8">
      
      <!-- Contenedor con Sidebar en Desktop, Stack en Mobile -->
      <div class="flex flex-col lg:flex-row gap-8">
        
        <!-- Sidebar de Filtros (Liquid Glass Style / Dropdown en Mobile) -->
        <aside class="w-full lg:w-72 flex-shrink-0">
          <!-- Botón de Dropdown en Mobile -->
          <button 
            (click)="toggleMobileFilters()"
            class="lg:hidden w-full flex items-center justify-between bg-white border border-slate-200 p-4 rounded-xl shadow-xs mb-4 cursor-pointer text-slate-800"
          >
            <div class="flex items-center gap-2 font-bold text-xs">
              <span class="material-symbols-outlined text-[18px] text-brand-primary">filter_list</span>
              Filtrar Catálogo
              @if (hasActiveFilters()) {
                <span class="bg-brand-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">!</span>
              }
            </div>
            <span class="material-symbols-outlined text-[18px] transition-transform duration-300" [ngClass]="{'rotate-180': isMobileFiltersOpen()}">
              keyboard_arrow_down
            </span>
          </button>

          <!-- Filtros Container -->
          <div 
            [ngClass]="isMobileFiltersOpen() ? 'block' : 'hidden lg:block'"
            class="card-glass rounded-2xl p-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar"
          >
            
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-bold font-display text-brand-dark">Filtros</h2>
              @if (hasActiveFilters()) {
                <button 
                  (click)="clearAllFilters()"
                  class="text-brand-primary text-xs font-bold hover:underline cursor-pointer"
                >
                  Restablecer todo
                </button>
              }
            </div>

            <div class="space-y-6">
              <!-- Búsqueda por Texto -->
              <div class="space-y-2">
                <label class="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">Búsqueda</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <span class="material-symbols-outlined text-[18px]">search</span>
                  </span>
                  <input 
                    type="text"
                    [value]="filters().search || ''"
                    (input)="onSearchChange($event)"
                    placeholder="Marca o modelo..."
                    class="w-full pl-9 pr-3 h-12 text-sm bg-white/40 border border-white/60 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-hidden transition-all text-slate-800"
                  >
                </div>
              </div>

              <!-- Filtro de Condición -->
              <div class="space-y-2">
                <label class="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">Condición</label>
                <div class="flex flex-wrap gap-2">
                  <button 
                    (click)="clearConditionFilter()"
                    [ngClass]="[!(filters().condition && filters().condition!.length > 0) ? 'border-brand-primary bg-brand-primary text-white shadow-xs' : 'border-white/60 bg-white/40 text-brand-text-muted hover:border-brand-primary shadow-xs']"
                    class="px-4 py-2 rounded-full border text-xs font-bold transition-all cursor-pointer"
                  >
                    Todos
                  </button>
                  <button 
                    (click)="toggleConditionFilter('nuevo')"
                    [ngClass]="[isConditionSelected('nuevo') ? 'border-brand-primary bg-brand-primary text-white shadow-xs' : 'border-white/60 bg-white/40 text-brand-text-muted hover:border-brand-primary shadow-xs']"
                    class="px-4 py-2 rounded-full border text-xs font-bold transition-all cursor-pointer"
                  >
                    Nuevo (0km)
                  </button>
                  <button 
                    (click)="toggleConditionFilter('usado')"
                    [ngClass]="[isConditionSelected('usado') ? 'border-brand-primary bg-brand-primary text-white shadow-xs' : 'border-white/60 bg-white/40 text-brand-text-muted hover:border-brand-primary shadow-xs']"
                    class="px-4 py-2 rounded-full border text-xs font-bold transition-all cursor-pointer"
                  >
                    Usado
                  </button>
                </div>
              </div>

              <!-- Filtro de Marca -->
              <div class="space-y-2">
                <label class="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">Marca</label>
                <div class="max-h-36 overflow-y-auto custom-scrollbar space-y-2 bg-white/30 border border-white/60 p-3 rounded-xl">
                  @for (brand of brands(); track brand) {
                    <label class="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        [checked]="isBrandSelected(brand)"
                        (change)="toggleBrandFilter(brand)"
                        class="rounded border-slate-300 text-brand-primary focus:ring-brand-primary/20 cursor-pointer"
                      >
                      {{ brand }}
                    </label>
                  }
                </div>
              </div>

              <!-- Filtro de Rango de Precios (Barra Desplazable) -->
              <div class="space-y-2">
                <label class="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">
                  Precio Máximo: {{ (filters().maxPrice || maxPriceLimit()) | number }}
                </label>
                <div class="space-y-2 bg-white/30 border border-white/60 p-3.5 rounded-xl">
                  <input 
                    type="range" 
                    [min]="0"
                    [max]="maxPriceLimit()"
                    [step]="maxPriceLimit() / 100"
                    [value]="filters().maxPrice || maxPriceLimit()"
                    (input)="onMaxPriceSliderChange($event)"
                    class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                  >
                  <div class="flex justify-between text-[9px] font-bold text-slate-500">
                    <span>$0</span>
                    <span>$ {{ maxPriceLimit() | number }}</span>
                  </div>
                </div>
              </div>

              <!-- Filtro de Combustible -->
              <div class="space-y-2">
                <label class="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">Combustible</label>
                <div class="space-y-2 bg-white/30 border border-white/60 p-3 rounded-xl">
                  @for (fuel of fuelOptions; track fuel.value) {
                    <label class="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        [checked]="isFuelTypeSelected(fuel.value)"
                        (change)="toggleFuelTypeFilter(fuel.value)"
                        class="rounded border-slate-300 text-brand-primary focus:ring-brand-primary/20 cursor-pointer"
                      >
                      {{ fuel.label }}
                    </label>
                  }
                </div>
              </div>

              <!-- Filtro de Año -->
              <div class="space-y-2">
                <label class="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">Año</label>
                <div class="max-h-36 overflow-y-auto custom-scrollbar space-y-2 bg-white/30 border border-white/60 p-3 rounded-xl">
                  @for (y of years(); track y) {
                    <label class="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        [checked]="isYearSelected(y)"
                        (change)="toggleYearFilter(y)"
                        class="rounded border-slate-300 text-brand-primary focus:ring-brand-primary/20 cursor-pointer"
                      >
                      {{ y }}
                    </label>
                  }
                </div>
              </div>

              <!-- Filtro de Caja / Transmisión -->
              <div class="space-y-2">
                <label class="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">Transmisión</label>
                <div class="flex flex-wrap gap-2">
                  <button 
                    (click)="clearTransmissionFilter()"
                    [ngClass]="[!(filters().transmission && filters().transmission!.length > 0) ? 'border-brand-primary bg-brand-primary text-white shadow-xs' : 'border-white/60 bg-white/40 text-brand-text-muted hover:border-brand-primary shadow-xs']"
                    class="px-4 py-2 rounded-full border text-xs font-bold transition-all cursor-pointer"
                  >
                    Todos
                  </button>
                  <button 
                    (click)="toggleTransmissionFilter('manual')"
                    [ngClass]="[isTransmissionSelected('manual') ? 'border-brand-primary bg-brand-primary text-white shadow-xs' : 'border-white/60 bg-white/40 text-brand-text-muted hover:border-brand-primary shadow-xs']"
                    class="px-4 py-2 rounded-full border text-xs font-bold transition-all cursor-pointer"
                  >
                    Manual
                  </button>
                  <button 
                    (click)="toggleTransmissionFilter('automatico')"
                    [ngClass]="[isTransmissionSelected('automatico') ? 'border-brand-primary bg-brand-primary text-white shadow-xs' : 'border-white/60 bg-white/40 text-brand-text-muted hover:border-brand-primary shadow-xs']"
                    class="px-4 py-2 rounded-full border text-xs font-bold transition-all cursor-pointer"
                  >
                    Automático
                  </button>
                </div>
              </div>
            </div>

          </div>
        </aside>

        <!-- Listado de Vehículos -->
        <section class="flex-grow">
          
          <!-- Encabezado de Resultados y Ordenamiento -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 relative z-20">
            <div>
              <h1 class="text-xl font-bold font-display text-brand-dark">Catálogo</h1>
              <p class="text-xs text-brand-text-muted mt-0.5">
                Mostrando {{ sortedVehicles().length }} vehículos disponibles
              </p>
            </div>

            <!-- Selector de Ordenamiento con Liquid Glass -->
            <div class="flex items-center gap-2 card-glass rounded-xl px-3 h-12 min-w-[260px] relative z-30">
              <span class="text-xs text-brand-text-muted whitespace-nowrap">Ordenar por:</span>
              <app-dropdown
                variant="plain"
                customClass="p-0! text-xs! font-bold"
                [options]="sortDropdownOptions"
                [value]="sortBy()"
                (valueChange)="onSortSelect($event)"
              ></app-dropdown>
            </div>
          </div>

          <!-- Grid de Resultados -->
          @if (loading()) {
            <!-- Shimmer Loader Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              @for (i of [1, 2, 3, 4, 5, 6]; track i) {
                <div class="bg-white/45 card-glass border border-slate-200 rounded-2xl overflow-hidden flex flex-col h-[320px] transition-all">
                  <div class="aspect-video bg-slate-200 shimmer-effect border-b border-white/20"></div>
                  <div class="p-4 flex-grow flex flex-col justify-between space-y-3">
                    <div class="space-y-2">
                      <div class="h-5 bg-slate-200 rounded-sm w-3/4 shimmer-effect"></div>
                      <div class="h-3.5 bg-slate-100 rounded-sm w-1/2 shimmer-effect"></div>
                    </div>
                    <div class="flex gap-2">
                      <div class="h-3.5 bg-slate-200 rounded-sm w-12 shimmer-effect"></div>
                      <div class="h-3.5 bg-slate-200 rounded-sm w-16 shimmer-effect"></div>
                    </div>
                    <div class="flex justify-between items-center pt-2">
                      <div class="h-5 bg-slate-200 rounded-sm w-24 shimmer-effect"></div>
                      <div class="h-4 bg-slate-200 rounded-sm w-12 shimmer-effect"></div>
                    </div>
                  </div>
                </div>
              }
            </div>
          } @else if (sortedVehicles().length === 0) {
            <!-- Estado Vacío Premium e Interactivo -->
            <div class="card-glass rounded-2xl py-12 px-6 text-center max-w-xl mx-auto space-y-6 bg-slate-100!">
              <div>
                <span class="material-symbols-outlined text-[54px] text-indigo-500 mb-2 block animate-pulse">search_off</span>
                <h3 class="font-display font-black text-base text-brand-dark mb-1">No hay resultados coincidentes</h3>
                <p class="text-brand-text-muted text-xs max-w-sm mx-auto leading-relaxed">
                  No pudimos encontrar vehículos para los criterios actuales. Intenta remover algunos filtros aplicados para ampliar tu búsqueda.
                </p>
              </div>

              <!-- Lista de filtros activos eliminables -->
              @if (activeFiltersList().length > 0) {
                <div class="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
                  @for (f of activeFiltersList(); track f.key) {
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-brand-primary">
                      {{ f.label }}
                      <button 
                        (click)="removeFilter(f.key)" 
                        class="material-symbols-outlined text-[12px] hover:bg-slate-150 rounded-full p-0.5 cursor-pointer text-indigo-400 hover:text-brand-primary transition-colors"
                      >
                        close
                      </button>
                    </span>
                  }
                </div>
              }

              <div class="flex justify-center gap-3 pt-2">
                <app-button variant="outline" (onClick)="clearAllFilters()">Restablecer Todo</app-button>
              </div>
            </div>
          } @else {
            <!-- Catálogo Grid (Stitch Style + Liquid Glass + Condición + Anticipo) -->
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              @for (car of sortedVehicles(); track car.id) {
                <div 
                  class="vehicle-card group card-glass overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 hover:border-brand-primary/40 flex flex-col cursor-pointer"
                  [routerLink]="['/vehicle', car.id]"
                >
                  <!-- Imagen -->
                  <div class="relative aspect-video overflow-hidden bg-slate-100/40 shimmer-effect">
                    <img 
                      [src]="car.images[0]" 
                      [alt]="car.brand + ' ' + car.model"
                      class="vehicle-image w-full h-full object-cover transition-transform duration-500 border-b border-white/20"
                      loading="lazy"
                    >
                    @if (car.isFeatured) {
                      <div class="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-md rounded-md text-[10px] font-bold text-brand-primary uppercase">
                        Novedad
                      </div>
                    }
                    
                    <!-- Badge de Condición (Nuevo / Usado) -->
                    <div 
                      class="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase text-white shadow-md"
                      [ngClass]="car.condition === 'nuevo' ? 'bg-emerald-500' : 'bg-slate-700'"
                    >
                      {{ car.condition }}
                    </div>
                  </div>

                  <!-- Datos -->
                  <div class="p-4 flex-grow flex flex-col justify-between space-y-4">
                    <div>
                      <div class="flex flex-col items-start gap-1 mb-2">
                        <h3 class="font-display font-bold text-base text-brand-dark group-hover:text-brand-primary transition-colors leading-tight">
                          {{ car.brand }} {{ car.model }}
                        </h3>
                        <span class="text-sm font-black text-brand-primary whitespace-nowrap">
                          {{ car.currency === 'ARS' ? '$' : 'USD' }} {{ car.price | number }}
                        </span>
                        @if (car.minDownPayment) {
                          <span class="text-[10px] font-bold text-brand-primary/80 mt-1 flex items-center gap-0.5">
                            <span class="material-symbols-outlined text-[12px]">payments</span>
                            Anticipo Mínimo: {{ car.currency === 'ARS' ? '$' : 'USD' }} {{ car.minDownPayment | number }}
                          </span>
                        }
                      </div>

                      <div class="flex items-center gap-3 text-brand-text-muted">
                        <!-- Año -->
                        <span class="flex items-center gap-1 text-xs">
                          <span class="material-symbols-outlined text-[16px] text-slate-400">calendar_today</span>
                          {{ car.year }}
                        </span>
                        <span class="text-slate-200">|</span>
                        <!-- KM -->
                        <span class="flex items-center gap-1 text-xs">
                          <span class="material-symbols-outlined text-[16px] text-slate-400">speed</span>
                          {{ car.kilometers | number }} km
                        </span>
                      </div>
                    </div>

                    <!-- Botón de Acción -->
                    <button 
                      class="w-full py-2.5 border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-semibold text-xs rounded-lg transition-all active:scale-[0.98] cursor-pointer"
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              }
            </div>
          }

        </section>
      </div>

      <!-- Sección de Contacto Breve (Liquid Glass) -->
      <section class="mt-20 border-t border-slate-200/50 pt-16">
        <div class="text-center mb-10">
          <h2 class="font-display font-extrabold text-2xl text-brand-dark">Contacto</h2>
          <p class="text-xs text-brand-text-muted mt-1">¿Interesado en algún modelo o financiación? Envíanos tu consulta.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch w-full">
          <!-- Columna Info -->
          <div class="md:col-span-5 flex flex-col justify-between p-6 card-glass rounded-2xl border border-slate-200/80 shadow-md bg-white/40">
            <div>
              <h3 class="font-display font-bold text-sm text-brand-dark mb-4">Información de Sucursal</h3>
              <div class="space-y-4">
                <a 
                  href="https://maps.google.com/?q=Av.+Bicentenario+1234,+Salta" 
                  target="_blank"
                  class="flex gap-2.5 items-start group/item cursor-pointer hover:text-brand-primary transition-colors"
                >
                  <span class="material-symbols-outlined text-[18px] text-brand-primary bg-blue-50 p-1.5 rounded-lg group-hover/item:bg-brand-primary group-hover/item:text-white transition-all">location_on</span>
                  <div>
                    <h4 class="text-[10px] font-bold text-brand-dark">Ubicación</h4>
                    <p class="text-xs text-brand-text-muted group-hover/item:text-brand-primary transition-colors">Av. Bicentenario 1234, Salta</p>
                  </div>
                </a>
                <a 
                  href="https://wa.me/5493871234567" 
                  target="_blank"
                  class="flex gap-2.5 items-start group/item cursor-pointer hover:text-brand-primary transition-colors"
                >
                  <span class="material-symbols-outlined text-[18px] text-brand-primary bg-blue-50 p-1.5 rounded-lg group-hover/item:bg-brand-primary group-hover/item:text-white transition-all">phone</span>
                  <div>
                    <h4 class="text-[10px] font-bold text-brand-dark">Teléfono</h4>
                    <p class="text-xs text-brand-text-muted group-hover/item:text-brand-primary transition-colors">+54 9 387 123-4567</p>
                  </div>
                </a>
                <div class="flex gap-2.5 items-start">
                  <span class="material-symbols-outlined text-[18px] text-brand-primary bg-blue-50 p-1.5 rounded-lg">schedule</span>
                  <div class="flex-grow">
                    <h4 class="text-[10px] font-bold text-brand-dark">Horarios</h4>
                    <div class="text-[10px] text-brand-text-muted mt-1 space-y-1">
                      <div class="flex items-center justify-between border-b border-slate-100/50 pb-0.5">
                        <span class="font-semibold text-brand-dark">Lun a Vie:</span>
                        <span>9-13 y 16-20 hs</span>
                      </div>
                      <div class="flex items-center justify-between">
                        <span class="font-semibold text-brand-dark">Sábados:</span>
                        <span>9-13 hs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <a 
              href="https://wa.me/5493871234567" 
              target="_blank" 
              class="mt-6 flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/10 transition-all active:scale-[0.98] cursor-pointer"
            >
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.59 1.977 14.113 1.96 12.01 1.96c-5.437 0-9.865 4.37-9.869 9.8.001 1.973.518 3.894 1.5 5.614l-.982 3.585 3.687-.965zm9.64-5.328c-.287-.144-1.702-.84-1.966-.935-.264-.096-.456-.144-.648.144-.192.288-.744.935-.912 1.127-.168.193-.336.216-.624.072-.288-.145-1.218-.45-2.32-1.432-.857-.764-1.436-1.708-1.604-1.996-.168-.288-.018-.444.126-.587.13-.13.288-.336.432-.504.144-.168.192-.288.288-.48.096-.192.048-.36-.024-.504-.072-.144-.648-1.56-.888-2.136-.234-.56-.47-.482-.648-.492-.168-.008-.36-.01-.552-.01-.192 0-.504.072-.768.36-.264.288-1.008.984-1.008 2.4s1.032 2.784 1.176 2.976c.144.192 2.032 3.102 4.921 4.347.687.296 1.224.473 1.64.605.69.22 1.32.19 1.816.116.552-.083 1.702-.696 1.942-1.37.24-.672.24-1.25.168-1.37-.072-.12-.264-.192-.552-.336z"/>
              </svg>
              WhatsApp Directo
            </a>
          </div>

          <!-- Columna Formulario -->
          <div class="hidden md:block md:col-span-7">
            <div class="card-glass p-6 rounded-2xl border border-slate-300 shadow-md bg-slate-100!">
              @if (submitSuccess()) {
                <!-- Success State Card -->
                <div class="flex flex-col items-center justify-center text-center py-6 px-4 space-y-3 animate-fade-in">
                  <div class="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-md shadow-emerald-500/10">
                    <span class="material-symbols-outlined text-[24px]">check_circle</span>
                  </div>
                  <h3 class="font-display font-bold text-sm text-brand-dark">¡Mensaje Recibido!</h3>
                  <p class="text-[11px] text-brand-text-muted max-w-xs leading-relaxed">
                    Tu consulta fue enviada con éxito. Un asesor de ventas se pondrá en contacto contigo a la brevedad.
                  </p>
                  <button 
                    type="button"
                    (click)="resetContactForm()" 
                    class="mt-3 px-4 py-2 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary font-bold text-[10px] rounded-lg transition-all active:scale-[0.98] cursor-pointer"
                  >
                    Enviar otra consulta
                  </button>
                </div>
              } @else {
                <form (submit)="onSubmitContact($event)" class="space-y-4">
                  <h3 class="font-display font-bold text-sm text-brand-dark">Envíanos tu consulta</h3>
                  
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="space-y-1">
                      <label class="text-[10px] font-bold text-brand-primary uppercase tracking-wider block">Nombre</label>
                      <input 
                        type="text" 
                        required
                        title="Este campo es obligatorio"
                        oninvalid="this.setCustomValidity('Por favor, ingresá tu nombre')" 
                        oninput="this.setCustomValidity('')"
                        placeholder="Ej. Juan Pérez" 
                        [disabled]="isSubmitting()"
                        class="w-full h-10 px-3 text-xs bg-white/40 border border-white/60 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-hidden transition-all text-slate-800 disabled:opacity-60"
                      >
                    </div>
                    <div class="space-y-1">
                      <label class="text-[10px] font-bold text-brand-primary uppercase tracking-wider block">Teléfono</label>
                      <input 
                        type="tel" 
                        required
                        title="Este campo es obligatorio"
                        oninvalid="this.setCustomValidity('Por favor, ingresá tu teléfono')" 
                        oninput="this.setCustomValidity('')"
                        placeholder="Ej. +54 387 1234567" 
                        [disabled]="isSubmitting()"
                        class="w-full h-10 px-3 text-xs bg-white/40 border border-white/60 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-hidden transition-all text-slate-800 disabled:opacity-60"
                      >
                    </div>
                  </div>

                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-brand-primary uppercase tracking-wider block">Mensaje o Consulta</label>
                    <textarea 
                      rows="3" 
                      required
                      title="Este campo es obligatorio"
                      oninvalid="this.setCustomValidity('Por favor, escribí tu consulta')" 
                      oninput="this.setCustomValidity('')"
                      placeholder="¿En qué vehículo estás interesado?" 
                      [disabled]="isSubmitting()"
                      class="w-full p-3 text-xs bg-white/40 border border-white/60 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-hidden transition-all text-slate-800 resize-none disabled:opacity-60"
                    ></textarea>
                  </div>

                  <div class="flex justify-end">
                    <button 
                      type="submit"
                      [disabled]="isSubmitting()"
                      class="bg-brand-primary hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 active:scale-95 cursor-pointer shadow-md shadow-indigo-500/20 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      @if (isSubmitting()) {
                        <div class="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        Enviando...
                      } @else {
                        Enviar Mensaje
                      }
                    </button>
                  </div>
                </form>
              }
            </div>
          </div>
        </div>
      </section>

    </div>
  `,
  styles: `
    .vehicle-card:hover .vehicle-image {
      transform: scale(1.05);
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(99, 102, 241, 0.2);
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(99, 102, 241, 0.4);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogComponent {
  private readonly vehicleService = inject(VehicleService);

  readonly filters = this.vehicleService.filters;
  readonly brands = this.vehicleService.brands;
  readonly loading = this.vehicleService.loading;

  readonly isMobileFiltersOpen = signal(false);

  toggleMobileFilters(): void {
    this.isMobileFiltersOpen.update(open => !open);
  }

  readonly activeFiltersList = computed(() => {
    const filters = this.filters();
    const list: { key: string; label: string }[] = [];
    if (filters.search) list.push({ key: 'search', label: `Búsqueda: "${filters.search}"` });
    
    if (filters.brand && filters.brand.length > 0) {
      list.push({ key: 'brand', label: `Marcas: ${filters.brand.join(', ')}` });
    }
    if (filters.year && filters.year.length > 0) {
      list.push({ key: 'year', label: `Años: ${filters.year.join(', ')}` });
    }
    if (filters.transmission && filters.transmission.length > 0) {
      const labels = filters.transmission.map(t => t === 'manual' ? 'Manual' : 'Automática');
      list.push({ key: 'transmission', label: `Caja: ${labels.join(', ')}` });
    }
    if (filters.condition && filters.condition.length > 0) {
      const labels = filters.condition.map(c => c === 'nuevo' ? '0 Km' : 'Usado');
      list.push({ key: 'condition', label: `Condición: ${labels.join(', ')}` });
    }
    if (filters.fuelType && filters.fuelType.length > 0) {
      const fuelLabels: Record<string, string> = { gasolina: 'Nafta', diesel: 'Diésel', gnc: 'GNC', hibrido: 'Híbrido', electrico: 'Eléctrico' };
      const labels = filters.fuelType.map(f => fuelLabels[f] || f);
      list.push({ key: 'fuelType', label: `Combustible: ${labels.join(', ')}` });
    }
    return list;
  });

  removeFilter(key: string): void {
    this.vehicleService.updateFilters({ [key]: undefined });
  }

  readonly sortBy = signal<'recent' | 'price-asc' | 'price-desc' | 'year-desc'>('recent');

  readonly sortedVehiclesComputed = this.vehicleService.filteredVehicles;

  readonly years = computed(() => {
    const yearsSet = new Set(this.vehicleService.vehicles().map(v => v.year));
    return Array.from(yearsSet).sort((a, b) => b - a);
  });

  readonly maxPriceLimit = computed(() => {
    const prices = this.vehicleService.vehicles().map(v => v.price);
    return prices.length > 0 ? Math.max(...prices) : 100000000;
  });

  readonly sortedVehicles = computed(() => {
    const list = [...this.sortedVehiclesComputed()];
    const order = this.sortBy();
    
    if (order === 'price-asc') {
      return list.sort((a, b) => a.price - b.price);
    } else if (order === 'price-desc') {
      return list.sort((a, b) => b.price - a.price);
    } else if (order === 'year-desc') {
      return list.sort((a, b) => b.year - a.year);
    }
    return list;
  });

  readonly hasActiveFilters = computed(() => {
    const f = this.filters();
    return !!(f.search || f.brand || f.transmission || f.condition || f.minPrice || f.maxPrice || f.fuelType || f.year);
  });

  readonly brandDropdownOptions = computed<DropdownOption[]>(() => {
    return this.brands().map(b => ({ value: b, label: b }));
  });

  readonly fuelDropdownOptions: DropdownOption[] = [
    { value: 'gasolina', label: 'Nafta' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'gnc', label: 'GNC' },
    { value: 'electrico', label: 'Eléctrico' },
    { value: 'hibrido', label: 'Híbrido' }
  ];

  readonly yearDropdownOptions = computed<DropdownOption[]>(() => {
    return this.years().map(y => ({ value: y, label: String(y) }));
  });

  readonly sortDropdownOptions: DropdownOption[] = [
    { value: 'recent', label: 'Novedades' },
    { value: 'price-asc', label: 'Precio: Menor a Mayor' },
    { value: 'price-desc', label: 'Precio: Mayor a Menor' },
    { value: 'year-desc', label: 'Año: Más Nuevos' }
  ];

  onSearchChange(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.vehicleService.updateFilters({ search: query });
  }

  onMinPriceChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.vehicleService.updateFilters({ minPrice: val ? Number(val) : undefined });
  }

  onMaxPriceChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.vehicleService.updateFilters({ maxPrice: val ? Number(val) : undefined });
  }

  onMaxPriceSliderChange(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    this.vehicleService.updateFilters({ maxPrice: val });
  }

  onSortSelect(val: any): void {
    this.sortBy.set(val);
  }

  readonly fuelOptions = [
    { value: 'gasolina', label: 'Nafta' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'gnc', label: 'GNC' },
    { value: 'electrico', label: 'Eléctrico' },
    { value: 'hibrido', label: 'Híbrido' }
  ];

  isBrandSelected(brand: string): boolean {
    return (this.filters().brand || []).includes(brand);
  }

  toggleBrandFilter(brand: string): void {
    const cur = this.filters().brand || [];
    const updated = cur.includes(brand) ? cur.filter(b => b !== brand) : [...cur, brand];
    this.vehicleService.updateFilters({ brand: updated.length > 0 ? updated : undefined });
  }

  isFuelTypeSelected(fuel: any): boolean {
    return (this.filters().fuelType || []).includes(fuel);
  }

  toggleFuelTypeFilter(fuel: any): void {
    const cur = this.filters().fuelType || [];
    const updated = cur.includes(fuel) ? cur.filter(f => f !== fuel) : [...cur, fuel];
    this.vehicleService.updateFilters({ fuelType: updated.length > 0 ? updated : undefined });
  }

  isYearSelected(year: number): boolean {
    return (this.filters().year || []).includes(year);
  }

  toggleYearFilter(year: number): void {
    const cur = this.filters().year || [];
    const updated = cur.includes(year) ? cur.filter(y => y !== year) : [...cur, year];
    this.vehicleService.updateFilters({ year: updated.length > 0 ? updated : undefined });
  }

  isConditionSelected(cond: any): boolean {
    return (this.filters().condition || []).includes(cond);
  }

  toggleConditionFilter(cond: any): void {
    const cur = this.filters().condition || [];
    const updated = cur.includes(cond) ? cur.filter(c => c !== cond) : [...cur, cond];
    this.vehicleService.updateFilters({ condition: updated.length > 0 ? updated : undefined });
  }

  clearConditionFilter(): void {
    this.vehicleService.updateFilters({ condition: undefined });
  }

  isTransmissionSelected(trans: any): boolean {
    return (this.filters().transmission || []).includes(trans);
  }

  toggleTransmissionFilter(trans: any): void {
    const cur = this.filters().transmission || [];
    const updated = cur.includes(trans) ? cur.filter(t => t !== trans) : [...cur, trans];
    this.vehicleService.updateFilters({ transmission: updated.length > 0 ? updated : undefined });
  }

  clearTransmissionFilter(): void {
    this.vehicleService.updateFilters({ transmission: undefined });
  }

  clearAllFilters(): void {
    this.vehicleService.clearFilters();
  }

  readonly isSubmitting = signal(false);
  readonly submitSuccess = signal(false);

  onSubmitContact(event: Event): void {
    event.preventDefault();
    this.isSubmitting.set(true);
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.submitSuccess.set(true);
      (event.target as HTMLFormElement).reset();
    }, 1500);
  }

  resetContactForm(): void {
    this.submitSuccess.set(false);
  }
}
