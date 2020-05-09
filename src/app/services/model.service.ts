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
export class ModelService {
  isLoggedIn = false;
  token: any;
  email: any = "";

  constructor(private http: HttpClient, private nativeStorage: NativeStorage) {}

  getUser() {
    console.log(localStorage.getItem("email"));
    return this.http.get(API_URL + "user/getUser", {
      params: {
        email: localStorage.getItem("email"),
        token: localStorage.getItem("token"),
      },
    }).pipe(map((data: any) => {
      return data;
    }));
  }

  login(email, password): Observable<any> {
    /*return this.http.post('http://localhost:3000/user/login', JSON.stringify({username, password}), {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    }).pipe(map((response: Response) => {
     console.log("GILIPOLLAS");
    }));*/
    return this.http
      .post<any>(
        API_URL + "user/login",
        JSON.stringify(this.loginMap(email, password)),
        {
          headers: this.getHeaders(localStorage.getItem("token")),
        }
      )
      .pipe(
        map((data: any) => {
          if (data.token) {
            console.log(data.email);
            this.email = data.email;
            this.token = data.token;
            localStorage.setItem("email", data.email);
            localStorage.setItem("token", data.token);
            this.nativeStorage.setItem("token", data);
          }
          return data;
        })
      );
    /*return this.http.post('http://localhost:3000/user/login', JSON.stringify(this.loginMap(username, password))
    ).pipe(
      tap(token => {
        console.log(token);
      }),
    );*/
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

  loginMap(email, password) {
    //console.log(email + " " + password);

    return {
      email: email,
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

  getUserMap(email) {
    return {
      email: email,
    };
  }
}
