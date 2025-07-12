import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CitasAgendadasPage } from './citas-agendadas.page';

describe('CitasAgendadasPage', () => {
  let component: CitasAgendadasPage;
  let fixture: ComponentFixture<CitasAgendadasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CitasAgendadasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
