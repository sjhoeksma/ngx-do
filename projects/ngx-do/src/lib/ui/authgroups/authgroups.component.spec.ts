import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { NgxDoCoreModule} from '../../core/core.module';
import { AuthGroupsComponent } from './authgroups.component';

describe('AuthGroupsComponent', () => {
  let component: AuthGroupsComponent;
  let fixture: ComponentFixture<AuthGroupsComponent>;

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
    fixture = TestBed.createComponent(AuthGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
