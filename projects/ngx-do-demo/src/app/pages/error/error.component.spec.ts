import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PagesModule} from '../pages.module';
import { AppModule} from '../../app.module';
import { APP_BASE_HREF } from '@angular/common';
import { MainModule } from '../../../main.module';
import { ErrorComponent } from './error.component';
import { environment } from '../../../environments/environment.spec';

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
     imports: [ 
        MainModule, 
        AppModule,
        PagesModule,
      ],providers: [
        {provide: 'Environment', useValue: environment},
        {provide: APP_BASE_HREF, useValue: '/'}
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
