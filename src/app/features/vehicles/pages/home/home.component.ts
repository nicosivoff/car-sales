import { ChangeDetectionStrategy, Component, computed, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { BadgeComponent } from '@shared/components/badge/badge.component';
import { DropdownComponent, DropdownOption } from '@shared/components/dropdown/dropdown.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, BadgeComponent, DropdownComponent],
  template: `
    <div class="font-body text-brand-dark antialiased bg-brand-surface/30">
      
      <!-- Hero Section (Stitch Style + Glassmorphism + Background Image with Zoom & Parallax) -->
      <header class="relative z-10 w-full min-h-[650px] flex items-center justify-center py-20">
        <!-- Background Container restricted to prevent spill -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none rounded-b-[24px]">
          <div 
            class="absolute inset-0 bg-cover bg-center"
            style="background-image: linear-gradient(rgba(25, 28, 30, 0.75), rgba(25, 28, 30, 0.85)), url('https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1600')"
          ></div>
        </div>
        <!-- Decoraciones de fondo para acentuar el brillo detrás del Glassmorphism -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          <h1 class="font-display font-extrabold text-4xl md:text-6xl max-w-4xl mb-6 tracking-tight text-white leading-tight">
            Tu próximo auto está acá
          </h1>
          <p class="text-base md:text-lg text-slate-300 max-w-2xl mb-12 font-medium">
            Buscá, compará y elegí el auto ideal para vos de la manera más fácil y rápida.
          </p>

          <!-- Buscador con Glassmorphism Blanco Brillante de Alto Contraste contra Fondo Oscuro -->
          <div class="w-full max-w-4xl bg-white/85 backdrop-blur-xl border border-white/50 p-4 rounded-2xl flex flex-col md:flex-row gap-2 shadow-2xl transition-all duration-300 hover:border-white/80 relative z-20">
            <!-- Selección de Marca -->
            <div class="flex-1 flex flex-col items-start px-4 border-r-0 md:border-r border-slate-200/50 py-1 text-left justify-center min-w-[200px] relative z-30">
              <app-dropdown
                label="Marca"
                placeholder="Cualquier marca"
                variant="plain"
                customClass="p-0! text-base! font-bold"
                heightClass="h-auto"
                [options]="brandDropdownOptions()"
                [value]="selectedBrand()"
                (valueChange)="onBrandSelect($event)"
                [showNoneOption]="true"
                noneLabel="Cualquier marca"
              ></app-dropdown>
            </div>

            <!-- Entrada de Modelo -->
            <div class="flex-1 flex flex-col items-start px-4 border-r-0 md:border-r border-slate-200/50 py-1.5 text-left">
              <span class="text-[10px] font-bold text-brand-primary uppercase tracking-wider mb-1">Modelo</span>
              <input 
                type="text" 
                (input)="onModelChange($event)"
                placeholder="Ej. Corolla..." 
                class="w-full bg-transparent border-0 focus:ring-0 text-base font-bold text-brand-dark p-0 placeholder-slate-400 outline-hidden focus:outline-hidden"
              >
            </div>

            <button 
              (click)="searchCars()"
              class="bg-brand-primary hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-md shadow-indigo-500/20"
            >
              <span class="material-symbols-outlined text-[18px]">search</span>
              Buscar
            </button>
          </div>
        </div>
      </header>

      <!-- Accesos Rápidos (Botones de Acceso Directo) -->
      <section class="relative z-20 -mt-8 max-w-4xl mx-auto px-6 mb-16">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Catalogo -->
          <a 
            routerLink="/catalog"
            class="flex items-center justify-between p-5 bg-white border border-brand-surface-container rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                <span class="material-symbols-outlined text-[24px]">directions_car</span>
              </div>
              <div class="text-left">
                <h3 class="font-display font-bold text-sm text-brand-dark">Ver Catálogo</h3>
                <p class="text-[10px] text-brand-text-muted font-bold">Explorá nuestros autos</p>
              </div>
            </div>
            <span class="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </a>

          <!-- Financiamiento -->
          <button 
            (click)="scrollToSection('financiamiento-section')"
            class="flex items-center justify-between p-5 bg-white border border-brand-surface-container rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                <span class="material-symbols-outlined text-[24px]">payments</span>
              </div>
              <div class="text-left">
                <h3 class="font-display font-bold text-sm text-brand-dark">Financiamiento</h3>
                <p class="text-[10px] text-brand-text-muted font-bold">Planes a tu medida</p>
              </div>
            </div>
            <span class="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>

          <!-- Contacto -->
          <button 
            (click)="scrollToSection('contacto-section')"
            class="flex items-center justify-between p-5 bg-white border border-brand-surface-container rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                <span class="material-symbols-outlined text-[24px]">chat</span>
              </div>
              <div class="text-left">
                <h3 class="font-display font-bold text-sm text-brand-dark">Contacto</h3>
                <p class="text-[10px] text-brand-text-muted font-bold">Hablemos hoy</p>
              </div>
            </div>
            <span class="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>
      </section>

      <!-- Colecciones Destacadas -->
      <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-6">
          <div class="flex justify-between items-end mb-10">
            <div>
              <span class="text-xs font-bold uppercase tracking-widest text-brand-primary bg-blue-50 border border-brand-primary/10 px-3 py-1 rounded-full mb-3 inline-block">Nuestros Autos</span>
              <h2 class="font-display font-extrabold text-2xl text-brand-dark">Colección Destacada</h2>
              <p class="text-xs text-brand-text-muted mt-1">Selección de vehículos de alto rendimiento listos para entregar.</p>
            </div>
            <a 
              routerLink="/catalog"
              class="group text-brand-primary font-bold text-xs flex items-center gap-1 hover:text-indigo-850 transition-colors"
            >
              Ver Catálogo Completo
              <span class="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
            </a>
          </div>

          <!-- Grid de Autos Destacados (Con carrusel deslizable en mobile) -->
          @if (loading()) {
            <div class="flex md:grid md:grid-cols-4 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
              <!-- Shimmer Loader Cards -->
              @for (i of [1, 2, 3, 4]; track i) {
                <div class="w-[80vw] sm:w-[50vw] md:w-auto flex-shrink-0 snap-center bg-white border border-brand-surface-container rounded-2xl overflow-hidden flex flex-col h-[320px] transition-all">
                  <div class="aspect-video bg-slate-100 shimmer-effect border-b border-brand-surface-container"></div>
                  <div class="p-4 flex-grow flex flex-col justify-between space-y-3">
                    <div class="space-y-2">
                      <div class="h-4 bg-slate-200 rounded-sm w-3/4 shimmer-effect"></div>
                      <div class="h-3.5 bg-slate-100 rounded-sm w-1/2 shimmer-effect"></div>
                    </div>
                    <div class="flex gap-2">
                      <div class="h-3.5 bg-slate-200 rounded-sm w-12 shimmer-effect"></div>
                      <div class="h-3.5 bg-slate-200 rounded-sm w-16 shimmer-effect"></div>
                    </div>
                    <div class="flex items-center justify-between pt-2">
                      <div class="h-5 bg-slate-200 rounded-sm w-20 shimmer-effect"></div>
                      <div class="h-4 bg-slate-200 rounded-sm w-8 shimmer-effect"></div>
                    </div>
                  </div>
                </div>
              }
            </div>
          } @else {
            <!-- Swiper deslizable infinito en Mobile -->
            <div class="flex md:hidden gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide -mx-6 px-6">
              @for (car of featuredCars(); track car.uniqueKey) {
                <div 
                  class="vehicle-card w-[80vw] sm:w-[50vw] flex-shrink-0 snap-center group bg-white border border-brand-surface-container rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 hover:border-brand-primary/20 flex flex-col cursor-pointer"
                  [routerLink]="['/vehicle', car.id]"
                >
                  <!-- Imagen -->
                  <div class="aspect-video overflow-hidden relative bg-slate-100 shimmer-effect">
                    <img 
                      [src]="car.images[0]" 
                      [alt]="car.brand" 
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    >
                    <span class="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-brand-primary px-2.5 py-1 rounded text-[10px] font-bold uppercase">
                      Destacado
                    </span>
                    @if (car.isSold) {
                      <div class="absolute inset-0 bg-black/25 backdrop-blur-xs z-10 pointer-events-none overflow-hidden">
                        <div class="absolute top-4 -left-8 w-32 bg-rose-600 text-white font-black text-[9px] uppercase tracking-widest text-center py-1 shadow-md transform -rotate-45 border-y border-white/20 select-none">
                          Vendido
                        </div>
                      </div>
                    }
                  </div>
                  <!-- Info -->
                  <div class="p-4 flex-grow flex flex-col justify-between">
                    <h3 class="font-display font-bold text-sm text-brand-dark mb-1 group-hover:text-brand-primary transition-colors">
                      {{ car.brand }} {{ car.model }}
                    </h3>
                    <div class="flex gap-2 mb-3">
                      <span class="bg-brand-surface px-2 py-0.5 rounded text-[10px] font-bold text-brand-text-muted">{{ car.year }}</span>
                      <span class="bg-brand-surface px-2 py-0.5 rounded text-[10px] font-bold text-brand-text-muted">{{ car.kilometers | number }} km</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-brand-primary font-black text-sm">USD {{ car.price | number }}</span>
                      <span class="text-brand-primary font-bold text-xs flex items-center group-hover:translate-x-1 transition-transform">
                        Ver
                        <span class="material-symbols-outlined text-sm">chevron_right</span>
                      </span>
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- Grilla estática de una sola fila en Desktop -->
            <div class="hidden md:grid md:grid-cols-4 gap-6">
              @for (car of originalFeaturedCars(); track car.id) {
                <div 
                  class="vehicle-card group bg-white border border-brand-surface-container rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 hover:border-brand-primary/20 flex flex-col cursor-pointer"
                  [routerLink]="['/vehicle', car.id]"
                >
                  <!-- Imagen -->
                  <div class="aspect-video overflow-hidden relative bg-slate-100 shimmer-effect">
                    <img 
                      [src]="car.images[0]" 
                      [alt]="car.brand" 
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    >
                    <span class="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-brand-primary px-2.5 py-1 rounded text-[10px] font-bold uppercase">
                      Destacado
                    </span>
                    @if (car.isSold) {
                      <div class="absolute inset-0 bg-black/25 backdrop-blur-xs z-10 pointer-events-none overflow-hidden">
                        <div class="absolute top-4 -left-8 w-32 bg-rose-600 text-white font-black text-[9px] uppercase tracking-widest text-center py-1 shadow-md transform -rotate-45 border-y border-white/20 select-none">
                          Vendido
                        </div>
                      </div>
                    }
                  </div>
                  <!-- Info -->
                  <div class="p-4 flex-grow flex flex-col justify-between">
                    <h3 class="font-display font-bold text-sm text-brand-dark mb-1 group-hover:text-brand-primary transition-colors">
                      {{ car.brand }} {{ car.model }}
                    </h3>
                    <div class="flex gap-2 mb-3">
                      <span class="bg-brand-surface px-2 py-0.5 rounded text-[10px] font-bold text-brand-text-muted">{{ car.year }}</span>
                      <span class="bg-brand-surface px-2 py-0.5 rounded text-[10px] font-bold text-brand-text-muted">{{ car.kilometers | number }} km</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-brand-primary font-black text-sm">USD {{ car.price | number }}</span>
                      <span class="text-brand-primary font-bold text-xs flex items-center group-hover:translate-x-1 transition-transform">
                        Ver
                        <span class="material-symbols-outlined text-sm">chevron_right</span>
                      </span>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </section>

      <!-- Sección de Financiamiento -->
      <section id="financiamiento-section" class="py-20 bg-brand-surface border-t border-brand-surface-container">
        <div class="max-w-7xl mx-auto px-6">
          <div class="text-center mb-16">
            <span class="text-xs font-bold uppercase tracking-widest text-brand-primary bg-blue-50 border border-brand-primary/10 px-3 py-1 rounded-full">Financiación</span>
            <h2 class="font-display font-extrabold text-3xl text-brand-dark mt-3">Planes de Pago y Financiamiento</h2>
            <p class="text-xs text-brand-text-muted mt-2 max-w-xl mx-auto">
              Te acompañamos en todo el proceso para que te lleves tu auto con las mejores condiciones del mercado.
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-4 gap-2 md:gap-8">
            <!-- Item 1: Planes adaptados -->
            <div class="bg-white border border-brand-surface-container p-3 md:p-6 rounded-xl md:rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-1.5 hover:border-brand-primary/20 transition-all duration-300 flex items-center gap-3 md:flex-col md:items-center md:text-center cursor-pointer group h-[72px] md:h-auto w-full">
              <div class="w-10 h-10 md:w-14 md:h-14 rounded-full bg-blue-50 text-brand-primary flex items-center justify-center border border-brand-primary/5 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300 flex-shrink-0">
                <span class="material-symbols-outlined text-[20px] md:text-[28px]">handshake</span>
              </div>
              <div class="flex-grow md:text-center">
                <h3 class="font-display font-bold text-[11px] md:text-base text-brand-dark group-hover:text-brand-primary transition-colors text-left md:text-center leading-tight mb-0.5">Planes adaptados a tus necesidades</h3>
                <p class="text-[9px] md:text-xs text-brand-text-muted leading-tight text-left md:text-center">Armamos opciones personalizadas según tus ingresos.</p>
              </div>
            </div>

            <!-- Item 2: Tasas competitivas -->
            <div class="bg-white border border-brand-surface-container p-3 md:p-6 rounded-xl md:rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-1.5 hover:border-brand-primary/20 transition-all duration-300 flex items-center gap-3 md:flex-col md:items-center md:text-center cursor-pointer group h-[72px] md:h-auto w-full">
              <div class="w-10 h-10 md:w-14 md:h-14 rounded-full bg-blue-50 text-brand-primary flex items-center justify-center border border-brand-primary/5 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300 flex-shrink-0">
                <span class="material-symbols-outlined text-[20px] md:text-[28px]">percent</span>
              </div>
              <div class="flex-grow md:text-center">
                <h3 class="font-display font-bold text-[11px] md:text-base text-brand-dark group-hover:text-brand-primary transition-colors text-left md:text-center leading-tight mb-0.5">Tasas competitivas</h3>
                <p class="text-[9px] md:text-xs text-brand-text-muted leading-tight text-left md:text-center">Contamos con convenios para la tasa de interés más baja.</p>
              </div>
            </div>

            <!-- Item 3: Cuotas fijas en pesos -->
            <div class="bg-white border border-brand-surface-container p-3 md:p-6 rounded-xl md:rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-1.5 hover:border-brand-primary/20 transition-all duration-300 flex items-center gap-3 md:flex-col md:items-center md:text-center cursor-pointer group h-[72px] md:h-auto w-full">
              <div class="w-10 h-10 md:w-14 md:h-14 rounded-full bg-blue-50 text-brand-primary flex items-center justify-center border border-brand-primary/5 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300 flex-shrink-0">
                <span class="material-symbols-outlined text-[20px] md:text-[28px]">price_check</span>
              </div>
              <div class="flex-grow md:text-center">
                <h3 class="font-display font-bold text-[11px] md:text-base text-brand-dark group-hover:text-brand-primary transition-colors text-left md:text-center leading-tight mb-0.5">Cuotas fijas en pesos</h3>
                <p class="text-[9px] md:text-xs text-brand-text-muted leading-tight text-left md:text-center">Sabés exactamente cuánto vas a pagar siempre.</p>
              </div>
            </div>

            <!-- Item 4: Financiación de hasta el 70% -->
            <div class="bg-white border border-brand-surface-container p-3 md:p-6 rounded-xl md:rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-1.5 hover:border-brand-primary/20 transition-all duration-300 flex items-center gap-3 md:flex-col md:items-center md:text-center cursor-pointer group h-[72px] md:h-auto w-full">
              <div class="w-10 h-10 md:w-14 md:h-14 rounded-full bg-blue-50 text-brand-primary flex items-center justify-center border border-brand-primary/5 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300 flex-shrink-0">
                <span class="material-symbols-outlined text-[20px] md:text-[28px]">directions_car</span>
              </div>
              <div class="flex-grow md:text-center">
                <h3 class="font-display font-bold text-[11px] md:text-base text-brand-dark group-hover:text-brand-primary transition-colors text-left md:text-center leading-tight mb-0.5">Financiación de hasta el 70%</h3>
                <p class="text-[9px] md:text-xs text-brand-text-muted leading-tight text-left md:text-center">Financiamos hasta el 70% del valor de tu vehículo.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ¿Por qué elegirnos? (Ocultado) -->
      @if (false) {
        <section class="py-16 bg-brand-surface border-t border-brand-surface-container">
          <div class="max-w-7xl mx-auto px-6">
            <div class="text-center mb-12">
              <span class="text-xs font-bold uppercase tracking-widest text-brand-primary bg-blue-50 border border-brand-primary/10 px-3 py-1 rounded-full mb-3 inline-block">Calidad Garantizada</span>
              <h2 class="font-display font-extrabold text-2xl text-brand-dark mb-2">El Estándar LEÓN AUTOMOTORES</h2>
              <p class="text-xs text-brand-text-muted">Redefiniendo la compra de vehículos con transparencia y confianza.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="text-center flex flex-col items-center p-4">
                <div class="w-14 h-14 rounded-full bg-blue-50 border border-brand-primary/10 flex items-center justify-center mb-4 text-brand-primary">
                  <span class="material-symbols-outlined text-[28px]">verified_user</span>
                </div>
                <h3 class="font-display font-bold text-base text-brand-dark mb-2">Historial Certificado</h3>
                <p class="text-xs leading-relaxed text-brand-text-muted">Cada vehículo pasa por una inspección rigurosa y revisión de antecedentes antes de ser publicado.</p>
              </div>
              <div class="text-center flex flex-col items-center p-4">
                <div class="w-14 h-14 rounded-full bg-blue-50 border border-brand-primary/10 flex items-center justify-center mb-4 text-brand-primary">
                  <span class="material-symbols-outlined text-[28px]">payments</span>
                </div>
                <h3 class="font-display font-bold text-base text-brand-dark mb-2">Precios Transparentes</h3>
                <p class="text-xs leading-relaxed text-brand-text-muted">Sin cargos ocultos ni sorpresas de comisión. Negociación directa con agencias de la ciudad.</p>
              </div>
              <div class="text-center flex flex-col items-center p-4">
                <div class="w-14 h-14 rounded-full bg-blue-50 border border-brand-primary/10 flex items-center justify-center mb-4 text-brand-primary">
                  <span class="material-symbols-outlined text-[28px]">chat</span>
                </div>
                <h3 class="font-display font-bold text-base text-brand-dark mb-2">Atención Directa</h3>
                <p class="text-xs leading-relaxed text-brand-text-muted">Agenda visitas, coordina test-drives y resuelve tus dudas con un clic directo a WhatsApp.</p>
              </div>
            </div>
          </div>
        </section>
      }

      <!-- Sección de Contacto (Liquid Glass) -->
      <section id="contacto-section" class="py-20 bg-white border-t border-brand-surface-container">
        <div class="max-w-7xl mx-auto px-6">
          <div class="text-center mb-16">
            <span class="text-xs font-bold uppercase tracking-widest text-brand-primary bg-blue-50 border border-brand-primary/10 px-3 py-1 rounded-full">¿Tenés alguna pregunta?</span>
            <h2 class="font-display font-extrabold text-3xl text-brand-dark mt-3">Hablemos de tu Próximo Vehículo</h2>
            <p class="text-xs text-brand-text-muted mt-2 max-w-xl mx-auto">
              Nuestro equipo comercial y de financiación está a tu disposición para asesorarte. Visítanos en Salta o envíanos un mensaje directo.
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <!-- Info Card (Glassmorphic) -->
            <div class="lg:col-span-5 flex flex-col h-full">
              <div class="card-glass p-8 rounded-3xl border border-slate-200/80 shadow-md flex-grow flex flex-col justify-between space-y-6">
                <h3 class="font-display font-bold text-lg text-brand-dark">Información de Sucursal</h3>
                
                <div class="space-y-4">
                  <!-- Dirección -->
                  <a 
                    href="https://maps.google.com/?q=Sarmiento+490,+Salta,+Argentina,+4400" 
                    target="_blank"
                    class="flex gap-3 items-start group/item cursor-pointer hover:text-brand-primary transition-colors"
                  >
                    <span class="material-symbols-outlined text-[20px] text-brand-primary p-2 bg-blue-50 rounded-lg group-hover/item:bg-brand-primary group-hover/item:text-white transition-all">location_on</span>
                    <div>
                      <h4 class="text-xs font-bold text-brand-dark">Ubicación</h4>
                      <p class="text-xs text-brand-text-muted mt-0.5 group-hover/item:text-brand-primary transition-colors">Sarmiento 490 , Salta, Argentina, 4400</p>
                    </div>
                  </a>

                  <!-- Teléfono -->
                  <a 
                    href="https://wa.me/5493874871657" 
                    target="_blank"
                    class="flex gap-3 items-start group/item cursor-pointer hover:text-brand-primary transition-colors"
                  >
                    <span class="material-symbols-outlined text-[20px] text-brand-primary p-2 bg-blue-50 rounded-lg group-hover/item:bg-brand-primary group-hover/item:text-white transition-all">phone</span>
                    <div>
                      <h4 class="text-xs font-bold text-brand-dark">Teléfono de Ventas</h4>
                      <p class="text-xs text-brand-text-muted mt-0.5 group-hover/item:text-brand-primary transition-colors">+54 387 4871657</p>
                    </div>
                  </a>

                  <!-- Email -->
                  <a 
                    href="mailto:leonautomotores@outlook.com" 
                    class="flex gap-3 items-start group/item cursor-pointer hover:text-brand-primary transition-colors"
                  >
                    <span class="material-symbols-outlined text-[20px] text-brand-primary p-2 bg-blue-50 rounded-lg group-hover/item:bg-brand-primary group-hover/item:text-white transition-all">mail</span>
                    <div>
                      <h4 class="text-xs font-bold text-brand-dark">Correo Electrónico</h4>
                      <p class="text-xs text-brand-text-muted mt-0.5 group-hover/item:text-brand-primary transition-colors">leonautomotores&#64;outlook.com</p>
                    </div>
                  </a>

                  <!-- Horarios -->
                  <div class="flex gap-3 items-start">
                    <span class="material-symbols-outlined text-[20px] text-brand-primary p-2 bg-blue-50 rounded-lg">schedule</span>
                    <div class="flex-grow">
                      <h4 class="text-xs font-bold text-brand-dark">Horarios de Atención</h4>
                      <div class="text-[11px] text-brand-text-muted mt-1.5 space-y-1">
                        <div class="flex items-center justify-between border-b border-slate-100/50 pb-1">
                          <span class="font-semibold text-brand-dark">Días de Semana:</span>
                          <span>9:00 a 13:00 y 16:00 a 20:00 hs</span>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="font-semibold text-brand-dark">Sábados:</span>
                          <span>9:00 a 13:00 hs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Botón Directo a WhatsApp -->
                <a 
                  href="https://wa.me/5493874871657" 
                  target="_blank" 
                  class="flex items-center justify-center gap-2 w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.59 1.977 14.113 1.96 12.01 1.96c-5.437 0-9.865 4.37-9.869 9.8.001 1.973.518 3.894 1.5 5.614l-.982 3.585 3.687-.965zm9.64-5.328c-.287-.144-1.702-.84-1.966-.935-.264-.096-.456-.144-.648.144-.192.288-.744.935-.912 1.127-.168.193-.336.216-.624.072-.288-.145-1.218-.45-2.32-1.432-.857-.764-1.436-1.708-1.604-1.996-.168-.288-.018-.444.126-.587.13-.13.288-.336.432-.504.144-.168.192-.288.288-.48.096-.192.048-.36-.024-.504-.072-.144-.648-1.56-.888-2.136-.234-.56-.47-.482-.648-.492-.168-.008-.36-.01-.552-.01-.192 0-.504.072-.768.36-.264.288-1.008.984-1.008 2.4s1.032 2.784 1.176 2.976c.144.192 2.032 3.102 4.921 4.347.687.296 1.224.473 1.64.605.69.22 1.32.19 1.816.116.552-.083 1.702-.696 1.942-1.37.24-.672.24-1.25.168-1.37-.072-.12-.264-.192-.552-.336z"/>
                  </svg>
                  Contactar por WhatsApp
                </a>
              </div>
            </div>

            <!-- Form Card (Glassmorphic Form) -->
            <div class="hidden lg:flex lg:col-span-7 flex-col h-full">
              <div class="card-glass p-8 rounded-3xl border border-slate-300 shadow-xl bg-slate-100! flex-grow flex flex-col justify-between">
                @if (submitSuccess()) {
                  <!-- Success State Card -->
                  <div class="flex flex-col items-center justify-center text-center py-10 px-4 space-y-4 animate-fade-in flex-grow">
                    <div class="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/10">
                      <span class="material-symbols-outlined text-[32px]">check_circle</span>
                    </div>
                    <h3 class="font-display font-bold text-lg text-brand-dark">¡Mensaje Recibido!</h3>
                    <p class="text-xs text-brand-text-muted max-w-sm leading-relaxed">
                      Tu consulta fue enviada con éxito. Un asesor de ventas se pondrá en contacto contigo a la brevedad.
                    </p>
                    <button 
                      type="button"
                      (click)="resetContactForm()" 
                      class="mt-4 px-6 py-2.5 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary font-bold text-xs rounded-xl transition-all active:scale-[0.98] cursor-pointer"
                    >
                      Enviar otro mensaje
                    </button>
                  </div>
                } @else {
                  <form (submit)="onSubmitContact($event)" class="space-y-6 flex-grow flex flex-col justify-between">
                    <h3 class="font-display font-bold text-lg text-brand-dark">Envíanos un mensaje</h3>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <!-- Nombre -->
                      <div class="space-y-1">
                        <label class="text-[10px] font-bold text-brand-primary uppercase tracking-wider block">Nombre Completo *</label>
                        <input 
                          type="text" 
                          required
                          title="Este campo es obligatorio"
                          oninvalid="this.setCustomValidity('Por favor, ingresá tu nombre')" 
                          oninput="this.setCustomValidity('')"
                          placeholder="Ej. Juan Pérez" 
                          [disabled]="isSubmitting()"
                          class="w-full h-11 px-3 text-xs bg-white/40 border border-white/60 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-hidden transition-all text-slate-800 disabled:opacity-60"
                        >
                      </div>

                      <!-- Teléfono -->
                      <div class="space-y-1">
                        <label class="text-[10px] font-bold text-brand-primary uppercase tracking-wider block">Teléfono de Contacto *</label>
                        <input 
                          type="tel" 
                          required
                          title="Este campo es obligatorio"
                          oninvalid="this.setCustomValidity('Por favor, ingresá tu teléfono')" 
                          oninput="this.setCustomValidity('')"
                          placeholder="Ej. +54 387 1234567" 
                          [disabled]="isSubmitting()"
                          class="w-full h-11 px-3 text-xs bg-white/40 border border-white/60 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-hidden transition-all text-slate-800 disabled:opacity-60"
                        >
                      </div>
                    </div>

                    <!-- Email -->
                    <div class="space-y-1">
                      <label class="text-[10px] font-bold text-brand-primary uppercase tracking-wider block">Correo Electrónico *</label>
                      <input 
                        type="email" 
                        required
                        title="Este campo es obligatorio"
                        oninvalid="this.setCustomValidity('Por favor, ingresá un correo válido')" 
                        oninput="this.setCustomValidity('')"
                        placeholder="juan.perez@email.com" 
                        [disabled]="isSubmitting()"
                        class="w-full h-11 px-3 text-xs bg-white/40 border border-white/60 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-hidden transition-all text-slate-800 disabled:opacity-60"
                      >
                    </div>

                    <!-- Mensaje -->
                    <div class="space-y-1">
                      <label class="text-[10px] font-bold text-brand-primary uppercase tracking-wider block">Mensaje o Consulta *</label>
                      <textarea 
                        rows="4" 
                        required
                        title="Este campo es obligatorio"
                        oninvalid="this.setCustomValidity('Por favor, escribí tu consulta')" 
                        oninput="this.setCustomValidity('')"
                        placeholder="Cuéntanos en qué auto estás interesado..." 
                        [disabled]="isSubmitting()"
                        class="w-full p-3 text-xs bg-white/40 border border-white/60 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-hidden transition-all text-slate-800 resize-none disabled:opacity-60"
                      ></textarea>
                    </div>

                    <!-- Botón Enviar -->
                    <div class="flex justify-end">
                      <button 
                        type="submit"
                        [disabled]="isSubmitting()"
                        class="bg-brand-primary hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold text-xs transition-all duration-300 active:scale-95 cursor-pointer shadow-md shadow-indigo-500/20 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        @if (isSubmitting()) {
                          <div class="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
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
        </div>
      </section>

    </div>
  `,
  styles: `
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private readonly router = inject(Router);
  private readonly vehicleService = inject(VehicleService);

  scrollToSection(id: string): void {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  readonly brands = this.vehicleService.brands;
  readonly vehicles = this.vehicleService.vehicles;
  readonly loading = this.vehicleService.loading;
  readonly brandDropdownOptions = computed<DropdownOption[]>(() => {
    return this.brands().map(b => ({ value: b, label: b }));
  });

  readonly originalFeaturedCars = computed(() => {
    return this.vehicles().filter(v => v.isFeatured).slice(0, 4);
  });

  readonly featuredCars = computed(() => {
    const list = this.originalFeaturedCars();
    if (list.length === 0) return [];
    // Repeat the array 15 times to make it feel endless and infinite
    const repeated: any[] = [];
    for (let i = 0; i < 15; i++) {
      repeated.push(...list.map(car => ({ ...car, uniqueKey: `${car.id}-${i}` })));
    }
    return repeated;
  });

  readonly selectedBrand = signal<string>('');
  private readonly modelQuery = signal<string>('');

  onBrandSelect(brand: any): void {
    this.selectedBrand.set(brand || '');
  }

  onModelChange(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.modelQuery.set(query);
  }

  searchCars(): void {
    this.vehicleService.updateFilters({
      brand: this.selectedBrand() ? [this.selectedBrand()!] : undefined,
      search: this.modelQuery() || undefined
    });
    this.router.navigate(['/catalog']);
  }

  filterQuick(brand: string): void {
    this.vehicleService.clearFilters();
    this.vehicleService.updateFilters({ brand: [brand] });
    this.router.navigate(['/catalog']);
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
