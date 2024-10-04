import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../../services/api-auth.service';

@Component({
  selector: 'app-super-admin',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './super-admin.component.html',
  styleUrl: './super-admin.component.css'
})

export class SuperAdminComponent {
  constructor(private router: Router, private userService: UserService) { }

  logout() {
    this.userService.logout();
  }
}
