import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetsModule } from '../widgets.module';
import { D3UsaComponent } from './d3-usa.component';

describe('D3UsaComponent', () => {
  let component: D3UsaComponent;
  let fixture: ComponentFixture<D3UsaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ 
        WidgetsModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3UsaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
