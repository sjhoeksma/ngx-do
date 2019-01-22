import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PagesModule} from '../pages.module';
import { APP_BASE_HREF } from '@angular/common';
import { ProfileComponent } from './profile.component';


describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
     imports: [
        PagesModule,
      ], providers: [
        {provide: 'Environment', useValue: {} },
        {provide: APP_BASE_HREF, useValue: '/'}
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
