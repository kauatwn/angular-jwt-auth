import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { LogOut, LucideAngularModule, LucideIconData, X } from 'lucide-angular';

@Component({
  selector: 'app-logout-dialog',
  imports: [LucideAngularModule],
  templateUrl: './logout-dialog.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutDialogComponent {
  readonly logoutIcon: LucideIconData = LogOut;
  readonly xIcon: LucideIconData = X;

  readonly isOpen = input<boolean>(false);
  readonly close = output<void>();

  logout() {
    // Adicione sua lógica de logout aqui
    this.close.emit();
  }
}
