import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';

export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/vehicles/pages/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'catalog',
        loadComponent: () => import('./features/vehicles/pages/catalog/catalog.component').then(m => m.CatalogComponent)
      },
      {
        path: 'vehicle/:id',
        loadComponent: () => import('./features/vehicles/pages/detail/detail.component').then(m => m.DetailComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

