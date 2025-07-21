import {
  ChangeDetectionStrategy,
  Component,
  effect,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, LucideIconData, UserPlus } from 'lucide-angular';
import { passwordMatchValidator } from '../../shared/validators/password-match.validator';

@Component({
  selector: 'app-register',
  imports: [LucideAngularModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  readonly userPlusIcon: LucideIconData = UserPlus;

  readonly form = new FormGroup(
    {
      name: new FormControl('', {
        validators: [Validators.required, Validators.minLength(2)],
      }),
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)],
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required],
      }),
    },
    { validators: passwordMatchValidator() },
  );

  readonly fields = [
    {
      type: 'text',
      controlName: 'name',
      label: 'Nome completo',
      placeholder: 'Seu nome',
      error: 'Nome deve ter pelo menos 2 caracteres',
      autocomplete: 'name',
    },
    {
      type: 'email',
      controlName: 'email',
      label: 'E-mail',
      placeholder: 'seu@email.com',
      error: 'Informe um e-mail válido',
      autocomplete: 'email',
    },
    {
      type: 'password',
      controlName: 'password',
      label: 'Senha',
      placeholder: '••••••••',
      error: 'Senha deve ter pelo menos 6 caracteres',
      autocomplete: 'new-password',
    },
    {
      type: 'password',
      controlName: 'confirmPassword',
      label: 'Confirmar senha',
      placeholder: '••••••••',
      error: 'Confirmação de senha obrigatória',
      autocomplete: 'new-password',
    },
  ];

  private readonly formStatus = signal(this.form.status);

  private readonly formStatusEffect = effect((onCleanup) => {
    const subscription = this.form.statusChanges.subscribe((status) => {
      this.formStatus.set(status);
    });
    onCleanup(() => subscription.unsubscribe());
  });

  onSubmit() {
    if (this.form.valid) {
      // TODO: Lógica para enviar os dados do formulário
      console.log('Formulário enviado com sucesso:', this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
