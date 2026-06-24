import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
  {
    path: 'splash',
    loadChildren: () =>
      import('./pages/splash/splash-module').then((m) => m.SplashModule),
  },
  {
    path: 'auth/login',
    loadChildren: () =>
      import('./pages/auth/login/login-module').then((m) => m.LoginModule),
  },
  {
    path: 'auth/verify',
    loadChildren: () =>
      import('./pages/auth/verify/verify-module').then((m) => m.VerifyModule),
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./pages/tabs/tabs.module').then((m) => m.TabsModule),
  },
  // Legacy redirects
  {
    path: 'dashboard',
    redirectTo: '/tabs/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'transactions',
    redirectTo: '/tabs/transactions',
    pathMatch: 'full',
  },
  {
    path: 'profile',
    redirectTo: '/tabs/profile',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
