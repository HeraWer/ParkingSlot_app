import { Component, OnInit } from '@angular/core';
import { ModelService } from '../services/model.service'
import { NavController, Platform } from '@ionic/angular';
import { NgForm, EmailValidator, FormControl } from '@angular/forms';
import { ToastPage } from '../toast/toast.page';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  username: String
  email: String;
  password: String;

  constructor(
    private modelService: ModelService, 
    private navCotroller: NavController,
    private toast: ToastPage) { }

  ngOnInit() {
  }

  registerModelService(form: NgForm){
    this.username = form.value.username;
    this.email = form.value.email;
    this.password = form.value.password;

    if(this.email.includes('@') && this.email.includes('.')) {
      if(form.value.password == form.value.confirmPassword) {
        this.modelService.newUser(form.value.username, form.value.email , form.value.password).subscribe(data => {
          this.toast.presentToast(data.mensaje);
          this.navCotroller.navigateRoot('/login');
        }, error => {
          console.log(error);
        });
      }else {
        this.toast.presentToast("La contraseñas no cuenciden.");
      }
    }else {
      this.toast.presentToast("El correcto electronico no es correcto.")
    }
  }
}
