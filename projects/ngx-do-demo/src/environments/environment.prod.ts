export const environment = {
  production: true, 
  remember: true, //By default we remember user
  authentication : true, //Should we do authentication
  backendList: ['azure','localhost','remote'], //List of available back-ends configurations
  backend : 'remote', // The default backend
  backendRefresh: 60, //For testing every 60 seconds refresh
  
  //These value can be set also within backend config
  lockScreen: false, //Should we enable a lock screen on lost focus or idle time
  lockIdle: 5, //Time in min you need to be idle before lock screen is triggered
  lockLogout: 0, //Time in min you will be logged out when idle, 0 means disabled
  
  demo: false, //For development purpose we use demo data
  
  appID: '6d2f17d4-c7b6-4c1b-9ed4-e773e88a098e', //ID to identify the application
  
  //
  "remote" : {
     signup: false,
     type: 'do-proxy',
     title: 'Remote JSON',
     apiURL: "https://docloud-proxy.now.sh", //We point default to the json-server
  },
  
  "localhost" : {
     title: 'Localhost JSON',
     type: 'do-proxy',
     apiURL: "http://localhost:3000", //We point default to the json-server
  },
  
  //Settings by backend provider
  "azure" : {
    signup : false,
    title : "Azure",
    type: 'msal',
   // popup: true,
    fullLogout: false,
    apiURL: "http://localhost:4200", 
    clientID: '6d2f17d4-c7b6-4c1b-9ed4-e773e88a098e',
    consentScopes: ['user.read'],
    tokenRefresh : 30, //We refresh every 30 min
  },
  
};
