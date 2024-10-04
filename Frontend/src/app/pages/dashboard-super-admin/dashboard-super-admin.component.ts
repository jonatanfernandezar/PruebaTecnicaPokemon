import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../../app/services/api-auth.service';

@Component({
  selector: 'app-dashboard-super-admin',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dashboard-super-admin.component.html',
  styleUrl: './dashboard-super-admin.component.css'
})

export class DashboardSuperAdminComponent { }