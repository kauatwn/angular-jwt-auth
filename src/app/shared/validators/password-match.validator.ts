import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(
  passwordKey = 'password',
  confirmPasswordKey = 'confirmPassword',
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const passwordControl = group.get(passwordKey);
    const confirmPasswordControl = group.get(confirmPasswordKey);

    if (!passwordControl || !confirmPasswordControl) {
      return null; // campos não encontrados
    }

    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;

    // Só valida mismatch se os dois campos estiverem preenchidos
    if (!password || !confirmPassword) {
      return null;
    }

    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  };
}
