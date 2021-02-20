import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoTazaComponent } from './tipo-taza.component';

describe('TipoTazaComponent', () => {
  let component: TipoTazaComponent;
  let fixture: ComponentFixture<TipoTazaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoTazaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoTazaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
