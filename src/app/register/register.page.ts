import { Component, OnInit } from "@angular/core";
import { ModelService } from "../services/model.service";
import { NavController, Platform } from "@ionic/angular";
import { NgForm, EmailValidator, FormControl } from "@angular/forms";
import { ToastPage } from "../toast/toast.page";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
})
export class RegisterPage implements OnInit {
  username: String;
  email: String;
  password: String;
  public showAndHide: boolean = true;

  constructor(
    private modelService: ModelService,
    private navCotroller: NavController,
    private toast: ToastPage
  ) {
    /*
     * Detecta los eventos de cuando se abre el teclado en el dispostivo
     */
    window.addEventListener("keyboardWillShow", (e) => {
      if (this.showAndHide) {
        this.showAndHide = !this.showAndHide;
        var elem = document.getElementById("hide");
        elem.style.marginBottom = "5vh";
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
   * Metodo de hacer la peticion a la horar de registrar un usuario, uso el NgForm como en el login
   */
  registerModelService(form: NgForm) {
    this.username = form.value.username;
    this.email = form.value.email;
    this.password = form.value.password;

    if (this.email.includes("@") && this.email.includes(".")) {
      if (form.value.password == form.value.confirmPassword) {
        this.modelService
          .newUser(form.value.username, form.value.email, form.value.password)
          .subscribe(
            (data) => {
              if (data.mensaje == "Usuario creado correctamente") {
                this.toast.presentToast(data.mensaje);
                this.navCotroller.navigateRoot("/login");
              } else {
                this.toast.presentToast(
                  "El nombre de usuario o el correo electronico ya existe"
                );
              }
            },
            (error) => {
              console.log(error);
            }
          );
      } else {
        this.toast.presentToast("La contraseñas no cuenciden.");
      }
    } else {
      this.toast.presentToast("El correo electronico no es correcto.");
    }
  }
}
