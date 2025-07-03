import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialClinicoVeterinarioPage } from './historial-clinico-veterinario.page';

describe('HistorialClinicoVeterinarioPage', () => {
  let component: HistorialClinicoVeterinarioPage;
  let fixture: ComponentFixture<HistorialClinicoVeterinarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialClinicoVeterinarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
