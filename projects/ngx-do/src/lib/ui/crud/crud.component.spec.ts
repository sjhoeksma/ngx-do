import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { NgxDoCoreModule} from '../../core/core.module';
import { CRUDComponent } from './crud.component';

describe('CRUDComponent', () => {
  let component: CRUDComponent;
  let fixture: ComponentFixture<CRUDComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxDoCoreModule,
      ], providers: [
        {provide: 'Environment', useValue: {}},
        {provide: APP_BASE_HREF, useValue: '/'}
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CRUDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
