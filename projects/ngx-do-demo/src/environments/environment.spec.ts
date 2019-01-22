// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  version: require('../../../../package.json').version,
  name: require('../../../../package.json').name,
  authentication : true, // Should we do authentication
  backendList: ['localhost'], // List of available back-ends configurations
  backend : 'localhost', // The default backend
  backendRefresh: 10000, // For testing every 10 seconds refresh

  // These value can be set also within backend config
  lockScreen: false, // Should we enable a lock screen on lost focus or idle time
  lockIdle: 5, // Time in min you need to be idle before lock screen is triggered
  lockLogout: 0, // Time in min you will be logged out when idle, 0 means disabled

  demo: true, // For test purpose we use demo data

  appID: '6d2f17d4-c7b6-4c1b-9ed4-e773e88a098e', // ID to identify the application

  'localhost' : {
     title: 'Localhost JSON',
     type: 'do-gateway',
     apiURL: 'http://localhost:3000', // We point default to the json-server
  },

};
