import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  LoaderCircle,
  Lock,
  LucideAngularModule,
  LucideIconData,
} from 'lucide-angular';
import { AuthService } from '../../core/services/auth/auth.service';

import { timer } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  imports: [LucideAngularModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly lockIcon: LucideIconData = Lock;
  readonly loaderCircleIcon: LucideIconData = LoaderCircle;

  readonly form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

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
  readonly loginError = signal<string | null>(null);
  readonly isLoading = signal(false);
  readonly isFormValid = signal(this.form.valid);

  readonly isDisabled = computed(() => this.isLoading() || !this.isFormValid());

  private readonly formStatusEffect = effect((onCleanup) => {
    const subscription = this.form.statusChanges.subscribe((status) => {
      this.formStatus.set(status);
    });

    onCleanup(() => subscription.unsubscribe());
  });

  private readonly clearLoginErrorEffect = effect((onCleanup) => {
    const subscription = this.form.valueChanges.subscribe(() => {
      if (this.loginError()) {
        this.loginError.set(null);
      }
    });

    onCleanup(() => subscription.unsubscribe());
  });

  private readonly formValidityEffect = effect((onCleanup) => {
    const subscription = this.form.statusChanges.subscribe(() => {
      this.isFormValid.set(this.form.valid);
    });

    onCleanup(() => subscription.unsubscribe());
  });

  onSubmit() {
    this.loginError.set(null);

    if (this.form.valid) {
      this.isLoading.set(true);

      const { email, password } = this.form.getRawValue();

      if (!email || !password) {
        // Delay para UX consistente mesmo em erro de preenchimento
        timer(500).subscribe(() => this.isLoading.set(false));
        return;
      }

      this.authService
        .login({ email, password })
        .pipe(
          finalize(() => {
            // Delay mínimo de 500ms para UX consistente
            timer(500).subscribe(() => this.isLoading.set(false));
          }),
        )
        .subscribe({
          next: () => {
            this.router.navigate(['/user-profile']);
          },
          error: (error: unknown) => {
            // Delay para exibir o erro junto com o fim do loading
            timer(500).subscribe(() => {
              this.loginError.set(this.parseLoginError(error));
            });
          },
        });
    } else {
      this.form.markAllAsTouched();
      // Delay para feedback visual mesmo em formulário inválido
      timer(500).subscribe(() => this.isLoading.set(false));
    }
  }

  private parseLoginError(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return 'Erro desconhecido. Por favor, tente novamente ou contate o suporte.';
    }

    if (error.status === HttpStatusCode.Unauthorized) {
      // TODO: Obter mensagem de erro da API
      // // Precisa tipar o erro para acessar a propriedade 'error?.message'
      // const apiMessage = error.error?.message;
      // if (typeof apiMessage === 'string') {
      //   return apiMessage; // Exibe a mensagem real da API
      // }

      return 'E-mail ou senha inválidos.';
    }

    return 'Erro ao fazer login. Tente novamente mais tarde.';
  }
}
