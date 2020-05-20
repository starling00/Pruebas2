import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreloginPage } from './prelogin.page';

describe('PreloginPage', () => {
  let component: PreloginPage;
  let fixture: ComponentFixture<PreloginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreloginPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreloginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
