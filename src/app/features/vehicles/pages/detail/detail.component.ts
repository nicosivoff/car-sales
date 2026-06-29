import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { BadgeComponent } from '@shared/components/badge/badge.component';

type Tab = 'desc' | 'specs' | 'features';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, BadgeComponent],
  template: `
    @if (car()) {
      <div class="max-w-7xl mx-auto px-6 py-6 pb-24 font-body">
        
        <!-- Breadcrumb (Migas de Pan) -->
        <nav class="flex text-xs font-semibold text-brand-text-muted gap-1.5 items-center mb-6">
          <a class="hover:text-brand-primary cursor-pointer" routerLink="/">Inicio</a>
          <span class="material-symbols-outlined text-[14px]">chevron_right</span>
          <a class="hover:text-brand-primary cursor-pointer" routerLink="/catalog">Inventario</a>
          <span class="material-symbols-outlined text-[14px]">chevron_right</span>
          <span class="text-slate-400">{{ car()!.brand }}</span>
          <span class="material-symbols-outlined text-[14px]">chevron_right</span>
          <span class="text-brand-dark">{{ car()!.brand }} {{ car()!.model }}</span>
        </nav>

        <!-- Cuadrícula de Contenido Principal -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- Contenido Izquierdo (Galería y Especificaciones) -->
          <div class="lg:col-span-8 space-y-6">
             <!-- Galería de fotos (Stitch Style + Liquid Glass + Shimmer) -->
            <section class="space-y-2">
              <div 
                (click)="openPreview(activeImageIndex())"
                class="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100/30 border border-white/20 shadow-xs shimmer-effect cursor-zoom-in"
              >
                <img 
                  [src]="activeImage()" 
                  [alt]="car()!.brand + ' ' + car()!.model + ' Vista Principal'" 
                  class="w-full h-full object-cover"
                >
                <div 
                  (click)="openPreview(activeImageIndex()); $event.stopPropagation()"
                  class="absolute right-4 bottom-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold text-slate-800 shadow-lg cursor-pointer hover:bg-white transition-colors"
                >
                  <span class="material-symbols-outlined text-[18px]">photo_library</span>
                  Ver {{ car()!.images.length }} Fotos
                </div>
              </div>

              <!-- Miniaturas -->
              @if (car()!.images.length > 1) {
                <div class="grid grid-cols-4 gap-2">
                  @for (img of car()!.images; track img; let idx = $index) {
                    <div 
                      (click)="setActiveImageIndex(idx)"
                      [ngClass]="[activeImageIndex() === idx ? 'ring-2 ring-brand-primary opacity-100' : 'opacity-70 hover:opacity-100']"
                      class="aspect-[4/3] rounded-xl overflow-hidden border border-white/25 cursor-pointer transition-all bg-slate-100/20 shimmer-effect"
                    >
                      <img [src]="img" class="w-full h-full object-cover">
                    </div>
                  }
                </div>
              }
            </section>

            <!-- Ficha Detallada (Liquid Glass) -->
            <section class="card-glass p-6 rounded-2xl">
              <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 class="font-display font-extrabold text-2xl md:text-3xl text-brand-dark tracking-tight leading-tight">
                    {{ car()!.year }} {{ car()!.brand }} {{ car()!.model }}
                  </h1>
                  <p class="text-xs font-bold text-brand-text-muted mt-1">
                    Stock: LX-{{ car()!.id }} • {{ car()!.kilometers | number }} km • Condición: <span class="capitalize">{{ car()!.condition }}</span>
                  </p>
                </div>
                <div class="md:text-right">
                  <p class="font-display font-black text-2xl md:text-3xl text-brand-primary">
                    {{ car()!.currency === 'ARS' ? '$' : 'USD' }} {{ car()!.price | number }}
                  </p>
                  @if (car()!.minDownPayment) {
                    <p class="text-xs font-bold text-brand-primary mt-1">
                      Anticipo Mínimo: {{ car()!.currency === 'ARS' ? '$' : 'USD' }} {{ car()!.minDownPayment | number }}
                    </p>
                  }
                </div>
              </div>
            </section>

            <!-- Barra de Especificaciones Rápidas (Liquid Glass) -->
            <section class="card-glass p-6 rounded-2xl grid grid-cols-3 gap-4">
              <div class="text-center space-y-1">
                <p class="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider">Kilometraje</p>
                <p class="text-base font-extrabold text-brand-dark">{{ car()!.kilometers | number }} km</p>
              </div>
              <div class="text-center space-y-1 border-x border-white/35">
                <p class="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider">Transmisión</p>
                <p class="text-base font-extrabold text-brand-dark capitalize">{{ car()!.transmission }}</p>
              </div>
              <div class="text-center space-y-1">
                <p class="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider">Combustible</p>
                <p class="text-base font-extrabold text-brand-dark capitalize">{{ car()!.fuelType }}</p>
              </div>
            </section>

            <!-- Contenido por Pestañas (Liquid Glass) -->
            <section class="card-glass p-6 rounded-2xl">
              <div class="flex gap-6 border-b border-white/20 mb-4">
                <button 
                  (click)="setActiveTab('desc')"
                  [ngClass]="[activeTab() === 'desc' ? 'text-brand-primary border-b-2 border-brand-primary pb-3 font-bold' : 'text-brand-text-muted hover:text-brand-primary pb-3 font-semibold']"
                  class="text-sm transition-all cursor-pointer"
                >
                  Descripción
                </button>
                <button 
                  (click)="setActiveTab('specs')"
                  [ngClass]="[activeTab() === 'specs' ? 'text-brand-primary border-b-2 border-brand-primary pb-3 font-bold' : 'text-brand-text-muted hover:text-brand-primary pb-3 font-semibold']"
                  class="text-sm transition-all cursor-pointer"
                >
                  Ficha Técnica
                </button>
                <button 
                  (click)="setActiveTab('features')"
                  [ngClass]="[activeTab() === 'features' ? 'text-brand-primary border-b-2 border-brand-primary pb-3 font-bold' : 'text-brand-text-muted hover:text-brand-primary pb-3 font-semibold']"
                  class="text-sm transition-all cursor-pointer"
                >
                  Equipamiento
                </button>
              </div>

              <!-- Contenido: Descripción -->
              @if (activeTab() === 'desc') {
                <div class="space-y-4">
                  <p class="text-sm leading-relaxed text-brand-text-muted">
                    Este ejemplar de {{ car()!.brand }} {{ car()!.model }} modelo {{ car()!.year }} se encuentra en un estado impecable. 
                    Se entrega con toda la documentación oficial al día, verificado mecánicamente en nuestro taller asociado, 
                    y con todos los servicios realizados a tiempo. Un auto diseñado para dar el máximo rendimiento y el mayor confort.
                  </p>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                    <div class="bg-white/40 p-4 rounded-xl border border-white/40">
                      <p class="text-[10px] font-bold text-brand-text-muted uppercase">Combustible</p>
                      <p class="text-sm font-extrabold text-brand-dark capitalize">{{ car()!.fuelType }}</p>
                    </div>
                    <div class="bg-white/40 p-4 rounded-xl border border-white/40">
                      <p class="text-[10px] font-bold text-brand-text-muted uppercase">Caja</p>
                      <p class="text-sm font-extrabold text-brand-dark capitalize">{{ car()!.transmission }}</p>
                    </div>
                    <div class="bg-white/40 p-4 rounded-xl border border-white/40">
                      <p class="text-[10px] font-bold text-brand-text-muted uppercase">Año</p>
                      <p class="text-sm font-extrabold text-brand-dark">{{ car()!.year }}</p>
                    </div>
                    <div class="bg-white/40 p-4 rounded-xl border border-white/40">
                      <p class="text-[10px] font-bold text-brand-text-muted uppercase font-display">Procedencia</p>
                      <p class="text-sm font-extrabold text-brand-dark">Nacional</p>
                    </div>
                  </div>
                </div>
              }

              <!-- Contenido: Ficha Técnica -->
              @if (activeTab() === 'specs') {
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm pt-2">
                  <div class="flex justify-between py-2 border-b border-white/20">
                    <span class="text-brand-text-muted">Motor</span>
                    <span class="font-bold text-brand-dark">Motorización estándar de serie</span>
                  </div>
                  <div class="flex justify-between py-2 border-b border-white/20">
                    <span class="text-brand-text-muted">Tracción</span>
                    <span class="font-bold text-brand-dark">Tracción estándar</span>
                  </div>
                  <div class="flex justify-between py-2 border-b border-white/20">
                    <span class="text-brand-text-muted">Color Exterior</span>
                    <span class="font-bold text-brand-dark">Gris / Negro / Blanco / Azul</span>
                  </div>
                  <div class="flex justify-between py-2 border-b border-white/20">
                    <span class="text-brand-text-muted">Tapizado</span>
                    <span class="font-bold text-brand-dark">Tela / Cuero</span>
                  </div>
                </div>
              }

              <!-- Contenido: Equipamiento -->
              @if (activeTab() === 'features') {
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <ul class="space-y-2">
                    <li class="flex items-center gap-2 text-sm text-brand-text-muted">
                      <span class="material-symbols-outlined text-brand-primary text-base">check_circle</span>
                      Techo solar corredizo
                    </li>
                    <li class="flex items-center gap-2 text-sm text-brand-text-muted">
                      <span class="material-symbols-outlined text-brand-primary text-base">check_circle</span>
                      Cámara de retroceso y sensores traseros
                    </li>
                    <li class="flex items-center gap-2 text-sm text-brand-text-muted">
                      <span class="material-symbols-outlined text-brand-primary text-base">check_circle</span>
                      Apple CarPlay & Android Auto inalámbrico
                    </li>
                  </ul>
                  <ul class="space-y-2">
                    <li class="flex items-center gap-2 text-sm text-brand-text-muted">
                      <span class="material-symbols-outlined text-brand-primary text-base">check_circle</span>
                      Control de velocidad crucero adaptativo
                    </li>
                    <li class="flex items-center gap-2 text-sm text-brand-text-muted">
                      <span class="material-symbols-outlined text-brand-primary text-base">check_circle</span>
                      Asientos climatizados delanteros
                    </li>
                  </ul>
                </div>
              }
            </section>
          </div>

          <!-- Barra Lateral Derecha Fija (Stitch Style + Liquid Glass) -->
          <div class="lg:col-span-4">
            <div class="sticky top-24 space-y-6">
              
              <!-- Tarjeta de Contacto / Formulario -->
              <div class="card-glass p-6 rounded-2xl">
                
                <!-- Info Concesionaria -->
                <div class="flex items-center gap-4 mb-6">
                  <div class="w-12 h-12 bg-blue-50/50 border border-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary font-black text-lg">
                    LM
                  </div>
                  <div>
                    <h3 class="font-bold text-sm text-brand-dark">LuxeMotors Central</h3>
                    <p class="text-xs text-brand-text-muted flex items-center gap-1 mt-0.5">
                      <span class="material-symbols-outlined text-[14px]">location_on</span>
                      Av. del Libertador 4200
                    </p>
                  </div>
                </div>

                <!-- Bloque de Precio y Financiación -->
                <div class="mb-6 pb-6 border-b border-white/20">
                  <span class="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider block mb-1">Precio de venta</span>
                  <div class="text-2xl font-black text-brand-primary">{{ car()!.currency === 'ARS' ? '$' : 'USD' }} {{ car()!.price | number }}</div>
                  @if (car()!.minDownPayment) {
                    <div class="mt-2 text-xs font-bold text-slate-600 bg-white/40 p-2.5 rounded-xl border border-white/40">
                      Anticipo Mínimo: {{ car()!.currency === 'ARS' ? '$' : 'USD' }} {{ car()!.minDownPayment | number }}
                    </div>
                  }
                </div>

                <!-- Acciones Rápidas -->
                <div class="space-y-3">
                  <!-- Botón WhatsApp -->
                  <button 
                    type="button"
                    (click)="contactWhatsApp()"
                    class="w-full h-12 bg-emerald-500 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all active:scale-[0.98] cursor-pointer shadow-md"
                  >
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.59 1.977 14.113 1.96 12.01 1.96c-5.437 0-9.865 4.37-9.869 9.8.001 1.973.518 3.894 1.5 5.614l-.982 3.585 3.687-.965zm9.64-5.328c-.287-.144-1.702-.84-1.966-.935-.264-.096-.456-.144-.648.144-.192.288-.744.935-.912 1.127-.168.193-.336.216-.624.072-.288-.145-1.218-.45-2.32-1.432-.857-.764-1.436-1.708-1.604-1.996-.168-.288-.018-.444.126-.587.13-.13.288-.336.432-.504.144-.168.192-.288.288-.48.096-.192.048-.36-.024-.504-.072-.144-.648-1.56-.888-2.136-.234-.56-.47-.482-.648-.492-.168-.008-.36-.01-.552-.01-.192 0-.504.072-.768.36-.264.288-1.008.984-1.008 2.4s1.032 2.784 1.176 2.976c.144.192 2.032 3.102 4.921 4.347.687.296 1.224.473 1.64.605.69.22 1.32.19 1.816.116.552-.083 1.702-.696 1.942-1.37.24-.672.24-1.25.168-1.37-.072-.12-.264-.192-.552-.336z"/>
                    </svg>
                    Mensaje por WhatsApp
                  </button>

                  <!-- Botón Comparar -->
                  <button 
                    type="button"
                    (click)="startComparison()"
                    class="w-full h-12 border border-brand-primary text-brand-primary hover:bg-brand-primary/5 font-semibold text-sm rounded-xl transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span class="material-symbols-outlined text-[20px]">compare_arrows</span>
                    Comparar Vehículo
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Sección de Comparación -->
        @if (isComparing()) {
          <section id="comparison-section" class="mt-12 max-w-4xl mx-auto card-glass p-5 rounded-2xl border border-brand-primary/10 shadow-lg animate-fade-in">
            <div class="flex justify-between items-center mb-4">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-brand-primary bg-blue-50 border border-brand-primary/10 px-2.5 py-0.5 rounded-full mb-2 inline-block">Comparador</span>
                <h2 class="font-display font-extrabold text-xl text-brand-dark">Comparación de Vehículos</h2>
              </div>
              <button 
                (click)="stopComparison()"
                class="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
              >
                <span class="material-symbols-outlined text-sm">close</span>
                Cerrar
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
              <!-- Vehículo Actual -->
              <div class="bg-white/40 border border-white/60 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <img [src]="car()!.images[0]" class="w-full aspect-video object-cover rounded-lg mb-3 border border-white/20">
                  <h3 class="font-display font-extrabold text-sm text-brand-dark">{{ car()!.brand }} {{ car()!.model }}</h3>
                  <span class="inline-block mt-1 px-2 py-0.5 bg-brand-primary/10 text-brand-primary text-[9px] font-bold uppercase rounded">Este Auto</span>
                </div>
                <div class="mt-6 space-y-3 pt-6 border-t border-slate-200/50 text-xs">
                  <div class="flex justify-between"><span class="text-slate-500">Precio</span><span class="font-black text-brand-primary">USD {{ car()!.price | number }}</span></div>
                  <div class="flex justify-between"><span class="text-slate-500">Año</span><span class="font-bold text-slate-800">{{ car()!.year }}</span></div>
                  <div class="flex justify-between"><span class="text-slate-500">Kilómetros</span><span class="font-bold text-slate-800">{{ car()!.kilometers | number }} km</span></div>
                  <div class="flex justify-between"><span class="text-slate-500">Caja</span><span class="font-bold text-slate-800 capitalize">{{ car()!.transmission }}</span></div>
                  <div class="flex justify-between"><span class="text-slate-500">Combustible</span><span class="font-bold text-slate-800 capitalize">{{ car()!.fuelType }}</span></div>
                </div>
              </div>

              <!-- Selector / Sugeridos o Vehículo Seleccionado -->
              <div class="md:col-span-2 bg-white/60 border border-white/80 p-4 rounded-xl flex flex-col justify-between">
                @if (comparisonVehicle()) {
                  <!-- Mostrar el auto seleccionado para comparar -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full items-stretch">
                    <div class="flex flex-col justify-between">
                      <div>
                        <img [src]="comparisonVehicle()!.images[0]" class="w-full aspect-video object-cover rounded-xl mb-4 border border-white/20">
                        <h3 class="font-display font-extrabold text-sm text-brand-dark">{{ comparisonVehicle()!.brand }} {{ comparisonVehicle()!.model }}</h3>
                        <button 
                          (click)="selectComparisonVehicle(null)"
                          class="text-[10px] text-brand-primary font-bold hover:underline mt-2 flex items-center gap-1 cursor-pointer"
                        >
                          <span class="material-symbols-outlined text-xs">swap_horiz</span>
                          Cambiar auto
                        </button>
                      </div>
                      <div class="mt-6 space-y-3 pt-6 border-t border-slate-200/50 text-xs">
                        <div class="flex justify-between"><span class="text-slate-500">Precio</span><span class="font-black text-brand-primary">USD {{ comparisonVehicle()!.price | number }}</span></div>
                        <div class="flex justify-between"><span class="text-slate-500">Año</span><span class="font-bold text-slate-800">{{ comparisonVehicle()!.year }}</span></div>
                        <div class="flex justify-between"><span class="text-slate-500">Kilómetros</span><span class="font-bold text-slate-800">{{ comparisonVehicle()!.kilometers | number }} km</span></div>
                        <div class="flex justify-between"><span class="text-slate-500">Caja</span><span class="font-bold text-slate-800 capitalize">{{ comparisonVehicle()!.transmission }}</span></div>
                        <div class="flex justify-between"><span class="text-slate-500">Combustible</span><span class="font-bold text-slate-800 capitalize">{{ comparisonVehicle()!.fuelType }}</span></div>
                      </div>
                    </div>
                    <!-- Comparación Analítica Rápida -->
                    <div class="bg-brand-primary/5 p-4 rounded-xl border border-brand-primary/10 flex flex-col justify-between">
                      <h4 class="text-xs font-bold text-brand-primary uppercase tracking-wider mb-4">Análisis Comparativo</h4>
                      <div class="space-y-4 text-xs">
                        <!-- Comparación de Precio -->
                        <div>
                          <p class="font-bold text-slate-700">Diferencia de Precio</p>
                          <p class="text-[11px] text-slate-600 mt-1 leading-normal">
                            @if (car()!.price === comparisonVehicle()!.price) {
                              Tienen el mismo precio.
                            } @else if (car()!.price < comparisonVehicle()!.price) {
                              El {{ car()!.brand }} es <strong class="text-emerald-600">USD {{ (comparisonVehicle()!.price - car()!.price) | number }} más barato</strong> que el {{ comparisonVehicle()!.brand }}.
                            } @else {
                              El {{ car()!.brand }} es <strong>USD {{ (car()!.price - comparisonVehicle()!.price) | number }} más caro</strong> que el {{ comparisonVehicle()!.brand }}.
                            }
                          </p>
                        </div>
                        <!-- Comparación de KM -->
                        <div>
                          <p class="font-bold text-slate-700">Diferencia de Kilómetros</p>
                          <p class="text-[11px] text-slate-600 mt-1 leading-normal">
                            @if (car()!.kilometers === comparisonVehicle()!.kilometers) {
                              Tienen el mismo kilometraje.
                            } @else if (car()!.kilometers < comparisonVehicle()!.kilometers) {
                              El {{ car()!.brand }} tiene <strong class="text-emerald-600">{{ (comparisonVehicle()!.kilometers - car()!.kilometers) | number }} km menos</strong>.
                            } @else {
                              El {{ car()!.brand }} tiene <strong>{{ (car()!.kilometers - comparisonVehicle()!.kilometers) | number }} km más</strong>.
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                } @else {
                  <!-- Sugerencias para comparar -->
                  <div class="flex flex-col justify-between h-full">
                    <div>
                      <h4 class="text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">Selecciona un auto similar para comparar</h4>
                      <p class="text-xs text-slate-500 mb-6">Hemos seleccionado los siguientes vehículos del catálogo similares por tipo de marca o precio:</p>
                      
                      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        @for (sim of similarVehicles(); track sim.id) {
                          <div 
                            (click)="selectComparisonVehicle(sim)"
                            class="bg-white border border-slate-200 p-3.5 rounded-xl hover:shadow-lg hover:border-brand-primary/30 transition-all cursor-pointer flex flex-col justify-between group"
                          >
                            <img [src]="sim.images[0]" class="w-full aspect-video object-cover rounded-lg mb-2">
                            <div class="flex-grow flex flex-col justify-between">
                              <h5 class="font-bold text-xs text-brand-dark group-hover:text-brand-primary transition-colors leading-tight mb-1">{{ sim.brand }} {{ sim.model }}</h5>
                              <p class="text-[10px] font-black text-brand-primary">USD {{ sim.price | number }}</p>
                            </div>
                            <span class="text-[9px] font-bold text-brand-primary mt-3 flex items-center gap-0.5 hover:underline">
                              Seleccionar
                              <span class="material-symbols-outlined text-[10px]">chevron_right</span>
                            </span>
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </section>
        }


        <!-- Image Preview Lightbox Overlay -->
        @if (isPreviewOpen()) {
          <div 
            class="fixed inset-0 z-100 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md transition-opacity duration-300 select-none"
            (click)="closePreview()"
          >
            <!-- Close Button -->
            <button 
              (click)="closePreview()" 
              class="absolute top-6 right-6 text-white hover:text-brand-primary p-2 transition-colors cursor-pointer"
            >
              <span class="material-symbols-outlined text-[32px]">close</span>
            </button>

            <!-- Navigation Buttons -->
            <button 
              (click)="prevImage($event)" 
              class="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white hover:text-brand-primary p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all cursor-pointer select-none"
            >
              <span class="material-symbols-outlined text-[32px]">chevron_left</span>
            </button>

            <button 
              (click)="nextImage($event)" 
              class="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white hover:text-brand-primary p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all cursor-pointer select-none"
            >
              <span class="material-symbols-outlined text-[32px]">chevron_right</span>
            </button>

            <!-- Main Image Wrapper -->
            <div 
              class="w-full max-w-5xl px-4 md:px-12 aspect-[16/9] flex items-center justify-center"
              (click)="$event.stopPropagation()"
            >
              <img 
                [src]="car()!.images[previewImageIndex()]" 
                class="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl transition-all duration-300"
              >
            </div>

            <!-- Position counter -->
            <div class="text-white/60 font-bold text-xs mt-6">
              {{ previewImageIndex() + 1 }} / {{ car()!.images.length }}
            </div>

            <!-- Bottom thumbnails in preview -->
            @if (car()!.images.length > 1) {
              <div 
                class="flex gap-2.5 mt-6 px-4 py-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 max-w-md overflow-x-auto justify-center"
                (click)="$event.stopPropagation()"
              >
                @for (img of car()!.images; track img; let idx = $index) {
                  <div 
                    (click)="setPreviewImageIndex(idx)"
                    [ngClass]="[previewImageIndex() === idx ? 'ring-2 ring-brand-primary opacity-100' : 'opacity-50 hover:opacity-100']"
                    class="w-16 h-12 rounded-lg overflow-hidden border border-white/20 cursor-pointer transition-all flex-shrink-0"
                  >
                    <img [src]="img" class="w-full h-full object-cover">
                  </div>
                }
              </div>
            }
          </div>
        }

      </div>
    } @else {
      <!-- Auto No Encontrado -->
      <div class="max-w-7xl mx-auto px-6 py-24 text-center">
        <h2 class="font-display font-extrabold text-xl text-brand-dark mb-4">El vehículo solicitado no existe</h2>
        <a routerLink="/catalog" class="text-brand-primary font-bold hover:underline">Volver al catálogo</a>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly vehicleService = inject(VehicleService);

  readonly isComparing = signal(false);
  readonly comparisonVehicle = signal<any | null>(null);

  readonly carId = signal<string | null>(this.route.snapshot.paramMap.get('id'));
  readonly car = computed(() => {
    const id = this.carId();
    return id ? this.vehicleService.getVehicleById(id) : undefined;
  });

  readonly similarVehicles = computed(() => {
    const current = this.car();
    if (!current) return [];
    return this.vehicleService.vehicles()
      .filter(v => v.id !== current.id && (v.brand === current.brand || Math.abs(v.price - current.price) < current.price * 0.4))
      .slice(0, 3);
  });

  startComparison(): void {
    this.isComparing.set(true);
    setTimeout(() => {
      const el = document.getElementById('comparison-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  stopComparison(): void {
    this.isComparing.set(false);
    this.comparisonVehicle.set(null);
  }

  selectComparisonVehicle(vehicle: any): void {
    this.comparisonVehicle.set(vehicle);
  }

  readonly activeImageIndex = signal(0);
  readonly activeImage = computed(() => {
    const carData = this.car();
    if (!carData || carData.images.length === 0) {
      return 'assets/placeholder-car.jpg';
    }
    return carData.images[this.activeImageIndex()];
  });

  readonly activeTab = signal<Tab>('desc');

  setActiveImageIndex(index: number): void {
    this.activeImageIndex.set(index);
  }

  setActiveTab(tab: Tab): void {
    this.activeTab.set(tab);
  }

  contactWhatsApp(): void {
    const carData = this.car();
    if (!carData) return;

    const text = `Hola! Estoy interesado en el vehículo ${carData.brand} ${carData.model} (Año ${carData.year}) que vi en su catálogo. ¿Sigue disponible?`;
    const whatsappUrl = `https://wa.me/5491100000000?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  }

  readonly isPreviewOpen = signal(false);
  readonly previewImageIndex = signal(0);

  openPreview(index: number): void {
    this.previewImageIndex.set(index);
    this.isPreviewOpen.set(true);
  }

  closePreview(): void {
    this.isPreviewOpen.set(false);
  }

  setPreviewImageIndex(index: number): void {
    this.previewImageIndex.set(index);
  }

  prevImage(event: Event): void {
    event.stopPropagation();
    const carData = this.car();
    if (!carData) return;
    const len = carData.images.length;
    this.previewImageIndex.update(idx => (idx - 1 + len) % len);
  }

  nextImage(event: Event): void {
    event.stopPropagation();
    const carData = this.car();
    if (!carData) return;
    const len = carData.images.length;
    this.previewImageIndex.update(idx => (idx + 1) % len);
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
