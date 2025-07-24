import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule, LucideIconData, UserCheck } from 'lucide-angular';
import { timer } from 'rxjs';
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

  isLogoutDialogOpen = signal(false);

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
      this.router.navigate(['/login']);
    });
  }
}
