import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule, LucideIconData, UserCheck } from 'lucide-angular';
import { timer } from 'rxjs';
import { UserProfileResponse } from '../../core/models/auth.model';
import { AuthService } from '../../core/services/auth/auth.service';
import { LogoutDialogComponent } from './components/logout-dialog/logout-dialog.component';

@Component({
  selector: 'app-user-profile',
  imports: [LucideAngularModule, LogoutDialogComponent],
  templateUrl: './user-profile.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly userCheckIcon: LucideIconData = UserCheck;

  readonly isLoggingOut = signal(false);
  readonly isLogoutDialogOpen = signal(false);
  readonly userProfile = signal<UserProfileResponse | null>(null);

  readonly loadUserProfileEffect = effect(() => {
    this.authService.getUserProfile().subscribe({
      next: (user) => this.userProfile.set(user),
      error: () => this.router.navigate(['/login']),
    });
  });

  readonly userInitial = computed(() => {
    const name = this.userProfile()?.name ?? '';
    return name ? name[0].toUpperCase() : '?';
  });

  openLogoutDialog(): void {
    this.isLogoutDialogOpen.set(true);
  }

  closeLogoutDialog(): void {
    this.isLogoutDialogOpen.set(false);
  }

  handleLogout(): void {
    this.isLoggingOut.set(true);

    timer(500).subscribe(() => {
      this.authService.logout();
      this.closeLogoutDialog();
      this.isLoggingOut.set(false);
    });
  }
}
