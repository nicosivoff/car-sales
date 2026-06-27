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

                  <!-- Formulario -->
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
                  <form class="space-y-4" (submit)="onSubmitContact($event)">
                    <div>
                      <label class="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider block mb-1">Nombre Completo</label>
                      <input 
                        type="text" 
                        required
                        [disabled]="isSubmitting()"
                        placeholder="Juan Pérez" 
                        class="w-full h-12 px-3 text-sm rounded-xl bg-white/40 border border-white/60 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-hidden transition-all text-slate-800 disabled:opacity-60"
                      >
                    </div>
                    <div>
                      <label class="text-[10px] font-bold text-brand-text-muted uppercase tracking-wider block mb-1">Correo Electrónico</label>
                      <input 
                        type="email" 
                        required
                        [disabled]="isSubmitting()"
                        placeholder="juan@ejemplo.com" 
                        class="w-full h-12 px-3 text-sm rounded-xl bg-white/40 border border-white/60 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-hidden transition-all text-slate-800 disabled:opacity-60"
                      >
                    </div>

                    <button 
                      type="submit"
                      [disabled]="isSubmitting()"
                      class="w-full h-12 bg-brand-primary text-white font-semibold text-sm rounded-xl hover:opacity-90 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      @if (isSubmitting()) {
                        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Enviando...
                      } @else {
                        Contactar Concesionario
                      }
                    </button>

                    <button 
                      type="button"
                      (click)="contactWhatsApp()"
                      [disabled]="isSubmitting()"
                      class="w-full h-12 bg-emerald-500 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all active:scale-[0.98] cursor-pointer shadow-md animate-whatsapp-pulse disabled:opacity-60"
                    >
                      <span class="material-symbols-outlined">chat_bubble</span>
                      Mensaje por WhatsApp
                    </button>
                  </form>
                }
              </div>

            </div>
          </div>
        </div>

        <!-- Botón de WhatsApp Pegajoso en Mobile (Sticky Bottom Bar + Pulse) -->
        <div class="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-brand-surface-container p-4 z-45 flex items-center justify-between shadow-2xl">
          <div>
            <span class="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest block">Precio</span>
            <span class="text-base font-black text-brand-primary">{{ car()!.currency === 'ARS' ? '$' : 'USD' }} {{ car()!.price | number }}</span>
          </div>
          <div class="w-2/3">
            <button 
              type="button"
              (click)="contactWhatsApp()"
              class="w-full h-12 bg-emerald-500 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all active:scale-[0.98] cursor-pointer shadow-md animate-whatsapp-pulse"
            >
              Consultar por WhatsApp
            </button>
          </div>
        </div>

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

  readonly carId = signal<string | null>(this.route.snapshot.paramMap.get('id'));
  readonly car = computed(() => {
    const id = this.carId();
    return id ? this.vehicleService.getVehicleById(id) : undefined;
  });

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
