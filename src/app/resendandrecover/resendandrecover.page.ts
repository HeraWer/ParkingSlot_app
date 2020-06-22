import { Component, OnInit } from "@angular/core";
import { ModelService } from "../services/model.service";
import { ToastPage } from "../toast/toast.page";
import { LoadingController, NavController } from "@ionic/angular";

@Component({
  selector: "app-resendandrecover",
  templateUrl: "./resendandrecover.page.html",
  styleUrls: ["./resendandrecover.page.scss"],
})
export class ResendandrecoverPage implements OnInit {
  public showAndHide: boolean = true;
  email: any;

  constructor(
    private modelService: ModelService,
    private toast: ToastPage,
    private loadingController: LoadingController,
    private navController: NavController
  ) {
    /*
     * Detecta los eventos de cuando se abre el teclado en el dispostivo
     */
    window.addEventListener("keyboardWillShow", (e) => {
      if (this.showAndHide) {
        this.showAndHide = !this.showAndHide;
        var elem = document.getElementById("hide");
        elem.style.marginBottom = "10vh";
      }
    });

    /*window.addEventListener('keyboardDidShow', (e) => {
      
    });*/

    window.addEventListener("keyboardWillHide", () => {
      if (!this.showAndHide) {
        this.showAndHide = !this.showAndHide;
        var elem = document.getElementById("hide");
        elem.style.marginBottom = "0vh";
      }
    });

    /*window.addEventListener('keyboardDidHide', () => {
      console.log('keyboard did hide');
    });*/
  }

  ngOnInit() {}

  sendEmailVerify() {
    if (this.email == undefined) {
      this.toast.presentToast("Campo del correo electrónico vacio");
    } else {
      if (this.email.includes("@") && this.email.includes(".")) {
        this.modelService.getUserEmail(this.email).subscribe((data) => {
          if (data.exists == true) {
            this.presentLoading();
            this.modelService.sendEmail(this.email).subscribe((data) => {
              this.loadingController.dismiss();
              this.toast.presentToast(data.mensaje);
              this.navController.navigateRoot("/login");
            });
          } else {
            this.toast.presentToast(data.mensaje);
          }
        });
      } else {
        this.toast.presentToast("Correo electrónico invalido");
      }
    }
  }

  sendEmailPasswordAndEditPassword() {
    if (this.email == undefined) {
      this.toast.presentToast("Campo del correo electrónico vacio");
    } else {
      if (this.email.includes("@") && this.email.includes(".")) {
        this.modelService.getUserEmail(this.email).subscribe((data) => {
          if (data.exists == true) {
            this.presentLoading();
            this.modelService
              .sendEmailPassword(this.email)
              .subscribe((data) => {
                this.loadingController.dismiss();
                this.toast.presentToast(data.mensaje);
                this.navController.navigateRoot("/login");
              });
          } else {
            this.toast.presentToast(data.mensaje);
          }
        });
      } else {
        this.toast.presentToast("Correo electrónico invalido");
      }
    }
  }

  sendEmailRecoveryAccount() {
    if (this.email == undefined) {
      this.toast.presentToast("Campo del correo electrónico vacio");
    } else {
      if (this.email.includes("@") && this.email.includes(".")) {
        this.modelService.getUserEmail(this.email).subscribe((data) => {
          if (data.exists == true) {
            this.presentLoading();
            this.modelService.sendEmailAccount(this.email).subscribe((data) => {
              this.loadingController.dismiss();
              this.toast.presentToast(data.mensaje);
              this.navController.navigateRoot("/login");
            });
          } else {
            this.loadingController.dismiss();
            this.toast.presentToast(data.mensaje);
          }
        });
      } else {
        this.toast.presentToast("Correo electrónico invalido");
      }
    }
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: "Enviando email...",
      duration: 5000,
    });
    await loading.present();
  }
}
