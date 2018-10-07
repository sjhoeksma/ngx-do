import { TestBed, async } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RestangularModule } from 'ngx-restangular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DoModule } from './do.module';
import { DoComponent } from './do.component';

describe('DoComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ 
        RouterModule.forRoot([]),
        DoModule,
        RestangularModule,
        BrowserAnimationsModule
      ],providers: [
        {provide: 'Environment', useValue: {}},
        {provide: APP_BASE_HREF, useValue: '/'}
      ],
    })
    .compileComponents();
  }));
  it('should create the do app', async(() => {
    const fixture = TestBed.createComponent(DoComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
