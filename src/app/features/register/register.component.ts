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
  LucideAngularModule,
  LucideIconData,
  UserPlus,
} from 'lucide-angular';
import { finalize, timer } from 'rxjs';
import { AuthService } from '../../core/services/auth/auth.service';
import { passwordMatchValidator } from '../../shared/validators/password-match.validator';

@Component({
  selector: 'app-register',
  imports: [LucideAngularModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly userPlusIcon: LucideIconData = UserPlus;
  readonly loaderCircleIcon: LucideIconData = LoaderCircle;

  readonly isLoading = signal(false);

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
  readonly registerError = signal<string | null>(null);
  readonly isFormValid = signal(this.form.valid);

  readonly canSubmit = computed(() => !this.isLoading() && this.isFormValid());
  readonly isDisabled = computed(() => this.isLoading() || !this.isFormValid());

  private readonly formValidityEffect = effect((onCleanup) => {
    const subscription = this.form.statusChanges.subscribe(() => {
      this.isFormValid.set(this.form.valid);
    });

    onCleanup(() => subscription.unsubscribe());
  });

  private readonly formStatusEffect = effect((onCleanup) => {
    const subscription = this.form.statusChanges.subscribe((status) => {
      this.formStatus.set(status);
    });
    onCleanup(() => subscription.unsubscribe());
  });

  onSubmit() {
    this.registerError.set(null);

    if (this.form.valid) {
      this.isLoading.set(true);

      const { name, email, password, confirmPassword } =
        this.form.getRawValue();

      if (!name || !email || !password || !confirmPassword) {
        timer(500).subscribe(() => this.isLoading.set(false));
        return;
      }

      this.authService
        .register({ name, email, password, confirmPassword })
        .pipe(
          finalize(() => {
            timer(500).subscribe(() => this.isLoading.set(false));
          }),
        )
        .subscribe({
          next: () => {
            this.router.navigate(['/user-profile']);
          },
          error: (error: unknown) => {
            timer(500).subscribe(() => {
              this.registerError.set(this.parseRegisterError(error));
            });
          },
        });
    } else {
      this.form.markAllAsTouched();
      timer(500).subscribe(() => this.isLoading.set(false));
    }
  }

  private parseRegisterError(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return 'Erro desconhecido. Por favor, tente novamente ou contate o suporte.';
    }

    if (error.status === HttpStatusCode.BadRequest) {
      // TODO: Obter mensagem de erro da API
      // // Precisa tipar o erro para acessar a propriedade 'error?.message'
      // const apiMessage = error.error?.message;
      // if (typeof apiMessage === 'string') {
      //   return apiMessage; // Exibe a mensagem real da API
      // }
      return 'Falha ao criar conta. Verifique os dados e tente novamente.';
    }

    return 'Erro ao criar conta. Tente novamente mais tarde.';
  }
}
