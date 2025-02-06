import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HomePageComponent } from './tianguis-app/pages/home/home-page/home-page.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { NavBarComponent } from './shared/components/nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';
import { TabsComponent } from './core/components/tabs/tabs.component';
import { HeaderComponent } from './core/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive, TabsComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'EzMarket';
}
