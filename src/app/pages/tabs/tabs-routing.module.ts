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
          {
            path: 'simulator',
            loadChildren: () =>
              import('../simulator/simulator-module').then(
                (m) => m.SimulatorModule
              ),
          },
          {
            path: 'stores',
            loadChildren: () =>
              import('../stores/stores-module').then(
                (m) => m.StoresModule
              ),
          },
          {
            path: 'request-limit-increase/:id',
            loadChildren: () =>
              import('../limit-increase/request/request-module').then(
                (m) => m.RequestLimitIncreaseModule
              ),
          },
          {
            path: 'limit-increase-requests',
            loadChildren: () =>
              import('../limit-increase/list/list-module').then(
                (m) => m.LimitIncreaseListModule
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
