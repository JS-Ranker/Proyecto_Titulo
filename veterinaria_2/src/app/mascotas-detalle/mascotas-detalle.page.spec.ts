import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MascotasDetallePage } from './mascotas-detalle.page';

describe('MascotasDetallePage', () => {
  let component: MascotasDetallePage;
  let fixture: ComponentFixture<MascotasDetallePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MascotasDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
