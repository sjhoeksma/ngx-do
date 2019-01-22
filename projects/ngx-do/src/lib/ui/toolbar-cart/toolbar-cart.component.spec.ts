import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { CoreModule } from '../../core/core.module';
import { RouterModule } from '@angular/router';
import { ToolbarCartComponent } from './toolbar-cart.component';

describe('ToolbarCartComponent', () => {
  let component: ToolbarCartComponent;
  let fixture: ComponentFixture<ToolbarCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        CoreModule,
      ], providers: [
        {provide: 'Environment', useValue: {}},
        {provide: APP_BASE_HREF, useValue: '/'}
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
