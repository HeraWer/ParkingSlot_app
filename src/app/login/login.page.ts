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
            "Introduccion",
            "Te explicaremos en 2 sencillos pasos, el funcionamiento de la aplicación."
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
            if (title == "Introduccion") {
              this.presentAlert(
                "Paso 1",
                "En tu mapa podras visualizar cualquier aparcamiento libre con marcas. Haciendo click sabras cuantos minutos hace que se libero la plaza y el tamaño de la plaza"
              );
            } else if (title == "Paso 1") {
              this.presentAlert(
                "Paso 2",
                "Tu tambien podras marcar en el mapa aparcamientos libres, simplemente cuando te encuentres en tu vehiculo, abre la App, hacer click en el mapa y seguir los pasos."
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
