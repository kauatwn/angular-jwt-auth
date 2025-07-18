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
import { Lock, LucideAngularModule, LucideIconData } from 'lucide-angular';
import { passwordMatchValidator } from '../../shared/validators/password-match.validator';

@Component({
  selector: 'app-login',
  imports: [LucideAngularModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  readonly lockIcon: LucideIconData = Lock;

  readonly form = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    },
    { validators: passwordMatchValidator() },
  );

  readonly fields = [
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
      error: 'Senha obrigatória',
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
