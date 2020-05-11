import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { AlertController } from '@ionic/angular';
import { ModelService} from '../services/model.service'
import { ToastPage } from '../toast/toast.page';

declare var google;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage {
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  address: string;
 
  latitude: number;
  longitude: number;
 
  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private modelService: ModelService,
    private alertController: AlertController,
    private toast: ToastPage) {
  }
 
 
  ngOnInit() {
    this.loadMap();
  }
 
  loadMap() {
    this.geolocation.getCurrentPosition().then((resp) => {
 
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
 
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
 
      //this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      /*let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter()
      });*/
     
 
      this.map.addListener('click', (e) => {
        
        this.presentAlertConfirm(e);

        //this.latitude = this.map.center.lat();
        //this.longitude = this.map.center.lng();
        //this.placeMarkerAndPanTo(e.latLng, this.map);
        
        //this.addMarkerFromClick(this.latitude, this.longitude)
        //this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
      });
 
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }
 
  placeMarkerAndPanTo(latLng, map) {
    var marker = new google.maps.Marker({
      position: latLng,
      animation: google.maps.Animation.DROP,
      icon: {url : '/assets/parking.svg',
      scaledSize: { width: 35, height: 35 },
     },
      
      map: map
    });
    
    //map.panTo(latLng);
    console.log(latLng.lat(), latLng.lng());
  }

  async presentAlertConfirm(e) {
    const alert = await this.alertController.create({
      header: 'Confirmacion',
      message: '<strong>Selecciona el tamaño del aparcamiento liberado</strong>',
      cssClass: 'alertIntro',
      inputs: [
        {
          name: 'small',
          type: 'radio',
          label: 'Plaza pequeña',
          value: 'small'
        },
        {
          name: 'medium',
          type: 'radio',
          label: 'Plaza mediana',
          value: 'medium',
          checked: true
        },
        {
          name: 'big',
          type: 'radio',
          label: 'Plaza grande',
          value: 'big'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {           
            this.toast.presentToast("Aparcamientro cancelado");
          }
        }, {
          text: 'Aceptar',
          handler: (data) => {
            console.log(e.latLng);
            let date = new Date();
            this.placeMarkerAndPanTo(e.latLng, this.map);
            this.saveLocation(e.latLng, data);
          }
        }
      ]
    });

    await alert.present();
  }

  saveLocation(latLng, size) {
    console.log(latLng.lat());
    let date = new Date();
    console.log(date);
    this.modelService.saveLocation(latLng.lat(), latLng.lng(), size, date).subscribe(data => {
      console.log(data);
      this.toast.presentToast("Aparcamiento guardado correctamente");
    })
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

