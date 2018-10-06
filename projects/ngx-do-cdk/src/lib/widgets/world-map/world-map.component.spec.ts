import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetsModule } from '../widgets.module';
import { WorldMapComponent } from './world-map.component';

describe('WorldMapComponent', () => {
  let component: WorldMapComponent;
  let fixture: ComponentFixture<WorldMapComponent>;

   beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ 
        WidgetsModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorldMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
