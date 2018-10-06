import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetsModule } from '../widgets.module';
import { AiChatbotComponent } from './ai-chatbot.component';

describe('AiChatbotComponent', () => {
  let component: AiChatbotComponent;
  let fixture: ComponentFixture<AiChatbotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ 
        WidgetsModule,
      ]
    })
    .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(AiChatbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
