import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'processManagementSimulator';

  checkIfHomePage(): boolean {
    if (window.location.pathname === "/" || window.location.pathname.toLowerCase() === "/simulator/") {
      return true;
    }
    return false;
  }
}
