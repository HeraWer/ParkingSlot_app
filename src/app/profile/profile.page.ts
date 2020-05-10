import { Component, OnInit } from "@angular/core";
import { ModelService } from "../services/model.service";
import { Observable, empty } from "rxjs";
import { stringify } from "querystring";

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

  check: boolean;

  constructor(private modelService: ModelService) {}

  ngOnInit() {}

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

  checkChange($event) {
    this.check = !this.check;
  }

  updateUser() {
    if (this.password == undefined) {
      this.modelService
        .updateUser(this.oldUsername, this.username, this.email, undefined)
        .subscribe((data) => {
          this.username = data.username;
          this.email = data.email;
          this.check = !this.check;
        });
    } else {
      if (this.password == this.confirmPassword) {
        this.modelService
          .updateUser(
            this.oldUsername,
            this.username,
            this.email,
            this.password
          )
          .subscribe((data) => {
            this.username = data.username;
            this.email = data.email;
          });
      } else {
      }
    }
  }
}
