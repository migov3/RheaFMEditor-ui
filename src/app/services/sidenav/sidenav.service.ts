import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  private sidenav!: MatSidenav;

  public setSidenav(sidenav: MatSidenav): void {
    this.sidenav = sidenav;
  }

  public open(): void {
    this.sidenav.open();
  }

  public close(): void {
    this.sidenav.close();
  }

  public toggle(): void {
    this.sidenav.toggle();
  }
}
