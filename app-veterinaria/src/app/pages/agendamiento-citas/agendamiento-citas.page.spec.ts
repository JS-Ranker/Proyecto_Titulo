import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgendamientoCitasPage } from './agendamiento-citas.page';

describe('AgendamientoCitasPage', () => {
  let component: AgendamientoCitasPage;
  let fixture: ComponentFixture<AgendamientoCitasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendamientoCitasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
