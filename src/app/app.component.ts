import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  sytles: ``,
})
export class AppComponent {
  title = 'angular-jwt-auth';
}
