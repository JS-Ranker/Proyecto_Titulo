import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MascotasListaPage } from './mascotas-lista.page';

describe('MascotasListaPage', () => {
  let component: MascotasListaPage;
  let fixture: ComponentFixture<MascotasListaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MascotasListaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
