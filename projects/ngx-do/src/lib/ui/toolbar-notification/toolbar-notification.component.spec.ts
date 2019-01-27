import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxDoCoreModule } from '../../core/core.module';
import { ToolbarNotificationComponent } from './toolbar-notification.component';

describe('ToolbarNotificationComponent', () => {
  let component: ToolbarNotificationComponent;
  let fixture: ComponentFixture<ToolbarNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxDoCoreModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
