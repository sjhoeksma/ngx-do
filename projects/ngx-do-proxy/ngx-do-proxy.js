const fs = require('fs')
const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')
const path = require('path')
const jph = require('json-parse-helpfulerror')
const chalk = require('chalk')
const _ = require('lodash')
const enableDestroy = require('server-destroy')
const jsonic = require('jsonic')
const expressValidator = require('express-validator')
const {check, oneOf, validationResult, checkSchema }= require('express-validator/check')
const ddos = require("ddos");
const aad = require('azure-ad-jwt');
const argv = require('minimist')(process.argv.slice(2))
const gaze = require('gaze');
const uuidv4 = require('uuid/v4');
const proxy = require('express-http-proxy');

var myOptions = Object.assign({
  port : 3000, //The port number to use
  dbName : 'ngx-do-proxy.db.json', //The file name where json data is stored
  dbProxyName : 'ngx-do-proxy.proxy.json', //The file name where proxy json data is stored
  dbRuleName : 'ngx-do-proxy.rule.json', //The file name where rule json data is stored
  watchedDir:  './api',
  routes: null,
  jwtValidation: 'key',  //Set this to your 'key' == secretKey or "azure-aad" to use a azure-aad token
  secretKey : "ngx-do-proxy",
  expiresIn : '8h',
  logLevel : 1, //0=No log at all, 1=Info, 2=Info,Requests
  reuseDB: true,
  burst:8, //We start bursting ddos as of 8
  limit:10, //We limit to 10 connections per second
  whitelist:['127.0.0.1'] //Local domain is whitelisted
},argv);


var readError = false, app,server

// Create a token from a payload 
function createToken(payload){
  const expiresIn = myOptions.expiresIn;
  return jwt.sign(payload, myOptions.secretKey, { expiresIn })
}

function decodeToken(req){
   let token = req.headers.authorization ? req.headers.authorization.split(' ') : null;
   if (token === null || token[0] !== 'Bearer') {
      return 401;
    }
    try {
       if (myOptions.jwtValidation=="azure-aad"){
        aad.verify(token[1], null, 
           (err, decode) => decode !== undefined ?  decode : null);
       } else {
        return  jwt.verify(token[1], myOptions.secretKey, 
          (err, decode) => decode !== undefined ?  decode : null);
        }
    } catch (err) {
      return 403;
    }
}

function verifyToken(req){
    return isNaN(decodeToken(req)) ? 0 : 403;
}

//Check if this is a js file and not a url
function isJS(s) {
  return !isURL(s) && /\.js$/.test(s)
}

//Check if a the string is a url, starting with http or https
function isURL(s) {
  return /^(http|https):/.test(s)
}

//Check if this is a json file and not url 
function isJSON(s) {
  return !isURL(s) && /\.json$/.test(s)
}

//Check if this is a json db file and not url 
function isJSONDB(s) {
  return !isURL(s) && /\.db.json$/.test(s)
}

//Check if this is a json db file and not url 
function isPROXY(s) {
  return !isURL(s) && /\.proxy.json$/.test(s)
}

//Check if this is a json db file and not url 
function isRULE(s) {
  return !isURL(s) && /\.rule.json$/.test(s)
}

//Check if this is a plugin file and not url 
function isPLUGIN(s) {
  return !isURL(s) && /\.plugin.js$/.test(s)
}

function pluginList(filepath,callback){
   var ret =[];
   var filesEncountered = 0,
   filesProcessed = 0;
   var processedFile = () =>{
      filesProcessed++;
      if (filesProcessed == filesEncountered) callback(ret)
   }
   var read = (filepath) =>{
      filesEncountered++;
      fs.stat(filepath, (err, stats) => {
        // could not get stats, quit on the file and move on
        if (err || path.dirname(filepath).split(path.sep).pop().indexOf('_')==0) 
            return processedFile();
        if (stats.isDirectory()){
            // directory. read it files. using recursion
            fs.readdir(filepath, (err, files) =>{
                // quit on the directory. couldnt get list of files in it
                if (err) return processedFile();
                //loop thru each file and process it
                for (var file of files){
                     if (file.indexOf('_')!=0) 
                    read(path.join(filepath, file))
                }
                processedFile();
            })
        } else {
          if (stats.isFile()) {
            if (isPLUGIN(filepath)) {
                ret.push(filepath);
            }
          }
          processedFile();
        } 
    });
  }
  // start the process
  read(filepath);
}

