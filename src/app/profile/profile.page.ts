import { Component, OnInit } from "@angular/core";
import { ModelService } from "../services/model.service";
import { Observable, empty } from "rxjs";
import { stringify } from "querystring";
import { ToastPage } from "../toast/toast.page";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  email: any;
  username: any;
  oldUsername: any;
  password: any;
  confirmPassword: any;
  public showAndHide: boolean = true;

  check: boolean;

  constructor(
    private modelService: ModelService,
    private toast: ToastPage,
    private navController: NavController) 
    {}

  ngOnInit() {}
  
  /*
  * El ionViewWillEnter es un metodo por defecto de ionic
  * su cometido es ejecutarse cuando el usuario entra en la pagina de perfil y la pone como activa
  * entonces ejecutara su contenido.
  * En este caso es una petecion al model service para traerse el currentUser
  */
  ionViewWillEnter() {
    this.modelService.getUser().subscribe(
      (data) => {
        this.email = data.email;
        this.username = data.username;
        this.oldUsername = data.username;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /*
  * Este metodo interactua con el ion-toggle para saber cuando canvia su posicion a activado o desactivado
  */
  checkChange($event) {
    this.check = !this.check;
  }

  /*
  * Metodo para hacer una actualizacion del usuario, que se activa cuando le damos al boton de actualizar
  * A diferencia del NgForm este va con el NgModel creo que es mas sencillo ya que tu en el input,
  * al declarar un NgModel="prueba" solamente tienes que declarar encima del constructor el nombre prueba 
  * y ya tienes la variable que ponga el usuario en el input.
  */
  updateUser() {
    if (this.password == undefined) {
      if(this.email.includes("@") && this.email.includes(".")) {
        this.modelService
        .updateUser(this.oldUsername, this.username, this.email, undefined)
        .subscribe((data) => {
          console.log(this.username)
          localStorage.setItem('username', this.username);
          this.username = data.username;
          this.email = data.email;
          this.toast.presentToast("Usuario modificado correctamente");
          this.navController.navigateRoot('/maps');
        });
      } else {
        this.toast.presentToast("El correo electronico no es correcto.");
      }
    } else {
      if (this.password == this.confirmPassword) {
        if(this.email.includes("@") && this.email.includes(".")) {
          this.modelService
          .updateUser(
            this.oldUsername,
            this.username,
            this.email,
            this.password
          )
          .subscribe((data) => {
            localStorage.setItem('username', this.username);
            this.username = data.username;
            this.email = data.email;
            this.toast.presentToast("Usuario modificado correctamente");
            this.navController.navigateRoot('/maps');
          });
        } else {
          this.toast.presentToast("El correo electronico no es correcto.");
        }
      } else {
        this.toast.presentToast('Las contraseñas no cuencididen')
      }
    }
  }
}
