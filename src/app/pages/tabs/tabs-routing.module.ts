import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsComponent } from './tabs.component';
import { AuthGuard } from '../../guards/auth-guard';

const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
    children: [
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../dashboard/dashboard-module').then((m) => m.DashboardModule),
          },
          {
            path: 'credits/:id',
            loadChildren: () =>
              import('../credits/detail/detail-module').then((m) => m.DetailModule),
          },
          {
            path: 'credits/:id/periods',
            loadChildren: () =>
              import('../credits/periods/periods-module').then((m) => m.PeriodsModule),
          },
          {
            path: 'credits/:id/amortization',
            loadChildren: () =>
              import('../credits/amortization/amortization-module').then(
                (m) => m.AmortizationModule
              ),
          },
          {
            path: 'credits/:id/pay',
            loadChildren: () =>
              import('../credits/pay/pay-module').then(
                (m) => m.PayModule
              ),
          },
        ],
      },
      {
        path: 'transactions',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../transactions/transactions-module').then(
            (m) => m.TransactionsModule
          ),
      },
      {
        path: 'profile',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('../profile/profile-module').then((m) => m.ProfileModule),
      },
      {
        path: '',
        redirectTo: '/tabs/dashboard',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsRoutingModule {}
