import { Component } from '@angular/core';

import { Platform, NavController, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ModelService } from './services/model.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private modelService: ModelService,
    private navController: NavController,
    private menu: MenuController
  ) {
    this.initializeApp();
  }

  /*
  * Este metodo se ejecuta al abrir la aplicacion, es un metodo por defecto de ionic
  * platform ready es para iniciar la app
  * No se para que es el statusBar
  * SplashScreen no se como se utiliza aun, se que hay variables por defecto cuando añades un Add platform 
  * pero no se como cambiarlas ni nada, investigue un poco pero no me funcionaba
  */
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.menu.swipeGesture(false);
      this.splashScreen.hide();
      this.modelService.getToken();
      if(this.modelService.isLoggedIn == true){
        this.navController.navigateRoot('/maps');
      }else {
        this.navController.navigateRoot('/login');
      }
    });
  }

  // Navegamos al perfil desde el menu lateral, cerramos menu lateral
  profile() {
    this.navController.navigateRoot('/profile');
    this.menu.close('first');
  }

  // Navegamos a opciones desde el menu lateral, cerramos menu lateral
  settings() {
    this.navController.navigateRoot('/settings');
    this.menu.close('first');
  }
  
  // Hacemos logout de nuestra sesion, borrando el token, cerramos menu lateral
  logout() {
    localStorage.clear();
    this.navController.navigateRoot('/login');
    this.menu.close('first');
  }
}
