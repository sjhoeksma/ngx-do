import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetsModule } from '../widgets.module';
import { PricingPlanComponent } from './pricing-plan.component';

describe('PricingPlanComponent', () => {
  let component: PricingPlanComponent;
  let fixture: ComponentFixture<PricingPlanComponent>;

   beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ 
        WidgetsModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
