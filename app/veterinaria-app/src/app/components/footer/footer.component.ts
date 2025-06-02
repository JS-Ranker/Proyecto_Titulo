import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: false,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  showFooter = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = 100;
    const pageHeight = document.body.offsetHeight;
    this.showFooter = (scrollPosition >= pageHeight - threshold);
  }
}