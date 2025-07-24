import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import {
  LoaderCircle,
  LogOut,
  LucideAngularModule,
  LucideIconData,
  X,
} from 'lucide-angular';

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
  readonly loaderCircleIcon: LucideIconData = LoaderCircle;

  readonly isDialogOpen = input.required<boolean>();
  readonly isLoading = input.required<boolean>();
  readonly confirmed = output<void>();
  readonly closed = output<void>();
}
