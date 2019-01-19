import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetsModule } from '../widgets.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AiChatbotBarComponent } from './ai-chatbot-bar.component';

describe('AiChatbotBarComponent', () => {
  let component: AiChatbotBarComponent;
  let fixture: ComponentFixture<AiChatbotBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        WidgetsModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AiChatbotBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
