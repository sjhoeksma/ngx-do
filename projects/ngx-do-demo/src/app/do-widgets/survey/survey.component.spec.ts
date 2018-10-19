import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetsModule} from '../widgets.module';
import { AppModule} from '../../app.module';
import { APP_BASE_HREF } from '@angular/common';
import { environment } from '../../../environments/environment.spec';
import { SurveyComponent } from './survey.component';


describe('SurveyComponent', () => {
  let component: SurveyComponent;
  let fixture: ComponentFixture<SurveyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ 
        AppModule,
        WidgetsModule,
      ],providers: [
        {provide: 'Environment', useValue: environment },
        {provide: APP_BASE_HREF, useValue: '/'}
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
