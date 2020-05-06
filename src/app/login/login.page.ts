import { Component } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { NavController, Platform } from '@ionic/angular';
import { ModelService } from '../services/model.service';
import { NgForm } from '@angular/forms';
import { ToastPage } from '../toast/toast.page';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss']
  
})
export class LoginPage {

  email: String;
  token: String;

  constructor(
    private formBuilder: FormBuilder,
    private modelService: ModelService, 
    private navController: NavController, 
    private toast: ToastPage) { }

    ngOnInit() {
      
    }

  loginModelService(form: NgForm){
    this.modelService.login(form.value.email, form.value.password).subscribe(data => {
      if(!data.token){
        this.toast.presentToast(data.mensaje);
      }else {
        this.email = data.email;
        this.token = data.token;
        console.log(this.email);
        console.log(this.token);
        this.navController.navigateRoot('/maps')
      }
    },
    error => {
      console.log(error);
    });
  }

  registerModal() {
    this.navController.navigateRoot('/register');
  }
}

