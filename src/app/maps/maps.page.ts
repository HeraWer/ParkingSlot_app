import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { NativeGeocoder } from "@ionic-native/native-geocoder/ngx";
import { AlertController, Platform, LoadingController } from "@ionic/angular";
import { ModelService } from "../services/model.service";
import { ToastPage } from "../toast/toast.page";

declare var google;

@Component({
  selector: "app-maps",
  templateUrl: "./maps.page.html",
  styleUrls: ["./maps.page.scss"],
})
export class MapsPage {
  @ViewChild("map", { static: false }) mapElement: ElementRef;
  map: any;
  markerDeleted: boolean;
  markerArray: any = [];
  _id: any;

  latitude: number;
  longitude: number;

  constructor(
    private geolocation: Geolocation,
    private modelService: ModelService,
    private alertController: AlertController,
    private toast: ToastPage,
    private platform: Platform,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    if (localStorage.getItem("_id")) {
      this.deleteLocation();
    }
    this.loadMap();
  }

  AfterViewInit() {
    this.platform.backButton.subscribe(() => {
      navigator["app"].exitApp();
    });
  }

  ngOnDestroy() {
    this.platform.backButton.unsubscribe();
  }

  reloadPage() {
    this.getAllLocations();
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

        let marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: this.map.getCenter(),
          icon: {
            url: "/assets/people.svg",
            scaledSize: { width: 25, height: 25 },
          },
        });
        setTimeout(() => {
          this.getAllLocations();
        }, 2000)
        
        this.map.addListener("click", (e) => {
          var distance = google.maps.geometry.spherical.computeDistanceBetween(
            e.latLng,
            latLng
          );
          distance = Math.round(distance);

          if (distance <= 300) {
            this.presentAlertSize(e);
          } else {
            this.toast.presentToast(
              "Estás demasiado lejos de tu vehiculo para marcar un aparcamiento libre"
            );
          }
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
        url: "/assets/parking-red.svg",
        scaledSize: { width: 35, height: 35 },
      },
      map: map,
    });
    //map.panTo(latLng);
    //console.log(latLng.lat(), latLng.lng());
  }

  async presentAlertSize(e) {
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
            this.toast.presentToast("Aparcamiento cancelado");
          },
        },
        {
          text: "Aceptar",
          handler: (size) => {
            this.presentAlertZone(e, size)
          },
        },
      ],
    });

    await alert.present();
  }

  async presentAlertZone(e, size) {
    const alert = await this.alertController.create({
      header: "Confirmacion",
      message:
        "<strong>Selecciona el tipo de zona del aparcamiento</strong>",
      cssClass: "alertIntro",
      inputs: [
        {
          name: "white",
          type: "radio",
          label: "Zona blanca",
          value: "white",
          checked: true
        },
        {
          name: "blue",
          type: "radio",
          label: "Zona azul",
          value: "blue"
        },
        {
          name: "green",
          type: "radio",
          label: "Zona verde",
          value: "green",
        },
      ],
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          handler: () => {
            this.toast.presentToast("Aparcamiento cancelado");
          },
        },
        {
          text: "Aceptar",
          handler: (zone) => {
            this.presentLoadingReleasing();
            //console.log(e.latLng);
            let date = new Date();
            //this.placeMarkerAndPanTo(e.latLng, this.map);
            this.saveLocation(e.latLng, size, zone);
            setTimeout(() => {
              this.loadingController.dismiss();
              this.getAllLocations();
            }, 3000)
          },
        },
      ],
    });

    await alert.present();
  }

  saveLocation(latLng, size, zone) {
    var _id;
    //console.log(latLng.lat());
    let date = new Date();
    //console.log(date);
    this.modelService
      .saveLocation(latLng.lat(), latLng.lng(), size, zone, date)
      .subscribe((data) => {
        this.toast.presentToast("Aparcamiento guardado correctamente");
        //this.loadMap();
      });
  }

  getAllLocations() {
    var url;
    for (var i = 0; i < this.markerArray.length; i++) {
      this.markerArray[i].setMap(null);
    }
    this.markerArray = [];
    var infowindow = new google.maps.InfoWindow();
    this.modelService.getAllLocations().subscribe((data) => {
      data.forEach((element) => {
        if (element.occupied == false) {
          let date = new Date(element.date);
          let currentDate = new Date();
          let difference = currentDate.getTime() - date.getTime();
          difference = difference / 60000;

          //if(element.date)
          //console.log(element.date);
          if (difference >= 20) {
          } else {
            //console.log(difference);
            let latLng = new google.maps.LatLng(
              element.latitude,
              element.longitude
            );

            if(element.zone == "white") {
              url = "/assets/parking-red.svg"
            }else if(element.zone == "green") {
              url = "/assets/parking-green.svg"
            }else if(element.zone == "blue") {
              url = "/assets/parking-blue.svg"
            }
            var marker = new google.maps.Marker({
              position: latLng,
              animation: google.maps.Animation.DROP,
              icon: {
                url: url,
                scaledSize: { width: 35, height: 35 },
              },

              map: this.map,
            });

            this.markerArray.push(marker);
            var id;
            /*
             * Registro el evento al marker para a si cuando le demos click al marker este mostrar una informacion.
             * Esto hay que hacerlo nada mas crear el marker. Si creamos el marker y luego mas tarde intentamos vincular el addListener no hara nada,
             * no nos dejara hacer click en el marker para que saque la informacion.
             */
            google.maps.event.addListener(marker, "click", function () {
              var tamaño;
              if (element.size == "big") {
                tamaño = "Grande";
              } else if (element.size == "medium") {
                tamaño = "Mediana";
              } else {
                tamaño = "Pequeña";
              }

              var content = document.createElement("div");
              var p = content.appendChild(document.createElement("p"));
              p.innerHTML =
                "Tamaño de plaza: " +
                tamaño +
                "<br>Tiempo notificado: " +
                Math.round(difference) +
                " minutos";

              var button = content.appendChild(document.createElement("input"));
              button.type = "button";
              button.id = "showMoreButton";
              button.value = "Ocupar Plaza";

              infowindow.setContent(content);
              infowindow.open(this.map, marker);
              button.addEventListener("click", function () {
                localStorage.setItem("_id", element._id);
                window.location.reload();
              });
            });
          }
        }
      });
    });
  }

  deleteLocation() {
    this.presentLoadingOccupied();
    this.modelService
      .deleteLocation(localStorage.getItem("_id"), true)
      .subscribe((data) => {
        this.toast.presentToast(data.mensaje);
        localStorage.removeItem("_id");
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

  async presentLoadingReleasing() {
    const loading = await this.loadingController.create({
      message: 'Liberando aparcamiento...',
      duration: 3000
    });
    await loading.present();
  }

  async presentLoadingOccupied() {
    const loading = await this.loadingController.create({
      message: 'Ocupando aparcamiento...',
      duration: 3000
    });
    await loading.present();
  }
}
