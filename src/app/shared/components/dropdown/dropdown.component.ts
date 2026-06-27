import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, Output, EventEmitter, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DropdownOption {
  value: any;
  label: string;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full text-left" [class.pointer-events-none]="disabled">
      @if (label) {
        <label class="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">
          {{ label }}
        </label>
      }
      
      <!-- Trigger Button -->
      <button
        type="button"
        (click)="toggle()"
        [ngClass]="[
          variant === 'glass' 
            ? 'bg-white/40 border border-white/60 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 px-3' 
            : 'bg-transparent border-0 focus:ring-0 focus:outline-hidden focus-visible:outline-hidden px-0',
          heightClass,
          customClass
        ]"
        class="w-full flex items-center justify-between text-sm font-bold text-brand-dark rounded-xl outline-hidden transition-all cursor-pointer"
      >
        <span class="truncate" [class.text-slate-400]="!selectedLabel()">
          {{ selectedLabel() || placeholder }}
        </span>
        <span 
          class="material-symbols-outlined text-slate-400 transition-transform duration-300"
          [style.transform]="isOpen() ? 'rotate(180deg)' : 'rotate(0deg)'"
        >
          expand_more
        </span>
      </button>

      <!-- Dropdown Panel (Opaque & Dynamic Width) -->
      @if (isOpen()) {
        <div 
          class="absolute right-0 z-50 mt-1.5 max-h-60 overflow-y-auto w-max min-w-full bg-white border border-slate-200 rounded-xl shadow-xl custom-scrollbar animate-fade-in-down"
        >
          <div class="py-1">
            @if (showNoneOption) {
              <button
                type="button"
                (click)="selectOption(undefined)"
                class="w-full text-left px-4 py-2.5 text-xs text-slate-400 hover:bg-slate-50 transition-colors font-medium cursor-pointer"
              >
                {{ noneLabel || placeholder }}
              </button>
            }
            @for (opt of options; track opt.value) {
              <button
                type="button"
                (click)="selectOption(opt.value)"
                [ngClass]="{
                  'bg-brand-primary/10 text-brand-primary font-bold': opt.value === value,
                  'text-brand-dark hover:bg-brand-primary/5 hover:text-brand-primary': opt.value !== value
                }"
                class="w-full text-left px-4 py-2.5 text-xs transition-colors font-semibold flex items-center justify-between cursor-pointer"
              >
                <span>{{ opt.label }}</span>
                @if (opt.value === value) {
                  <span class="material-symbols-outlined text-sm text-brand-primary">check</span>
                }
              </button>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .animate-fade-in-down {
      animation: fadeInDown 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownComponent {
  private readonly elementRef = inject(ElementRef);

  @Input() label?: string;
  @Input() placeholder = 'Seleccionar';
  @Input() options: DropdownOption[] = [];
  @Input() value: any = undefined;
  @Input() variant: 'glass' | 'plain' = 'glass';
  @Input() customClass = '';
  @Input() heightClass = 'h-12';
  @Input() disabled = false;
  @Input() showNoneOption = false;
  @Input() noneLabel?: string;

  @Output() valueChange = new EventEmitter<any>();

  readonly isOpen = signal(false);
  readonly selectedLabel = signal<string>('');

  constructor() {
    effect(() => {
      const match = this.options.find(o => o.value === this.value);
      this.selectedLabel.set(match ? match.label : '');
    }, { allowSignalWrites: true });
  }

  toggle(): void {
    if (!this.disabled) {
      this.isOpen.update(open => !open);
    }
  }

  selectOption(val: any): void {
    this.value = val;
    this.valueChange.emit(val);
    this.isOpen.set(false);
    
    const match = this.options.find(o => o.value === val);
    this.selectedLabel.set(match ? match.label : '');
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (this.isOpen() && !this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
