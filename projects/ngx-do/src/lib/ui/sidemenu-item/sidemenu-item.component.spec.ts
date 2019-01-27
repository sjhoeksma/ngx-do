import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxDoCoreModule } from '../../core/core.module';
import { SidemenuItemComponent } from './sidemenu-item.component';

describe('SidemenuItemComponent', () => {
  let component: SidemenuItemComponent;
  let fixture: ComponentFixture<SidemenuItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxDoCoreModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidemenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
