import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { ToastPage } from '../toast/toast.page';
import { ModelService } from '../services/model.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(
    private navController: NavController,
    private alertController: AlertController,
    private toast: ToastPage,
    private modelService: ModelService
  ) { }

  ngOnInit() {
  }

  pageInformation(){
    this.navController.navigateRoot('/information');
  }

  help() {
    this.navController.navigateRoot('/help');
  }

  deleteUser() {
    this.presentAlert('¡¡ Alerta !!', '¿Estas seguro que deseas eliminar su cuenta?')
  }

  async presentAlert(title, message) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      cssClass: "alertIntro",
      buttons: [
        {
          text: "Cancelar",
          handler: () => {
            this.toast.presentToast("Acción cancelada correctamente")
          }
        },
        {
          text: "Aceptar",
          handler: () => {
            this.modelService.deleteUser().subscribe(data => {
              this.toast.presentToast(data.mensaje);
              localStorage.removeItem('token');
              localStorage.removeItem('username');
              this.navController.navigateRoot('/login');
            })
          },
        }
      ],
      
    });

    await alert.present();
  }

}
