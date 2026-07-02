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
        <nav class="max-w-7xl mx-auto px-6 flex items-center h-16 relative">
          <!-- Logo (Left aligned) -->
          <a 
            (click)="clickLogo()" 
            [ngClass]="isTransparent() ? 'text-white' : 'text-brand-primary'"
            class="text-xl font-bold tracking-wider font-display uppercase hover:opacity-90 transition-colors cursor-pointer absolute left-6"
          >
            LEÓN AUTOMOTORES
          </a>

          <!-- Centered Navigation Links -->
          <div class="hidden md:flex items-center justify-center gap-8 mx-auto">
            <!-- Botón Inicio -->
            <a 
              (click)="clickInicio()" 
              [ngClass]="isTransparent() ? 'text-slate-200 hover:text-white' : 'text-brand-text-muted hover:text-brand-primary'"
              class="relative text-sm font-semibold transition-colors pb-1 group cursor-pointer"
            >
              Inicio
              <span [ngClass]="isTransparent() ? 'bg-white' : 'bg-brand-primary'" class="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"></span>
            </a>

            <!-- Botón Catálogo -->
            <a 
              (click)="clickCatalog()"
              [ngClass]="isTransparent() ? 'text-slate-200 hover:text-white' : 'text-brand-text-muted hover:text-brand-primary'"
              class="relative text-sm font-semibold transition-colors pb-1 group cursor-pointer"
            >
              Catálogo
              <span [ngClass]="isTransparent() ? 'bg-white' : 'bg-brand-primary'" class="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"></span>
            </a>

            <!-- Botón Financiación -->
            <a 
              (click)="scrollToFinancing()"
              [ngClass]="isTransparent() ? 'text-slate-200 hover:text-white' : 'text-brand-text-muted hover:text-brand-primary'"
              class="relative text-sm font-semibold transition-colors pb-1 group cursor-pointer"
            >
              Financiación
              <span [ngClass]="isTransparent() ? 'bg-white' : 'bg-brand-primary'" class="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"></span>
            </a>

            <!-- Botón Contacto -->
            <a 
              (click)="scrollToContact()"
              [ngClass]="isTransparent() ? 'text-slate-200 hover:text-white' : 'text-brand-text-muted hover:text-brand-primary'"
              class="relative text-sm font-semibold transition-colors pb-1 group cursor-pointer"
            >
              Contacto
              <span [ngClass]="isTransparent() ? 'bg-white' : 'bg-brand-primary'" class="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"></span>
            </a>
          </div>

          <!-- Right aligned controls (Mobile Toggle / Contact Icons) -->
          <div class="flex items-center gap-4 absolute right-6">
            <!-- Contact Icons (desktop only) -->
            <div class="hidden md:flex items-center gap-4">
              <a 
                href="https://wa.me/5493874871657" 
                target="_blank" 
                [ngClass]="isTransparent() ? 'text-white hover:text-emerald-400' : 'text-brand-text-muted hover:text-emerald-500'" 
                class="transition-colors flex items-center justify-center"
              >
                <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.59 1.977 14.113 1.96 12.01 1.96c-5.437 0-9.865 4.37-9.869 9.8.001 1.973.518 3.894 1.5 5.614l-.982 3.585 3.687-.965zm9.64-5.328c-.287-.144-1.702-.84-1.966-.935-.264-.096-.456-.144-.648.144-.192.288-.744.935-.912 1.127-.168.193-.336.216-.624.072-.288-.145-1.218-.45-2.32-1.432-.857-.764-1.436-1.708-1.604-1.996-.168-.288-.018-.444.126-.587.13-.13.288-.336.432-.504.144-.168.192-.288.288-.48.096-.192.048-.36-.024-.504-.072-.144-.648-1.56-.888-2.136-.234-.56-.47-.482-.648-.492-.168-.008-.36-.01-.552-.01-.192 0-.504.072-.768.36-.264.288-1.008.984-1.008 2.4s1.032 2.784 1.176 2.976c.144.192 2.032 3.102 4.921 4.347.687.296 1.224.473 1.64.605.69.22 1.32.19 1.816.116.552-.083 1.702-.696 1.942-1.37.24-.672.24-1.25.168-1.37-.072-.12-.264-.192-.552-.336z"/>
                </svg>
              </a>
              <a 
                href="mailto:leonautomotores@outlook.com" 
                [ngClass]="isTransparent() ? 'text-white hover:text-blue-400' : 'text-brand-text-muted hover:text-brand-primary'" 
                class="transition-colors flex items-center justify-center"
              >
                <span class="material-symbols-outlined text-[20px]">mail</span>
              </a>
            </div>

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
              (click)="clickInicio()"
              class="block px-3 py-2.5 rounded-lg text-sm font-semibold text-brand-text-muted hover:bg-white/60 hover:text-brand-primary transition-all cursor-pointer"
            >
              Inicio
            </a>
            <a 
              (click)="clickCatalog()"
              class="block px-3 py-2.5 rounded-lg text-sm font-semibold text-brand-text-muted hover:bg-white/60 hover:text-brand-primary transition-all cursor-pointer"
            >
              Catálogo
            </a>
            <a 
              (click)="scrollToFinancing(); closeMenu()"
              class="block px-3 py-2.5 rounded-lg text-sm font-semibold text-brand-text-muted hover:bg-white/60 hover:text-brand-primary transition-all cursor-pointer"
            >
              Financiación
            </a>
            <a 
              (click)="scrollToContact(); closeMenu()"
              class="block px-3 py-2.5 rounded-lg text-sm font-semibold text-brand-text-muted hover:bg-white/60 hover:text-brand-primary transition-all cursor-pointer"
            >
              Contacto
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
        <div class="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="text-center sm:text-left">
            <span class="font-display font-bold text-base text-white tracking-wider uppercase">LEÓN AUTOMOTORES</span>
            <div class="mt-1 text-[10px] text-slate-500">
              &copy; {{ currentYear }} LEÓN AUTOMOTORES. Todos los derechos reservados.
            </div>
          </div>
          <div class="flex items-center gap-4 justify-center">
            <a 
              href="https://wa.me/5493874871657" 
              target="_blank" 
              class="text-slate-400 hover:text-emerald-400 transition-colors flex items-center justify-center"
            >
              <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.59 1.977 14.113 1.96 12.01 1.96c-5.437 0-9.865 4.37-9.869 9.8.001 1.973.518 3.894 1.5 5.614l-.982 3.585 3.687-.965zm9.64-5.328c-.287-.144-1.702-.84-1.966-.935-.264-.096-.456-.144-.648.144-.192.288-.744.935-.912 1.127-.168.193-.336.216-.624.072-.288-.145-1.218-.45-2.32-1.432-.857-.764-1.436-1.708-1.604-1.996-.168-.288-.018-.444.126-.587.13-.13.288-.336.432-.504.144-.168.192-.288.288-.48.096-.192.048-.36-.024-.504-.072-.144-.648-1.56-.888-2.136-.234-.56-.47-.482-.648-.492-.168-.008-.36-.01-.552-.01-.192 0-.504.072-.768.36-.264.288-1.008.984-1.008 2.4s1.032 2.784 1.176 2.976c.144.192 2.032 3.102 4.921 4.347.687.296 1.224.473 1.64.605.69.22 1.32.19 1.816.116.552-.083 1.702-.696 1.942-1.37.24-.672.24-1.25.168-1.37-.072-.12-.264-.192-.552-.336z"/>
              </svg>
            </a>
            <a 
              href="mailto:leonautomotores@outlook.com" 
              class="text-slate-400 hover:text-blue-400 transition-colors flex items-center justify-center"
            >
              <span class="material-symbols-outlined text-[20px]">mail</span>
            </a>
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

  clickLogo() {
    this.clickInicio();
  }

  clickInicio() {
    this.closeMenu();
    if (this.isHomePage()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      this.router.navigate(['/']).then(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  clickCatalog() {
    this.closeMenu();
    if (this.router.url.startsWith('/catalog')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      this.router.navigate(['/catalog']).then(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  scrollToFinancing() {
    if (this.isHomePage()) {
      const el = document.getElementById('financiamiento-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          const el = document.getElementById('financiamiento-section');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      });
    }
  }

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
    this.vehicleService.updateFilters({ condition: [condition] });
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
