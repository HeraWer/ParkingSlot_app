import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResendandrecoverPageRoutingModule } from './resendandrecover-routing.module';

import { ResendandrecoverPage } from './resendandrecover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResendandrecoverPageRoutingModule
  ],
  declarations: [ResendandrecoverPage]
})
export class ResendandrecoverPageModule {}
