import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PagesModule} from '../pages.module';
import { AppModule} from '../../app.module';
import { APP_BASE_HREF } from '@angular/common';
import { ContactComponent } from './contact.component';
import { environment } from '../../../environments/environment.spec';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ 
        AppModule,
        PagesModule,
      ],providers: [
        {provide: 'Environment', useValue: environment},
        {provide: APP_BASE_HREF, useValue: '/'}
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
