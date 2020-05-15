import { Injectable } from "@angular/core";
import { Observable, Subject, of } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
  HttpRequest,
  HttpResponse,
  HttpEvent,
  HttpEventType,
} from "@angular/common/http";
import { environment, API_URL } from "../../environments/environment";
import { User } from "../models/user";
import { NativeStorage } from "@ionic-native/native-storage/ngx";

@Injectable({
  providedIn: "root",
})
/*
  * MODEL SERVICE es la el TS encargado de conectarse con API y de enviar y recibir datos de la API 
  * y conectar con todas las pages que necesitan peticiones
  */
export class ModelService {
  isLoggedIn = false;
  token: any;
  username: any = "";

  constructor(private http: HttpClient, private nativeStorage: NativeStorage) {}

  

  /* 
  * Metodo que llama al getUser de la API envia por los datos por parametros, los parametros se pasan por URL
  */
  getUser() {
    return this.http
      .get(API_URL + "user/getUser", {
        params: {
          username: localStorage.getItem("username"),
          token: localStorage.getItem("token"),
        },
      })
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }

  /*
  * Metodo que hace una peticion para hacer el login, el cual se le pasa el correo y la contraseña
  * DATO: Me gustaria saber como realmente funcionan los headers y cual es su finalidad.
  */
  login(username, password): Observable<any> {
    return this.http
      .post<any>(
        API_URL + "user/login",
        JSON.stringify(this.loginMap(username, password)),
        {
          headers: this.getHeaders(localStorage.getItem("token")),
        }
      )
      .pipe(
        map((data: any) => {
          if (data.token) {
            console.log(data.email);
            this.username = data.username;
            this.token = data.token;
            localStorage.setItem("username", data.username);
            localStorage.setItem("token", data.token);
            this.nativeStorage.setItem("token", data);
          }
          return data;
        })
      );
  }

  /*
   * Metodo para crear un nuevo usuario y hacer la peticion a la API
   */
  newUser(username, email, password) {
    return this.http
      .post<any>(
        API_URL + "user/newUser",
        JSON.stringify(this.registerMap(username, email, password)),
        {
          headers: this.getHeaders(false),
        }
      )
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }

  /*
  * Metodo para hacer una peticion para modificar el currentUser
  */
  updateUser(usernameOld, username, email, password) {
    return this.http
      .post<any>(API_URL + "user/updateUser", JSON.stringify(this.updateUseMap(usernameOld, username, email, password)), {
        headers: this.getHeaders(localStorage.getItem("token")),
      })
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }

  saveLocation(latitude, longitude, size, date) {
    return this.http
    .post<any>(API_URL + "location/saveLocation", JSON.stringify(this.locationMap(latitude, longitude, size, date)), {
      headers: this.getHeaders(localStorage.getItem("token")),
    })
    .pipe(
      map((data: any) => {
        return data;
      })
    )
  }

  getAllLocations() {
    return this.http.get<any>(API_URL + 'location/allLocations', {
      headers: this.getHeaders(localStorage.getItem('token')),
    })
    .pipe(
      map((data: any) => {
        return data;
      })
    )
  }

  deleteUser() {
    return this.http.post<any>(API_URL + "user/deleteUser", JSON.stringify(this.deleteUserMap(localStorage.getItem('username'), false)), {
      headers: this.getHeaders(localStorage.getItem("token")),
    })
    .pipe(
      map((data: any) => {
        return data;
      })
    )
  }

  // METODOS HEADERS Y TOKENS //
  /*
   * Para ver si el token existe o no existe a si iniciar sesion directamente con el usuario o llevarlo a la pantalla de inicio de sesion
   */
  getToken() {
    this.token = localStorage.getItem("token");
    if (this.token != null) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }

    return localStorage.getItem("token");
  }

  /*
  * No entiendo realmente su funcionalidad, lo copie de una pagina web porque veo que las peticiones necesitan
  * tener declarado la variable heders:
  */
  private getHeaders(login, multipart?) {
    var token = localStorage.getItem("token");
    if (login) {
      if (multipart) {
        return new HttpHeaders().set("Authorization", token);
      } else {
        return new HttpHeaders()
          .set("Content-Type", "application/json")
          .set("Authorization", token);
      }
    } else {
      return new HttpHeaders().set("Content-Type", "application/json");
    }
  }

  // MAP //
  /*
   * Aqui es donde mapeo todas las peticiones que hago a JSON
   */

  loginMap(username, password) {
    //console.log(email + " " + password);

    return {
      username: username,
      password: password,
    };
  }

  registerMap(username, email, password) {
    //console.log(username + " " + email + " " + password);
    return {
      username: username,
      email: email,
      password: password,
    };
  }

  getUserMap(username) {
    return {
      username: username,
    };
  }

  updateUseMap(oldUsername, username, email, password) {
    if (password == undefined) {
      return {
        oldUsername: oldUsername,
        username: username,
        email: email,
      };
    } else {
      return {
        oldUsername: oldUsername,
        username: username,
        email: email,
        password: password
      };
    }
  }

  locationMap(latitude, longitude, size, date) {
    return {
      latitude: latitude,
      longitude: longitude,
      size: size,
      date: date
    }
  }

  deleteUserMap(username, is_deleted) {
    return {
      username: username,
      is_deleted: is_deleted
    }
  }
}
