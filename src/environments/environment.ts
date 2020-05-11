// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};

/*
* Variables de entorno como la API y aqui tenemos la variable de entorno de la API URL
* a si solo tengo que cambiar esta ruta para que todas mis paginas y peticiones apunten en local o a heroku
*/
export const API_URL = 'http://localhost:3000/'//https://parkingslots.herokuapp.com/';

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
