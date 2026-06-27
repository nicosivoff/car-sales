import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'whatsapp' | 'outline';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled() || loading()"
      (click)="onClick.emit($event)"
      [ngClass]="[
        baseClasses,
        variantClasses[variant()],
        disabled() || loading() ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5 active:translate-y-0'
      ]"
    >
      @if (loading()) {
        <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Procesando...</span>
      } @else {
        <ng-content></ng-content>
      }
    </button>
  `,
  styles: `
    :host {
      display: inline-block;
      width: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  // Inputs definidos usando la nueva API de inputs de Angular (Signal Inputs)
  type = input<'button' | 'submit' | 'reset'>('button');
  variant = input<ButtonVariant>('primary');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);

  // Output usando la nueva API de outputs de Angular
  onClick = output<MouseEvent>();

  readonly baseClasses = 'w-full inline-flex items-center justify-center px-5 py-3 text-sm font-semibold rounded-xl transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-offset-2';

  readonly variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-brand-primary text-white hover:bg-indigo-700 shadow-md focus:ring-indigo-500',
    secondary: 'bg-brand-surface text-white hover:bg-slate-700 shadow-md focus:ring-slate-500',
    whatsapp: 'bg-accent text-white hover:bg-emerald-600 shadow-md focus:ring-emerald-500',
    outline: 'border border-slate-300 text-slate-700 bg-transparent hover:bg-slate-50 focus:ring-slate-400'
  };
}
