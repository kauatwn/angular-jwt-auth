import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AlertTriangle, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-not-found',
  imports: [LucideAngularModule, RouterLink],
  templateUrl: './not-found.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {
  protected readonly alertTriangleIcon = AlertTriangle;
}