//Concat a set of JSON files into one
function concatJson(userOptions, callback) {
  
  // options
  var options =Object.assign({
      src: process.cwd(),
      dest: "./concat.json",
      middleware: false,
      reuseDB: false,
      isJsonFile: isJSONDB   //Test function, deterring which files to include
  },userOptions);
    // ensure `null` is respected for options.dest
  if (userOptions.dest == null) options.dest = null
  //# make options.src an array
  if (typeof(options.src) == "string") options.src = [options.src]


  
  // Read Json Content from Directory/File
  var readContent=(filepath, resultObject, callback)=>{
      var filesEncountered = 0,
      filesProcessed = 0;
      if (!resultObject.contentString) resultObject.contentString = "";
      if (!resultObject.contentArray) resultObject.contentArray = [];

      var processedFile = (fileContent="") =>{
          if (fileContent) {
            resultObject.contentString += fileContent
            resultObject.contentArray.push(fileContent) 
          }
          filesProcessed++
          if (filesProcessed == filesEncountered) callback(resultObject)
      }

      // special case(s)
      if (typeof(filepath) == "object"){
          resultObject.contentString += JSON.stringify(filepath)
          resultObject.contentArray.push(filepath)
          return callback(resultObject)
      }

      var read = (filepath) =>{
          filesEncountered++
          fs.stat(filepath, (err, stats) => {
              // could not get stats, quit on the file and move on
              if (err || path.dirname(filepath).split(path.sep).pop().indexOf('_')==0) return processedFile(null)
              if (stats.isDirectory()){
                  // directory. read it files. using recursion
                  fs.readdir(filepath, (err, files) =>{
                      // quit on the directory. couldnt get list of files in it
                       if (err) return processedFile(null)
                      //loop thru each file and process it
                      for (var file of files){
                           if (file.indexOf('_')!=0) 
                          read(path.join(filepath, file))
                      }
                      // I done with this directory so I quit on it
                      processedFile(null)
                  })
              } else if (stats.isFile()) {
                  if (options.isJsonFile(filepath)) {
                      // file. read it content and concatenate it
                      fs.readFile(filepath, { encoding: "utf8" }, (err, content) => {
                          //quit on the file. couldnt read it
                          if (err) return processedFile(null) 
                          processedFile(content)
                      });
                  }
                  else
                      processedFile(null)
              }
        });
      }
      // start the process
      read(filepath)
  }

  //Concat the read json Files
  var concat=(contentString, contentArray, callback)=>{
      if (contentString=="") return callback("{}", {}) 
      // using algorithm 1 (faster, not forgiving)
      var string = contentString.replace(/^({\s*})*|({\s*})*$/g, "")
      string = string.replace(/}\s*({\s*})*\s*{/g, ",")
      string = string.replace(/}\s*{/g, ",")
      string = string.replace(/\r?\n/g, "") //Allow multiple lines
      try {
          var result=jsonic(string);
          callback(JSON.stringify(result), result,null)
          //callback(string, JSON.parse(string))
      } catch (err) {
          //console.log("Parse Error",err,contentString)
          // using algorithm 2 (slow, forgiving)
          var result = { }
          var error = null;
          for (var content in contentArray) {
              try{        
                  //var tmp = JSON.parse(contentArray[content])
                  var tmp = jsonic(contentArray[content])
                  for (var key in tmp) {
                    if (!tmp.hasOwnProperty(key)) continue
                    result[key] = tmp[key]
                  }
              } catch (err) {
                console.log(string);
                error=err;
                console.log("Error in content",err,content);
              }
          }
          callback(JSON.stringify(result), result,error)
      }
  }

  var result = { }
  var index = 0
  var startConcat = (callback) =>{
      var nextConcat = () =>{
          readContent(options.src[index], result, () =>{
            index++
            if (index < options.src.length) return nextConcat() 
            concat(result.contentString, result.contentArray, (string, obj,error) => {
              if (options.dest && !options.reuseDB){
                fs.writeFile(options.dest, string, (err) => {
                  callback(err || error, obj)
                });
              } else {
                callback(error, obj)
              }
            });
        })
      }
      nextConcat()
  }
  if (!fs.existsSync(options.dest)) options.reuseDB=false;
  return startConcat(callback)
}

function looseJsonParse(obj,server){
    return Function('arg','"use strict";var options=arg[0],db=arg[1];return (' + obj + ')')([myOptions,server.db]);
}

