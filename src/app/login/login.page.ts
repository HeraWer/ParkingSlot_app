import { Component } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { NavController, Platform, AlertController } from '@ionic/angular';
import { ModelService } from '../services/model.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss']
  
})
export class LoginPage {

  constructor(private formBuilder: FormBuilder, 
    private alertCtrl: AlertController, private modelService: ModelService, private navController: NavController) { }

    email: string = '';
    password: string = '';
  /*showAlert() {
    this.http.get(this.url).toPromise().then((data:any) => {
      console.log(data);
      //console.log(data.json.test);
      this.json = JSON.stringify(data.json);
    });
    const alert = this.alertCtrl.create({
    message: 'Usuario: ' + this.m_input_login + ' \n Contraseña: ' + this.m_input_password,
    subHeader: 'Datos Login:',
    buttons: ['OK']}).then(alert=> alert.present());


  }*/

  callModelService(form: NgForm){
    this.modelService.login(form.value.email, form.value.password).subscribe(data => {
      console.log(data);
    },
    error => {
      console.log(error);
    });
  }

  registerModal() {
    this.navController.navigateRoot('/register');
  }
}

