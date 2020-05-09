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

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.modelService.getToken();
      if(this.modelService.isLoggedIn == true){
        this.navController.navigateRoot('/profile');
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
    localStorage.removeItem('token');
    this.navController.navigateRoot('/login');
    this.menu.close('first');
  }
}
