import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LucideAngularModule, LucideIconData, UserCheck } from 'lucide-angular';
import { LogoutDialogComponent } from './components/logout-dialog/logout-dialog.component';

@Component({
  selector: 'app-user-profile',
  imports: [LucideAngularModule, LogoutDialogComponent],
  templateUrl: './user-profile.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent {
  readonly userCheckIcon: LucideIconData = UserCheck;

  isLogoutDialogOpen = signal(false);

  openLogoutDialog(): void {
    this.isLogoutDialogOpen.set(true);
  }

  closeLogoutDialog(): void {
    this.isLogoutDialogOpen.set(false);
  }

  handleLogout(): void {
    // lógica real de logout aqui
    this.closeLogoutDialog();
  }
}
