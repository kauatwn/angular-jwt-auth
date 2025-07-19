import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertTriangle, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-not-found',
  imports: [LucideAngularModule],
  templateUrl: './not-found.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {
  protected readonly alertTriangleIcon = AlertTriangle;
  private readonly router = inject(Router);

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
