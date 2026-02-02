// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // SOLUSI: Gunakan 127.0.0.1 atau IP address lokal, bukan localhost
  // Untuk XAMPP PHP: http://127.0.0.1/api-maribelajar (RECOMMENDED)
  // Alternatif: http://192.168.1.xxx/api-maribelajar (ganti xxx dengan IP komputer Anda)
  // Untuk Node.js: http://localhost:3000/api
  apiUrl: 'https://maribelajar.rplbc-23.com/api-maribelajar'  // Sesuaikan dengan nama folder di htdocs
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
