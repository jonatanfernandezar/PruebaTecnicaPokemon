import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { DashboardUserComponent } from './pages/dashboard-user/dashboard-user.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/roles.guard';
import { DashboardSuperAdminComponent } from './pages/dashboard-super-admin/dashboard-super-admin.component';
import { PokemonDetailComponent } from './pages/pokemon-detail/pokemon-detail.component';
import { PagoExitosoComponent } from './pages/pago-exitoso/pago-exitoso.component';
import { GestionComprasComponent } from './pages/dashboard-super-admin/gestion-compras/gestion-compras.component';
import { SuperAdminComponent } from './pages/dashboard-super-admin/super-admin/super-admin.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'dashboard-user', component: DashboardUserComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['user'] } },
    { path: 'dashboard-user/pokemon/:id', component: PokemonDetailComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['user'] } },
    {
        path: 'dashboard-super-admin',
        component: SuperAdminComponent,
        canActivate: [AuthGuard, RoleGuard], 
        data: { roles: ['is_super_admin'] },
        children: [
            { path: 'gestion-compras', component: GestionComprasComponent },
        ]
    },
    { path: 'dashboard-user/payment-success', component: PagoExitosoComponent },
    { path: '**', redirectTo: 'login', pathMatch: 'full' }
];