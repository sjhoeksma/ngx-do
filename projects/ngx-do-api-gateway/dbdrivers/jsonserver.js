const jsonServer = require('json-server');
const path = require('path');
const fs = require('fs');

let myOptions;

module.exports = {
  create : function(options){
   myOptions = options;
   return jsonServer.create();
  }, 
  router : function(server){
     const routes = myOptions.routes ? JSON.parse(fs.readFileSync(myOptions.routes, 'UTF-8')) : null;//Load the routes from json
     const _router = jsonServer.router(path.join(process.cwd(),myOptions.dataDir,myOptions.dbName)) //Load the database
     server.db = _router.db;   //Add a reference to our router database to the server
     if (routes) server.use(jsonServer.rewriter(routes)) //Set the custom routes
      //Create the json-server
     server.use(jsonServer.defaults({logger:myOptions.logLevel>1}));
     return _router;
  }
}