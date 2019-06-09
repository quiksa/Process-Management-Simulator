import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'processManagementSimulator';

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.navigate(['/simulator'])
  }

  checkIfHomePage(): boolean {
    if (window.location.pathname === "/" || window.location.pathname.toLowerCase() === "/simulator/") {
      return true;
    }
    return false;
  }
}
