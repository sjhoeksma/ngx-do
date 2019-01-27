import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxDoCoreModule } from '../../core/core.module';
import { FullscreenComponent } from './fullscreen.component';

describe('FullscreenComponent', () => {
  let component: FullscreenComponent;
  let fixture: ComponentFixture<FullscreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxDoCoreModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
