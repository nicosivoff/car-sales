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

            <!-- Botón Buscar (Texto corregido) -->
            <button 
              (click)="searchCars()"
              class="bg-brand-primary hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-md shadow-indigo-500/20"
            >
              <span class="material-symbols-outlined text-[18px]">search</span>
              Buscar
            </button>
          </div>

          <!-- Filtros Rápidos -->
          <div class="mt-8 flex flex-wrap justify-center gap-2 items-center">
            <span class="text-xs font-bold text-slate-300">Populares:</span>
            <button (click)="filterQuick('Peugeot')" class="bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer">Peugeot</button>
            <button (click)="filterQuick('Toyota')" class="bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer">Toyota</button>
            <button (click)="filterQuick('Ford')" class="bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer">Ford</button>
          </div>
        </div>
      </header>

      <!-- Colecciones Destacadas -->
      <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-6">
          <div class="flex justify-between items-end mb-10">
            <div>
              <h2 class="font-display font-extrabold text-2xl text-brand-dark">Colección Destacada</h2>
              <p class="text-xs text-brand-text-muted mt-1">Selección de vehículos de alto rendimiento listos para entregar.</p>
            </div>
            <a 
              routerLink="/catalog"
              class="text-brand-primary font-bold text-xs flex items-center gap-1 hover:underline decoration-2"
            >
              Ver Catálogo Completo
              <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
            </a>
          </div>

          <!-- Grid de Autos Destacados -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            @if (loading()) {
              <!-- Shimmer Loader Cards -->
              @for (i of [1, 2, 3, 4]; track i) {
                <div class="bg-white border border-brand-surface-container rounded-2xl overflow-hidden flex flex-col h-[320px] transition-all">
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
            } @else {
              @for (car of featuredCars(); track car.id) {
                <div 
                  class="group bg-white border border-brand-surface-container rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 hover:border-brand-primary/20 flex flex-col cursor-pointer"
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
            }
          </div>
        </div>
      </section>

      <!-- ¿Por qué elegirnos? -->
      <section class="py-16 bg-brand-surface border-t border-brand-surface-container">
        <div class="max-w-7xl mx-auto px-6">
          <div class="text-center mb-12">
            <h2 class="font-display font-extrabold text-2xl text-brand-dark mb-2">El Estándar LUXEMOTORS</h2>
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

      <!-- Sección de Contacto (Liquid Glass) -->
      <section id="contacto-section" class="py-20 bg-white border-t border-brand-surface-container">
        <div class="max-w-7xl mx-auto px-6">
          <div class="text-center mb-16">
            <span class="text-xs font-bold uppercase tracking-widest text-brand-primary bg-blue-50 border border-brand-primary/10 px-3 py-1 rounded-full">¿Tienes preguntas?</span>
            <h2 class="font-display font-extrabold text-3xl text-brand-dark mt-3">Hablemos de tu Próximo Vehículo</h2>
            <p class="text-xs text-brand-text-muted mt-2 max-w-xl mx-auto">
              Nuestro equipo comercial y de financiación está a tu disposición para asesorarte. Visítanos en Salta o envíanos un mensaje directo.
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <!-- Info Card (Glassmorphic) -->
            <div class="lg:col-span-5 space-y-6">
              <div class="card-glass p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
                <h3 class="font-display font-bold text-lg text-brand-dark">Información de Sucursal</h3>
                
                <div class="space-y-4">
                  <!-- Dirección -->
                  <div class="flex gap-3 items-start">
                    <span class="material-symbols-outlined text-[20px] text-brand-primary p-2 bg-blue-50 rounded-lg">location_on</span>
                    <div>
                      <h4 class="text-xs font-bold text-brand-dark">Ubicación</h4>
                      <p class="text-xs text-brand-text-muted mt-0.5">Av. Bicentenario de la Batalla de Salta 1234, Salta, Argentina</p>
                    </div>
                  </div>

                  <!-- Teléfono -->
                  <div class="flex gap-3 items-start">
                    <span class="material-symbols-outlined text-[20px] text-brand-primary p-2 bg-blue-50 rounded-lg">phone</span>
                    <div>
                      <h4 class="text-xs font-bold text-brand-dark">Teléfono de Ventas</h4>
                      <p class="text-xs text-brand-text-muted mt-0.5">+54 9 387 123-4567</p>
                    </div>
                  </div>

                  <!-- Email -->
                  <div class="flex gap-3 items-start">
                    <span class="material-symbols-outlined text-[20px] text-brand-primary p-2 bg-blue-50 rounded-lg">mail</span>
                    <div>
                      <h4 class="text-xs font-bold text-brand-dark">Correo Electrónico</h4>
                      <p class="text-xs text-brand-text-muted mt-0.5">contacto&#64;luxemotors.com</p>
                    </div>
                  </div>

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
                  href="https://wa.me/5493871234567" 
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
            <div class="lg:col-span-7">
              <div class="card-glass p-8 rounded-3xl border border-slate-300 shadow-xl bg-slate-100!">
                @if (submitSuccess()) {
                  <!-- Success State Card -->
                  <div class="flex flex-col items-center justify-center text-center py-10 px-4 space-y-4 animate-fade-in">
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
                  <form (submit)="onSubmitContact($event)" class="space-y-6">
                    <h3 class="font-display font-bold text-lg text-brand-dark">Envíanos un mensaje</h3>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <!-- Nombre -->
                      <div class="space-y-1">
                        <label class="text-[10px] font-bold text-brand-primary uppercase tracking-wider block">Nombre Completo</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Ej. Juan Pérez" 
                          [disabled]="isSubmitting()"
                          class="w-full h-11 px-3 text-xs bg-white/40 border border-white/60 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-hidden transition-all text-slate-800 disabled:opacity-60"
                        >
                      </div>

                      <!-- Teléfono -->
                      <div class="space-y-1">
                        <label class="text-[10px] font-bold text-brand-primary uppercase tracking-wider block">Teléfono de Contacto</label>
                        <input 
                          type="tel" 
                          placeholder="Ej. +54 387 1234567" 
                          [disabled]="isSubmitting()"
                          class="w-full h-11 px-3 text-xs bg-white/40 border border-white/60 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-hidden transition-all text-slate-800 disabled:opacity-60"
                        >
                      </div>
                    </div>

                    <!-- Email -->
                    <div class="space-y-1">
                      <label class="text-[10px] font-bold text-brand-primary uppercase tracking-wider block">Correo Electrónico</label>
                      <input 
                        type="email" 
                        required
                        placeholder="juan.perez@email.com" 
                        [disabled]="isSubmitting()"
                        class="w-full h-11 px-3 text-xs bg-white/40 border border-white/60 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-hidden transition-all text-slate-800 disabled:opacity-60"
                      >
                    </div>

                    <!-- Mensaje -->
                    <div class="space-y-1">
                      <label class="text-[10px] font-bold text-brand-primary uppercase tracking-wider block">Mensaje o Consulta</label>
                      <textarea 
                        rows="4" 
                        required
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
               </div>         </div>
        </div>
      </section>

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private readonly router = inject(Router);
  private readonly vehicleService = inject(VehicleService);

  readonly brands = this.vehicleService.brands;
  readonly vehicles = this.vehicleService.vehicles;
  readonly loading = this.vehicleService.loading;
  readonly brandDropdownOptions = computed<DropdownOption[]>(() => {
    return this.brands().map(b => ({ value: b, label: b }));
  });

  readonly featuredCars = computed(() => {
    return this.vehicles().filter(v => v.isFeatured).slice(0, 4);
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
      brand: this.selectedBrand() || undefined,
      search: this.modelQuery() || undefined
    });
    this.router.navigate(['/catalog']);
  }

  filterQuick(brand: string): void {
    this.vehicleService.clearFilters();
    this.vehicleService.updateFilters({ brand });
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
