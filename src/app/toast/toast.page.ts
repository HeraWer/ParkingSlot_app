import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.page.html',
  styleUrls: ['./toast.page.scss'],
})
export class ToastPage implements OnInit {

  constructor(private toastController: ToastController) { }

  ngOnInit() {
  }

  /*
  * Primero cree un toast en cada pagina, 
  * hasta que descubri el modo de crear uno genero que puedan usar todas las paginas
  */
  async presentToast(mensaje) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 4000,
      color: 'dark'
    });
    toast.present();
  }
}
