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
          var distance = google.maps.geometry.spherical.computeDistanceBetween(
            e.latLng,
            latLng
          );
          distance = Math.round(distance);

          if (distance <= 300) {
            this.presentAlertConfirm(e);
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
            this.presentLoading();
            //console.log(e.latLng);
            let date = new Date();
            //this.placeMarkerAndPanTo(e.latLng, this.map);
            this.saveLocation(e.latLng, data);
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

  saveLocation(latLng, size) {
    var _id;
    //console.log(latLng.lat());
    let date = new Date();
    //console.log(date);
    this.modelService
      .saveLocation(latLng.lat(), latLng.lng(), size, date)
      .subscribe((data) => {
        this.toast.presentToast("Aparcamiento guardado correctamente");
        //this.loadMap();
      });
  }

  getAllLocations() {
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
            var marker = new google.maps.Marker({
              position: latLng,
              animation: google.maps.Animation.DROP,
              icon: {
                url: "/assets/parking-red.svg",
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

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Liberando aparcamiento...',
      duration: 10000
    });
    await loading.present();
  }
}
