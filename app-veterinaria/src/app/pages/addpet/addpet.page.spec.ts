import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddpetPage } from './addpet.page';

describe('AddpetPage', () => {
  let component: AddpetPage;
  let fixture: ComponentFixture<AddpetPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddpetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
