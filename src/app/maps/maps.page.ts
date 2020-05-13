import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions,
} from "@ionic-native/native-geocoder/ngx";
import { AlertController } from "@ionic/angular";
import { ModelService } from "../services/model.service";
import { ToastPage } from "../toast/toast.page";
import { elementEventFullName } from "@angular/compiler/src/view_compiler/view_compiler";

declare var google;

@Component({
  selector: "app-maps",
  templateUrl: "./maps.page.html",
  styleUrls: ["./maps.page.scss"],
})
export class MapsPage {
  @ViewChild("map", { static: false }) mapElement: ElementRef;
  map: any;
  locations: any;

  latitude: number;
  longitude: number;

  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private modelService: ModelService,
    private alertController: AlertController,
    private toast: ToastPage
  ) {}

  ngOnInit() {
    this.loadMap();
    
  }

  loadMap() {
    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;

        let latLng = new google.maps.LatLng(
          resp.coords.latitude,
          resp.coords.longitude
        );
        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
        };

        //this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);

        this.map = new google.maps.Map(
          this.mapElement.nativeElement,
          mapOptions
        );

        /*let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter()
      });*/
      this.getAllLocations();
      /*var locations = [
        [new google.maps.LatLng(0, 0), 'Marker 1', 'Infowindow content for Marker 1'],
        [new google.maps.LatLng(0, 1), 'Marker 2', 'Infowindow content for Marker 2'],
        [new google.maps.LatLng(0, 2), 'Marker 3', 'Infowindow content for Marker 3'],
        [new google.maps.LatLng(1, 0), 'Marker 4', 'Infowindow content for Marker 4'],
        [new google.maps.LatLng(1, 1), 'Marker 5', 'Infowindow content for Marker 5'],
        [new google.maps.LatLng(1, 2), 'Marker 6', 'Infowindow content for Marker 6']
    ];*/
    

    
    /*for (var i = 0; i < locations.length; i++) {


      

      // Register a click event listener on the marker to display the corresponding infowindow content
      google.maps.event.addListener(marker, 'click', (function (marker, i) {

          return function () {
              infowindow.setContent(locations[i][2]);
              infowindow.open(this.map, marker);
          }

      })(marker, i));

      // Add marker to markers array
      markers.push(marker);
  }*/

        this.map.addListener("click", (e) => {

          /*this.markerArray.forEach(element => {
            let latLng = new google.maps.LatLng(
              element.latitude,
              element.longitude
            );
            var distance = google.maps.geometry.spherical.computeDistanceBetween(e.latLng, latLng);
            console.log(distance);
          });*/
          
          this.presentAlertConfirm(e);

          //this.latitude = this.map.center.lat();
          //this.longitude = this.map.center.lng();
          //this.placeMarkerAndPanTo(e.latLng, this.map);

          //this.addMarkerFromClick(this.latitude, this.longitude)
          //this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
        });
      })
      .catch((error) => {
        console.log("Error getting location", error);
      });
  }

  placeMarkerAndPanTo(latLng, map) {
    var marker = new google.maps.Marker({
      position: latLng,
      animation: google.maps.Animation.DROP,
      icon: {
        url: "/assets/parking.svg",
        scaledSize: { width: 35, height: 35 },
      },

      map: map,
    });

    //map.panTo(latLng);
    console.log(latLng.lat(), latLng.lng());
  }

  async presentAlertConfirm(e) {
    const alert = await this.alertController.create({
      header: "Confirmacion",
      message:
        "<strong>Selecciona el tamaño del aparcamiento liberado</strong>",
      cssClass: "alertIntro",
      inputs: [
        {
          name: "small",
          type: "radio",
          label: "Plaza pequeña",
          value: "small",
        },
        {
          name: "medium",
          type: "radio",
          label: "Plaza mediana",
          value: "medium",
          checked: true,
        },
        {
          name: "big",
          type: "radio",
          label: "Plaza grande",
          value: "big",
        },
      ],
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          handler: () => {
            this.toast.presentToast("Aparcamientro cancelado");
          },
        },
        {
          text: "Aceptar",
          handler: (data) => {
            console.log(e.latLng);
            let date = new Date();
            this.placeMarkerAndPanTo(e.latLng, this.map);
            this.saveLocation(e.latLng, data);
          },
        },
      ],
    });

    await alert.present();
  }

  saveLocation(latLng, size) {
    console.log(latLng.lat());
    let date = new Date();
    console.log(date);
    this.modelService
      .saveLocation(latLng.lat(), latLng.lng(), size, date)
      .subscribe((data) => {
        console.log(data);
        this.toast.presentToast("Aparcamiento guardado correctamente");
        this.loadMap();
      });
  }

  getAllLocations() {
    var infowindow = new google.maps.InfoWindow();
    this.modelService.getAllLocations().subscribe((data) => {
      data.forEach((element) => {
        let date = new Date(element.date);
        let currentDate = new Date();
        let difference = currentDate.getTime() - date.getTime();
        difference = difference / 60000;
        
        //if(element.date)
        //console.log(element.date);
        if (difference >= 15) {
        } else {
          console.log(Math.round(difference));
          let latLng = new google.maps.LatLng(
            element.latitude,
            element.longitude
          );
          var marker = new google.maps.Marker({
            position: latLng,
            animation: google.maps.Animation.DROP,
            icon: {
              url: "/assets/parking.svg",
              scaledSize: { width: 35, height: 35 },
            },

            map: this.map,
          });
          
           // Register a click event listener on the marker to display the corresponding infowindow content
        google.maps.event.addListener(marker, 'click', (function (marker, i) {
          var tamaño;
          if(element.size == 'big'){
            tamaño = 'Grande';
          }else if (element.size == 'medium') {
            tamaño = 'Mediana';
          }else {
            tamaño = 'Pequeña';
          }
          return function () {
              infowindow.setContent("Tamaño de plaza: " + tamaño + "<br/>Tiempo notificado: " + Math.round(difference) + " minutos" );
              infowindow.open(this.map, marker);
          }

      })(marker, element));
        }
      });
    });
    
  }

  /*getAddressFromCoords(lattitude, longitude) {
    console.log("getAddressFromCoords " + lattitude + " " + longitude);
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
 
    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        this.address = "";
        let responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if (value.length > 0)
            responseAddress.push(value);
 
        }
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.address += value + ", ";
        }
        this.address = this.address.slice(0, -2);
      })
      .catch((error: any) => {
        this.address = "Address Not Available!";
      });
 
  }*/
}
