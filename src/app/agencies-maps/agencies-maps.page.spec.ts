import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgenciesMapsPage } from './agencies-maps.page';

describe('AgenciesMapsPage', () => {
  let component: AgenciesMapsPage;
  let fixture: ComponentFixture<AgenciesMapsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgenciesMapsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgenciesMapsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
