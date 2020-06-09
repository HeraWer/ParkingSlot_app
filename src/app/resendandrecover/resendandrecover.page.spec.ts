import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ResendandrecoverPage } from './resendandrecover.page';

describe('ResendandrecoverPage', () => {
  let component: ResendandrecoverPage;
  let fixture: ComponentFixture<ResendandrecoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResendandrecoverPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResendandrecoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
