import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'info' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      [ngClass]="[
        baseClasses,
        variantClasses[variant()]
      ]"
    >
      <ng-content></ng-content>
    </span>
  `,
  styles: `
    :host {
      display: inline-block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadgeComponent {
  variant = input<BadgeVariant>('info');

  readonly baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase';

  readonly variantClasses: Record<BadgeVariant, string> = {
    info: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    warning: 'bg-amber-50 text-amber-800 border border-amber-100',
    danger: 'bg-rose-50 text-rose-700 border border-rose-100'
  };
}
