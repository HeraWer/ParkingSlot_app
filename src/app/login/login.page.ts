import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { NavController, AlertController } from "@ionic/angular";
import { ModelService } from "../services/model.service";
import { NgForm } from "@angular/forms";
import { ToastPage } from "../toast/toast.page";

@Component({
  selector: "app-login",
  templateUrl: "login.page.html",
  styleUrls: ["login.page.scss"],
})
export class LoginPage {
  email: string;
  token: String;

  constructor(
    private formBuilder: FormBuilder,
    private modelService: ModelService,
    private navController: NavController,
    private toast: ToastPage,
    private alertController: AlertController
  ) {}

  ngOnInit() {}
  /*
   * Metodo que recoge los datos del NgForm que el form esta declarado en el html,
   * con el nombre de las variables del html podemos saber que a escrito el usuario en el input
   */
  loginModelService(form: NgForm) {
    this.modelService.login(form.value.email, form.value.password).subscribe(
      (data) => {
        if (!data.token) {
          this.toast.presentToast(data.mensaje);
        } else {
          this.email = data.email;
          this.token = data.token;
          console.log(this.token);
          this.presentAlert(
            "¡¡ Información !!",
            "A continuación, te explicaremos en 2 sencillos pasos el funcionamiento de la aplicación:"
          );
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
      buttons: [
        {
          text: "Aceptar",
          handler: () => {
            if (title == "¡¡ Información !!") {
              this.presentAlert(
                "¡¡ Paso 1 !!",
                "En el mapa de la aplicación, podrás visualizar  cualquier aparcamiento libre marcado con un icono rojo.  Haciendo clic encima del icono, obtendrás cierta información; cuantos minutos hace que se liberó la plaza, y el tamaño."
              );
            } else if (title == "¡¡ Paso 1 !!") {
              this.presentAlert(
                "¡¡ Paso 2 !!",
                "Para poder notificar que has dejado libre tu plaza, una vez te encuentres en tu vehículo, abre la App, haz clic en el mapa y sigue los pasos."
              );
            }
          },
        },
      ],
      cssClass: "alertIntro",
    });

    await alert.present();
  }
}
