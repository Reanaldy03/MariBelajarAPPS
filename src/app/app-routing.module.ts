import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/dashboard',
    loadChildren: () => import('./pages/admin/dashboard/dashboard.module').then(m => m.DashboardPageModule),
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/chat-list',
    loadChildren: () => import('./pages/admin/chat-list/chat-list.module').then(m => m.ChatListPageModule),
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/chat/:studentId',
    loadChildren: () => import('./pages/admin/chat/chat.module').then(m => m.ChatPageModule),
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/verification/:id',
    loadChildren: () => import('./pages/admin/verification/verification.module').then(m => m.VerificationPageModule),
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/package-form/:id',
    loadChildren: () => import('./pages/admin/package-form/package-form.module').then(m => m.PackageFormPageModule),
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/profile',
    loadChildren: () => import('./pages/admin/profile/profile.module').then(m => m.AdminProfilePageModule),
    canActivate: [AdminGuard]
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