function ruleJsonParse(obj,server){
 return Function('arg', '"use strict";var check=arg[0],oneOf=arg[1],checkSchema=arg[2],options=arg[3],db=arg[4];return (' + obj + ')')([check, oneOf, checkSchema,myOptions,server.db]);
}


//Create the api-proxy server, with memory and persistent to file based json-server
function createServer(plugins){
  const routes = myOptions.routes ? JSON.parse(fs.readFileSync(myOptions.routes, 'UTF-8')) : null;//Load the routes from json
  const proxies = JSON.parse(fs.readFileSync(myOptions.dbProxyName, 'UTF-8')) //Load the proxies from json
  const rules = JSON.parse(fs.readFileSync(myOptions.dbRuleName, 'UTF-8')) //Load the rules from json
  const server = jsonServer.create() //Create the server
  const router = jsonServer.router(myOptions.dbName) //Load the database
  server.db = router.db   //Add a reference to our router database to the server
  if (routes) server.use(jsonServer.rewriter(routes)) //Set the custom routes
  server.use(bodyParser.urlencoded({extended: true}))
  server.use(bodyParser.json())
  //DDOS Protection
  var dd =new ddos(myOptions)
  server.use(dd.middleware);
  server.use(expressValidator());
          
  //Create the json-server
  server.use(jsonServer.defaults({logger:myOptions.logLevel>1}));
  
  //Allow CORS control for all
  server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  
  // We should check auth before we start accessing api services
  server.all('/auth', (req, res) => {
    const db = server.db.getState() //Get the last active database
    // Check if the user exists in database
    function isAuthenticated({email, password}){
      return db.auth ? db.auth.findIndex(auth => auth.login == email && auth.hash == password ) : -2;
    }
    if (req.method == 'GET') {
      let tokenState = verifyToken(req);
      if (tokenState!=0) { //Invalid token so we return error
        const status=tokenState;
        let message = "Error in authorization format";
        if (tokenState==403) {
          message = 'Error access_token is revoked'
        }
        res.status(status).json({status, message})
      } else {
        const status=200;
        let message = "Authenticated";
        res.status(200).json({status, message})
      }
      return //No Next
    } else {
      const {email, password} = req.body
      var decode = decodeToken(req);
      let index = 0;
      if (decode && email && !password && decode!=401 && decode && decode.email==email){
        index = db.auth ? db.auth.findIndex(auth => auth.login == email) : -2;
        if (index <0 ) {
          const status = 401
          const message = 'Incorrect email'
          res.status(status).json({status, message})
          return
        }
      } else {
        index = isAuthenticated({email,password});
        if (index === -1) {
          const status = 401
          const message = 'Incorrect email or password'
          res.status(status).json({status, message})
          return
        } 
      }
      //create a JWT token with ID, email and roles
      const groups = db.auth[index].groups;
      const id = db.auth[index].id;
      const access_token = createToken({id,email, groups })
      res.status(200).json({access_token})
    }
    return //No Next
  })
  
  //TODO: Add validation of API
  
  //Set updated and created at
  server.use((req, res, next) => {
    var decode = decodeToken(req);
    let by;
    if (decode && typeof(decode)=="object") {
      if (decode.id || decode.id==0) by=decode.id
      else by=decode.email
    }
    if (req.method === 'POST') {
      if (!req.body.id) req.body.id=uuidv4();
      req.body.createdAt = Date.now();
      req.body.createdBy = by;
    }
    if (req.method === 'UPDATE' || req.method === 'POST' || req.method === 'PUT') {
      req.body.updatedAt = Date.now()
      req.body.updatedBy = by ;
    }
    next()
  })
  
  
  //Public Proxy routes
  Object.keys(proxies).forEach(function(key) {
    let val = proxies[key];
    let route = "/" + key
    if (val.public){
      if (myOptions.logLevel>1) console.log('Adding public proxy route for',route);
      server.use(route,proxy(val.host,Object.assign({
         proxyReqPathResolver: function (req) {return (val.path||'') + req.url;}
      },looseJsonParse(val.override||'{}',server))));
    }
  });
  
  //From here on private stuff

  //Validate if the token is valid when not accessing auth
  server.use(/^(?!\/auth).*$/,  (req, res, next) => { 
    if (req.originalUrl!=='/db'){ //If not Show the database
      let tokenState = verifyToken(req);
      if (tokenState!=0) { //Invalid token so we return error
        const status=tokenState;
        let message = "Error in authorization format";
        if (tokenState==403) {
          message = 'Error access_token is revoked'
        }
        res.status(status).json({status, message})
        return //No Next
      }
    }
    next()
  })


  //TODO: Add Get Auth and Delete Auth --> they need role admin
  
  //Rule routes
  Object.keys(rules).forEach(function(key) {
    let val = rules[key];
    let route = "/" + key;
    let rl = (req, res, next) => {
     try {
      validationResult(req).throw();
      next(); // handle the request as usual
      } catch (err) {
        // Oh error
        res.status(422).json({"error":err});
      }
     }
    if (val.use) server.use(route,ruleJsonParse(val.use||'[]',server),rl);
    if (val.put) server.put(route,ruleJsonParse(val.put||'[]',server),rl);
    if (val.get) server.get(route,ruleJsonParse(val.get||'[]',server),rl);
    if (val.post) server.post(route,ruleJsonParse(val.post||'[]',server),rl);
    if (val.delete) server.delete(route,ruleJsonParse(val.delete||'[]',server),rl);
    if (myOptions.logLevel>1) console.log('Adding rule for',route);
  });
  
  //Private Proxy routes
  Object.keys(proxies).forEach(function(key) {
    let val = proxies[key];
    let route = "/" + key;
    if (!val.public){
      if (myOptions.logLevel>1) console.log('Adding private proxy route for',route);
       server.use(route,proxy(val.host,Object.assign({
         proxyReqPathResolver: function (req) {return (val.path||'') + req.url;}
      },looseJsonParse(val.override||'{}',server))));
    }
  });
  
  //Load the plugins
  plugins.forEach(function(file){
    server.use(require(file));
    if (myOptions.logLevel>1) console.log('Adding plugin',file);
  });
 // 
  
  server.use(router);
  //Add proxy routes to resource list
  Object.keys(proxies).forEach(function(key) {
    router.db.getState()[key]=[];
  });
  return server;
}

