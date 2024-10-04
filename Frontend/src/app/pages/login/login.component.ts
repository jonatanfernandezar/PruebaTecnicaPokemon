import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/api-auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatIconModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  errorMessage: string | null = null;
  formularioLogin: FormGroup;

  constructor(
    private formBuilder: FormBuilder, private userService: UserService, private router: Router) {
    this.formularioLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {}

  enviarLogin() {
    if (this.formularioLogin.valid) {
      const { email, password } = this.formularioLogin.value;

      this.userService.login(email, password).subscribe(
        response => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            Swal.fire({
              icon: 'success',
              title: '!Ha iniciado sesion exitosamente!',
            });

            const role = this.userService.getRole();
            console.log('El rol es: ', role);

            switch (role) {
              case 'is_super_admin':
                this.router.navigate(['/dashboard-super-admin']);
                break;
              case 'user':
                this.router.navigate(['/dashboard-user']);
                break;
              default:
                Swal.fire({
                  icon: 'warning',
                  title: 'No tienes permisos para entrar',
                });
                this.router.navigate(['/login']);
                break;
            }
          } else {
            Swal.fire({
              icon: 'warning',
              title: 'No tienes permisos para entrar',
            });
          }
        },
        error => {
          if (error.status === 401) {
            this.errorMessage = 'Usuario no encontrado';
            Swal.fire({
              icon: 'warning',
              title: 'Este usuario no existe',
            });
          } else if (error.status === 400) {
            this.errorMessage = 'Contraseña incorrecta';
          } else {
            this.errorMessage = 'Error en el servidor';
          }
        }
      );
    }
  }

  hasErrors(controlName: string, errorType: string) {
    const control = this.formularioLogin.get(controlName);
    return control?.hasError(errorType) && control?.touched;
  }
}
