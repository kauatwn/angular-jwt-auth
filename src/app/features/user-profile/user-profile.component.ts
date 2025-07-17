import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideAngularModule, LucideIconData, UserCheck } from 'lucide-angular';

@Component({
  selector: 'app-user-profile',
  imports: [LucideAngularModule],
  templateUrl: './user-profile.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent {
  readonly userCheck: LucideIconData = UserCheck;
}