//Start the server and check if files have changed
function start(restart=false){
   pluginList(path.join(process.cwd(), myOptions.watchedDir),function(plugins){
   concatJson({  //Rules
      src:  myOptions.watchedDir,
      dest: myOptions.dbRuleName,
      isJsonFile: isRULE,
      reuseDB: false, //Rules are always created at startup
    },function(err,json){
     concatJson({  //Proxy
      src:  myOptions.watchedDir,
      dest: myOptions.dbProxyName,
      isJsonFile: isPROXY,
      reuseDB: false, //Proxies are always created at startup
    },function(err,json){
    concatJson({ //DB
      src:  myOptions.watchedDir,
      dest: myOptions.dbName,
      reuseDB: !restart && myOptions.reuseDB
    }, function(err,json){
      //console.log("Concat finished",json,err)
      if (err || !json) console.log("Concat of json data had error",err); 
      //else console.log("Concat of json data succesfull"); 
      if (app) {
        let obj
        try {
          obj = jph.parse(fs.readFileSync(myOptions.dbName))
          if (readError) {
            console.log(chalk.green(`  Read error has been fixed :)`))
            readError = false
          }
        } catch (e) {
          readError = true
          console.log(chalk.red(`  Error reading ${myOptions.dbName}`))
          console.error(e.message)
          return
        }

        const isDatabaseDifferent = !_.isEqual(obj, app.db.getState())
        if (isDatabaseDifferent) {
          console.log(chalk.gray(`  ${myOptions.dbName} has changed, reloading...`))
        } else {
          console.log(chalk.green(`  Database not changed :)`))
        }
      }
      server && server.destroy()
      app=createServer(plugins);
      server=app.listen(myOptions.port, () => {
        console.log('ngx-do-proxy',restart ? 'restarted' : 'started on port:' + chalk.green(myOptions.port))
      })
      enableDestroy(server)
    })
   })
   })
  })
}

if (myOptions.logLevel==0) console.log = () => {}

//Watch for changes in json files
gaze(myOptions.watchedDir + '/**/*.json', (err, watcher) => {
  // On changed/added/deleted
  watcher.on('all', (event, filepath) => {
    if (myOptions.logLevel>1)
      console.log(filepath + ' was ' + event);
    //If the file is a JSON (database,validation) restart the database
    if (isJSON(filepath)) {
      start(true);
    }
  });

});

module.exports = {
  start : function(options){
    myOptions = Object.assign(myOptions,options);
    start(false);
  }
}