import { Component, OnInit, OnDestroy } from '@angular/core';

interface SlideData {
  id: number;
  image: string;
  alt: string;
  theme: string;
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
      image: '../../../assets/images/veterinaria.jpg',
      alt: 'Servicios Veterinarios',
      theme: 'veterinaria',
      title: 'Cuidamos a quien más quieres',
      description: 'Atención médica veterinaria de calidad con un equipo profesional',
      buttonText: 'Ver servicios veterinarios'
    },
    {
      id: 1,
      image: '../../../assets/images/ecommerce.jpg',
      alt: 'Tienda Online',
      theme: 'ecommerce',
      title: 'Todo para tu mascota en un solo lugar',
      description: 'Productos de calidad con entrega rápida a domicilio',
      buttonText: 'Visitar nuestra tienda'
    },
    {
      id: 2,
      image: '../../../assets/images/adopcion.jpg',
      alt: 'Adopciones',
      theme: 'adopcion',
      title: 'Adopta una vida, cambia dos destinos',
      description: 'En Happy Pet trabajamos para dar un nuevo hogar a mascotas rescatadas',
      buttonText: 'Conoce nuestros peludos'
    }
  ];

  constructor() { }

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      if (!this.isHovered) {
        this.nextSlide();
      }
    }, 7000);
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  onMouseEnter() {
    this.isHovered = true;
  }

  onMouseLeave() {
    this.isHovered = false;
  }

  goToSlide(index: number) {
    if (index !== this.activeIndex && !this.isTransitioning) {
      this.setTransitioning(true);
      this.activeIndex = index;
      setTimeout(() => this.setTransitioning(false), 600);
    }
  }

  nextSlide() {
    const nextIndex = (this.activeIndex + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }

  prevSlide() {
    const prevIndex = (this.activeIndex - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prevIndex);
  }

  private setTransitioning(state: boolean) {
    this.isTransitioning = state;
  }

  getCurrentSlide(): SlideData {
    return this.slides[this.activeIndex];
  }

  onMainActionClick() {
    const currentSlide = this.getCurrentSlide();
    console.log(`Acción para: ${currentSlide.theme}`);
    switch(currentSlide.theme) {
      case 'veterinaria':
        // Navegar a servicios veterinarios
        break;
      case 'ecommerce':
        // Navegar a tienda
        break;
      case 'adopcion':
        // Navegar a adopciones
        break;
    }
  }
}