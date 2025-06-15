import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EspecialidadespagePage } from './especialidadespage.page';

describe('EspecialidadespagePage', () => {
  let component: EspecialidadespagePage;
  let fixture: ComponentFixture<EspecialidadespagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EspecialidadespagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
