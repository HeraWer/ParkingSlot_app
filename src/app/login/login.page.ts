import { Component, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { NavController, AlertController, LoadingController } from "@ionic/angular";
import { ModelService } from "../services/model.service";
import { NgForm } from "@angular/forms";
import { ToastPage } from "../toast/toast.page";

@Component({
  selector: "app-login",
  templateUrl: "login.page.html",
  styleUrls: ["login.page.scss"],
})
export class LoginPage {
  username: string;
  token: String;
  public showAndHide: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private modelService: ModelService,
    private navController: NavController,
    private toast: ToastPage,
    private alertController: AlertController,
    private loadingController: LoadingController
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

  /*
   * Metodo que recoge los datos del NgForm que el form esta declarado en el html,
   * con el nombre de las variables del html podemos saber que a escrito el usuario en el input
   */
  loginModelService(form: NgForm) {
    console.log(form.value.username);
    this.presentLoading()
    this.modelService.login(form.value.username, form.value.password).subscribe(
      (data) => {
        if (!data.token) {
          this.toast.presentToast(data.mensaje);
          this.loadingController.dismiss();
        } else {
          this.username = data.username;
          this.token = data.token;
          this.presentAlert(
            "¡¡ Información !!",
            "A continuación, le explicamos en 3 sencillos pasos el funcionamiento de la aplicación:"
          );
          this.loadingController.dismiss();
          this.navController.navigateRoot("/maps");
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /*
   * Metodo que te lleva la pagina de registrarse si el usuario no tiene cuenta y le da al boton de registro
   */
  registerModal() {
    this.navController.navigateRoot("/register");
  }

  async presentAlert(title, message) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      cssClass: "alertIntro",
      buttons: [
        {
          text: "Atras",
          handler: () => {
            if(title == '¡¡ Paso 2 !!') {
              this.presentAlert(
                "¡¡ Paso 1 !!",
                "En el mapa de la aplicación, podrá visualizar  cualquier aparcamiento libre marcado con un icono rojo. <br><br>Pulsando encima del icono, se obtiene cierta información; cuantos minutos hace que se liberó la plaza, y el tamaño."
              );
            }else if(title == '¡¡ Paso 3 !!') {
              this.presentAlert(
                "¡¡ Paso 2 !!",
                "Para poder notificar que ha dejado libre su plaza, una vez se encuentre en su vehículo, abra la App, haga clic en el mapa y continue los pasos."
              );
            }else {
              this.presentAlert(
                "¡¡ Información !!",
                "A continuación, le explicamos en 3 sencillos pasos el funcionamiento de la aplicación:"
              );
            }
          }
        },
        {
          text: "Aceptar",
          handler: () => {
            if (title == "¡¡ Información !!") {
              this.presentAlert(
                "¡¡ Paso 1 !!",
                "En el mapa de la aplicación, podrá visualizar  cualquier aparcamiento libre marcado con un icono rojo. <br><br>Pulsando encima del icono, se obtiene cierta información; cuantos minutos hace que se liberó la plaza, y el tamaño."
              );
            } else if (title == "¡¡ Paso 1 !!") {
              this.presentAlert(
                "¡¡ Paso 2 !!",
                "Para poder notificar que ha dejado libre su plaza, una vez se encuentre en su vehículo, abra la App, haga clic en el mapa y continue los pasos."
              );
            } else if (title == "¡¡ Paso 2 !!") {
              this.presentAlert(
                "¡¡ Paso 3 !!",
                "Para poder notificar que ha ocupado una plaza, una vez haya aparcado, abra la App, pulse en el marcador de la plaza libre que ocupó i pulse 'ocupar plaza'."
              );
            }
          },
        }
      ],
      
    });

    await alert.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Iniciando sesion...',
      duration: 10000
    });
    await loading.present();
  }
}
