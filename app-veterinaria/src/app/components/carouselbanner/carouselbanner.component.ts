import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

interface SlideData {
  id: number;
  image: string;
  alt: string;
  theme: 'veterinaria' | 'ecommerce' | 'adopcion';
  title: string;
  description: string;
  buttonText: string;
}

@Component({
  selector: 'app-carouselbanner',
  templateUrl: './carouselbanner.component.html',
  styleUrls: ['./carouselbanner.component.scss'],
  standalone: false,
})
export class CarouselbannerComponent implements OnInit, OnDestroy {

  activeIndex: number = 0;
  isTransitioning: boolean = false;
  isHovered: boolean = false;
  private autoSlideInterval: any;

  slides: SlideData[] = [
    {
      id: 0,
      image: 'assets/images/veterinaria.jpg',
      alt: 'Servicios Veterinarios',
      theme: 'veterinaria',
      title: 'Cuidamos a quien más quieres',
      description: 'Atención médica veterinaria de calidad con un equipo profesional',
      buttonText: 'Ver servicios veterinarios'
    },
    {
      id: 1,
      image: 'assets/images/ecommerce.jpg',
      alt: 'Tienda Online',
      theme: 'ecommerce',
      title: 'Todo para tu mascota en un solo lugar',
      description: 'Productos de calidad con entrega rápida a domicilio',
      buttonText: 'Visitar nuestra tienda'
    },
    {
      id: 2,
      image: 'assets/images/adopcion.jpg',
      alt: 'Adopciones',
      theme: 'adopcion',
      title: 'Adopta una vida, cambia dos destinos',
      description: 'En Happy Pet trabajamos para dar un nuevo hogar a mascotas rescatadas',
      buttonText: 'Conoce nuestras mascotas'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  handleSlideChange(selectedIndex: number) {
    if (selectedIndex === this.activeIndex) return;

    this.isTransitioning = true;
    this.activeIndex = selectedIndex;

    setTimeout(() => {
      this.isTransitioning = false;
    }, 600);
  }

  goToPrevious() {
    const prevIndex = (this.activeIndex - 1 + this.slides.length) % this.slides.length;
    this.handleSlideChange(prevIndex);
  }

  goToNext() {
    const nextIndex = (this.activeIndex + 1) % this.slides.length;
    this.handleSlideChange(nextIndex);
  }

  onMouseEnter() {
    this.isHovered = true;
    this.stopAutoSlide();
  }

  onMouseLeave() {
    this.isHovered = false;
    this.startAutoSlide();
  }

  onMainActionClick() {
    const currentSlide = this.slides[this.activeIndex];

    switch (currentSlide.theme) {
      case 'veterinaria':
        this.router.navigate(['/especialidadespage']);
        break;
      case 'ecommerce':
        this.router.navigate(['/shop']);
        break;
      case 'adopcion':
        window.open(
          'https://docs.google.com/forms/d/e/1FAIpQLScV0GtttMaoxsC-QAA0tQU0IYlwFlTQPiOOGK0NRGroD0LIGw/viewform',
          '_blank',
          'noopener,noreferrer'
        );
        break;
    }
  }

  getCurrentSlide(): SlideData {
    return this.slides[this.activeIndex];
  }

  getSlideThemeClass(): string {
    return `${this.getCurrentSlide().theme}Message`;
  }

  getCarouselClasses(): string {
    let classes = 'carousel-wrapper';
    if (this.isTransitioning) {
      classes += ' transitioning';
    }
    return classes;
  }

  private startAutoSlide() {
    this.stopAutoSlide();
    this.autoSlideInterval = setInterval(() => {
      if (!this.isHovered) {
        this.goToNext();
      }
    }, 7000);
  }

  private stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }
}
