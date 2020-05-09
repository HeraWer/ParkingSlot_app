import { Component, OnInit } from "@angular/core";
import { ModelService } from "../services/model.service";
import { NgForm } from '@angular/forms';
import { Observable } from "rxjs";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  email: any;
  username: any;
  check: boolean;

  constructor(private modelService: ModelService) {}

  ngOnInit() {}

  ionViewWillEnter(form: NgForm) {
    this.modelService.getUser().subscribe(
      (data) => {
        this.email = data.email;
        this.username = data.username;
        
      },
      (error) => {
        console.log(error);
      }
    );
  }

  checkChange($event) {
    this.check = !this.check;
  }
}
