import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { CoreModule } from '../core.module';
import { RouterModule } from '@angular/router';
import { RestangularModule } from 'ngx-restangular';
import { UserMenuComponent } from './user-menu.component';

describe('UserMenuComponent', () => {
  let component: UserMenuComponent;
  let fixture: ComponentFixture<UserMenuComponent>;

 beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ 
        CoreModule,
        RouterModule.forRoot([]),
        RestangularModule,
      ],providers: [
        {provide: 'Environment', useValue: []},
        {provide: APP_BASE_HREF, useValue: '/'}
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
