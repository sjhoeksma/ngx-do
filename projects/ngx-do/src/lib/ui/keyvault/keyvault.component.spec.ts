import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { NgxDoCoreModule} from '../../core/core.module';
import { KeyVaultComponent} from './keyvault.component';

describe('KeyVaultComponent', () => {
  let component: KeyVaultComponent;
  let fixture: ComponentFixture<KeyVaultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxDoCoreModule,
      ], providers: [
        {provide: 'Environment', useValue: {}},
        {provide: APP_BASE_HREF, useValue: '/'}
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyVaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
