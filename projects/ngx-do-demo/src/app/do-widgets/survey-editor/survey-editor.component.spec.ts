import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetsModule} from '../widgets.module';
import { AppModule} from '../../app.module';
import { APP_BASE_HREF } from '@angular/common';
import { environment } from '../../../environments/environment.spec';
import { SurveyEditorComponent } from './survey-editor.component';


describe('SurveyEditorComponent', () => {
  let component: SurveyEditorComponent;
  let fixture: ComponentFixture<SurveyEditorComponent>;

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
    fixture = TestBed.createComponent(SurveyEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
