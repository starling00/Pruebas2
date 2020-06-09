import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Agencies02Page } from './agencies02.page';

describe('Agencies02Page', () => {
  let component: Agencies02Page;
  let fixture: ComponentFixture<Agencies02Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Agencies02Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Agencies02Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
