import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validador personalizado para verificar si dos contraseñas coinciden
export function matchPasswords(password: string, repeatPassword: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const passwordControl = control.get(password);
    const repeatPasswordControl = control.get(repeatPassword);

    if (!passwordControl || !repeatPasswordControl) {
      return null; // Si no hay controles, no valida.
    }

    // Compara los valores de los controles.
    const passwordsMatch = passwordControl.value === repeatPasswordControl.value;

    // Retorna un error si las contraseñas no coinciden.
    return passwordsMatch ? null : { passwordsMismatch: true };
  };
}
