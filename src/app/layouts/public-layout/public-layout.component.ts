import { ChangeDetectionStrategy, Component, inject, signal, HostListener, computed, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { VehicleService } from '../../features/vehicles/services/vehicle.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-gradient-to-tr from-slate-100 via-zinc-100 to-indigo-50/40 flex flex-col font-body text-brand-dark antialiased">
      <!-- TopNavBar (Stitch Style + Liquid Glass + Dynamic Transparency on Scroll) -->
      <header 
        [ngClass]="isTransparent() 
          ? 'bg-transparent border-transparent shadow-none' 
          : 'card-glass border-b border-white/40 shadow-md rounded-b-[24px] md:rounded-b-[32px]'"
        class="w-full fixed top-0 left-0 z-50 transition-all duration-300"
      >
        <nav class="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div class="flex items-center gap-8">
            <!-- Logo -->
            <a 
              routerLink="/" 
              [ngClass]="isTransparent() ? 'text-white' : 'text-brand-primary'"
              class="text-xl font-bold tracking-wider font-display uppercase hover:opacity-90 transition-colors"
            >
              LUXEMOTORS
            </a>
            <div class="hidden md:flex items-center gap-6">
              <!-- Botón Inicio -->
              <a 
                routerLink="/" 
                routerLinkActive="text-brand-primary" 
                [routerLinkActiveOptions]="{exact: true}"
                [ngClass]="isTransparent() ? 'text-slate-200 hover:text-white' : 'text-brand-text-muted hover:text-brand-primary'"
                class="relative text-sm font-semibold transition-colors pb-1 group cursor-pointer"
              >
                Inicio
                <span 
                  [ngClass]="isTransparent() ? 'bg-white' : 'bg-brand-primary'"
                  class="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                ></span>
              </a>

              <!-- Botón Catálogo -->
              <a 
                routerLink="/catalog" 
                routerLinkActive="text-brand-primary" 
                [routerLinkActiveOptions]="{exact: true}"
                [ngClass]="isTransparent() ? 'text-slate-200 hover:text-white' : 'text-brand-text-muted hover:text-brand-primary'"
                class="relative text-sm font-semibold transition-colors pb-1 group cursor-pointer"
              >
                Catálogo
                <span 
                  [ngClass]="isTransparent() ? 'bg-white' : 'bg-brand-primary'"
                  class="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                ></span>
              </a>

              <!-- Botón Contacto -->
              <a 
                (click)="scrollToContact()"
                [ngClass]="isTransparent() ? 'text-slate-200 hover:text-white' : 'text-brand-text-muted hover:text-brand-primary'"
                class="relative text-sm font-semibold transition-colors pb-1 group cursor-pointer"
              >
                Contacto
                <span 
                  [ngClass]="isTransparent() ? 'bg-white' : 'bg-brand-primary'"
                  class="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                ></span>
              </a>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <!-- Botón Acceso Admin -->
            <a 
              routerLink="/admin" 
              [ngClass]="isTransparent() 
                ? 'border-white/40 bg-white/20 text-white hover:border-white/80 hover:bg-white/30' 
                : 'border-white/60 bg-white/40 text-brand-text-muted hover:text-brand-primary hover:border-brand-primary'"
              class="relative hidden sm:inline-block px-4 py-2 border backdrop-blur-md font-semibold text-xs rounded-lg transition-all overflow-hidden group cursor-pointer"
            >
              <span class="relative z-10">Acceso Admin</span>
              <span 
                [ngClass]="isTransparent() ? 'bg-white' : 'bg-brand-primary'"
                class="absolute bottom-0 left-0 w-full h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
              ></span>
            </a>
            <!-- Botón Menú Mobile -->
            <button 
              (click)="toggleMenu()"
              [ngClass]="isTransparent() ? 'text-white hover:bg-white/10' : 'text-brand-text-muted hover:bg-white/50'"
              class="md:hidden p-2 rounded-lg focus:outline-hidden transition-all"
              aria-label="Toggle menu"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                @if (isMenuOpen()) {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                } @else {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </nav>

        <!-- Menú Desplegable Mobile -->
        @if (isMenuOpen()) {
          <div class="md:hidden bg-white/80 backdrop-blur-xl border-b border-white/30 px-6 pt-2 pb-4 space-y-2 rounded-b-2xl">
            <a 
              routerLink="/" 
              (click)="closeMenu()"
              class="block px-3 py-2.5 rounded-lg text-sm font-semibold text-brand-text-muted hover:bg-white/60 hover:text-brand-primary transition-all"
            >
              Inicio
            </a>
            <a 
              (click)="scrollToContact(); closeMenu()"
              class="block px-3 py-2.5 rounded-lg text-sm font-semibold text-brand-text-muted hover:bg-white/60 hover:text-brand-primary transition-all cursor-pointer"
            >
              Contacto
            </a>
            <a 
              routerLink="/catalog" 
              (click)="closeMenu()"
              class="block px-3 py-2.5 rounded-lg text-sm font-semibold text-brand-text-muted hover:bg-white/60 hover:text-brand-primary transition-all"
            >
              Catálogo
            </a>
            <a 
              routerLink="/admin" 
              (click)="closeMenu()"
              class="block px-3 py-2.5 rounded-lg text-sm font-semibold text-brand-primary hover:bg-blue-50 transition-all text-center border border-brand-primary/20"
            >
              Acceso Admin
            </a>
          </div>
        }
      </header>

      <!-- Main Content Outlet (Con padding top condicional si no es la home para no solaparse con el header fixed) -->
      <main class="flex-grow" [ngClass]="{'pt-16': !isHomePage()}">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="bg-brand-dark text-slate-400 border-t border-slate-800">
        <div class="max-w-7xl mx-auto px-6 py-12">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Brand -->
            <div>
              <div class="flex items-center space-x-2 mb-4">
                <span class="font-display font-bold text-lg text-white tracking-wider uppercase">LUXEMOTORS</span>
              </div>
              <p class="text-sm text-slate-400 max-w-xs leading-relaxed">
                La plataforma líder para conectar agencias de autos con compradores.
              </p>
            </div>

            <!-- Links -->
            <div>
              <h3 class="text-sm font-semibold text-white tracking-wider uppercase mb-4">Enlaces rápidos</h3>
              <ul class="space-y-2 text-sm">
                <li><a routerLink="/" class="hover:text-white transition-colors">Inicio</a></li>
                <li><a routerLink="/catalog" class="hover:text-white transition-colors">Catálogo</a></li>
                <li><a (click)="scrollToContact()" class="hover:text-white transition-colors cursor-pointer">Contacto</a></li>
              </ul>
            </div>

            <!-- Contact / Trust -->
            <div>
              <h3 class="text-sm font-semibold text-white tracking-wider uppercase mb-4">Soporte y Ventas</h3>
              <p class="text-sm leading-relaxed mb-2">¿Quieres publicar tu concesionaria en nuestra plataforma?</p>
              <span class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                contacto&#64;luxemotors.com
              </span>
            </div>
          </div>

          <div class="mt-8 pt-8 border-t border-slate-850 text-center text-xs text-slate-500">
            &copy; {{ currentYear }} LUXEMOTORS. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicLayoutComponent {
  private readonly router = inject(Router);
  private readonly vehicleService = inject(VehicleService);
  private readonly destroyRef = inject(DestroyRef);

  isMenuOpen = signal(false);
  currentYear = new Date().getFullYear();
  isScrolled = signal(false);
  currentUrl = signal(this.router.url);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((event: any) => {
      this.currentUrl.set(event.urlAfterRedirects || event.url);
    });
  }

  readonly isHomePage = computed(() => {
    const url = this.currentUrl();
    return url === '/' || url.startsWith('/?');
  });

  readonly isTransparent = computed(() => {
    return this.isHomePage() && !this.isScrolled();
  });

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled.set(scrollY > 20);
  }

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  filterByCondition(condition: 'nuevo' | 'usado') {
    this.vehicleService.clearFilters();
    this.vehicleService.updateFilters({ condition });
    this.router.navigate(['/catalog']);
  }

  scrollToContact() {
    if (this.isHomePage()) {
      const el = document.getElementById('contacto-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          const el = document.getElementById('contacto-section');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      });
    }
  }
}
