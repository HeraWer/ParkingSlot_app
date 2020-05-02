import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginPage } from './login.page';
import { HttpClientModule } from '@angular/common/http';
import { ModelService } from '../services/model.service';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: LoginPage }]),
    HttpClientModule,
  ],
  providers: [
    ModelService
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}
