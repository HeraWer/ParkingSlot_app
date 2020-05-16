import { Component, OnInit } from "@angular/core";
import { EmailComposer } from "@ionic-native/email-composer/ngx";

@Component({
  selector: "app-help",
  templateUrl: "./help.page.html",
  styleUrls: ["./help.page.scss"],
})
export class HelpPage implements OnInit {
  public showAndHide: boolean = true;
  container: string;
  email: string;

  constructor(private emailComposer: EmailComposer) {
    /*
     * Detecta los eventos de cuando se abre el teclado en el dispostivo
     */
    window.addEventListener("keyboardWillShow", (e) => {
      if (this.showAndHide) {
        this.showAndHide = !this.showAndHide;
      }
    });

    /*window.addEventListener('keyboardDidShow', (e) => {
      
    });*/

    window.addEventListener("keyboardWillHide", () => {
      if (!this.showAndHide) {
        this.showAndHide = !this.showAndHide;
      }
    });

    /*window.addEventListener('keyboardDidHide', () => {
      console.log('keyboard did hide');
    });*/
  }

  ngOnInit() {}

  sendEmail() {

    let email = {
      to: 'vallejestudiante@gmail.com',
      cc: this.email,
      bcc: [],
      attachments: [],
      subject: 'Parking Slots Bugs',
      body: this.container,
      isHtml: true,
      app: "gmail"
    }
    
    // Send a text message using default options
    this.emailComposer.open(email);
  }
}
