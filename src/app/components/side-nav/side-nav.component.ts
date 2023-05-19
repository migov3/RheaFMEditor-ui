import { Component, OnInit, ViewChild, Output, EventEmitter, Input, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavService } from '../../services/sidenav/sidenav.service';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements AfterViewInit {
  @ViewChild(MatSidenav, { static: false }) public sidenav!: MatSidenav;
  constructor(private sidenavService: SidenavService, private observer: BreakpointObserver,
    private cd: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
    this.observer.observe(["(max-width: 800px)"]).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = "over";
        this.sidenav.close();
      } else {
        this.sidenav.mode = "side";
        this.sidenav.open();
      };
    });
    this.cd.detectChanges();
  }

  toggle() {
    this.sidenavService.toggle();
  }
}
