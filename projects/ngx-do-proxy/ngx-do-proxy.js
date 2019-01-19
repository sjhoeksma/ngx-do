const fs = require('fs');
var Request = require('request');
const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')
const path = require('path')
const jph = require('json-parse-helpfulerror')
const chalk = require('chalk')
const _ = require('lodash')
const expressValidator = require('express-validator')
const enableDestroy = require('server-destroy')
const jsonic = require('jsonic')
const aad = require('azure-ad-jwt');
const argv = require('minimist')(process.argv.slice(2))
const gaze = require('gaze');
const uuidv4 = require('uuid/v4');
const crypto = require('crypto'); const algorithm = 'aes-256-ctr';
const util = require('util');
const rfs    = require('rotating-file-stream');
var session = require('express-session');

var myOptions = Object.assign({
  port : 3000, //The port number to use
  dbName : 'ngx-do-proxy.db.json', //The file name where json data is stored
  watchedDir:  './api',
  dataDir: './', //The directory where the data will be stored
  watch: true, //Should we watch for database changes
  routes: 'ngx-do-proxy-routes.json',
  jwtValidation: 'key',  //Set this to your 'key' == secretKey or "azure-aad" to use a azure-aad token
  secretKey : "do-proxy",
  expiresIn : '8h',
  logLevel : 1, //0=No log at all, 1=Info, 2=Info,Requests
  logSize : '5K', // For Demo we rotate every 5K written
  logInterval:'1d',  // rotate daily
  logCompress: false, // no log compression
  logMaxFiles: 5, //Max 5 Files
  reuseDB: true,
  ddosEnabled: false, //When set we enable DDOS checking
  burst:8, //We start bursting ddos as of 8
  limit:10, //We limit to 10 connections per second
  audience: null, //The audience to be used when decoding an azure token
  signup:true, //Is sigup of user allowed
  allowOrigin: '*', //The CORS allow origin settings
  whitelist:[], //Local domain is whitelisted
  rebuild: false, //When set to true database will be rebuild during restart
  'rebuild-db': true, //Is rebuild-db API allowed to be called by admin
  authEnabled: true, //When set to false, auth is disabled
  adminList: [], //List with users which have by default admin rights
  encryptSystem: false, //Should we encrypt,decrypt system values
  allowAccessToken: ['admin'], //List with roles allowed to use access_token
  crudTables: ['users'], //Array with crud Protected tables, or null when disabled
  crudBypass: ['admin'], //Which groups are allowed to by pass crud
  crudByTable: null, //Crud object with tables and there with groups/users having general rights
  crudByApi: null, //Crud object api and there cruds with groups/users having general rights
  'demo-data': true, //Should demo data api be loaded
  logFile: null, //When set with name the console log will be written here
  greenLock:{
      email: null // You MUST change this to a valid email address
    , approveDomains: [] //List of domains need to be set by user
      // You MUST NOT build clients that accept the ToS without asking the user
    , agreeTos: false  //Needs to be set by user to true
    , communityMember: false // Communitymember gets notified of important updates
  }
});

var readError = false, app,rootServer

// Converts a string to a bool.
function strToBool(s){
    regex=/^\s*(true|1|on)\s*$/i
    return regex.test(s);
}

function roles(req,decoded){
  let decode = decoded || decodeToken(req);
  let index;
  let ret = false;
  var groups = ['default'];
  if (decode && isNaN(decode)){
    const db = app.db.getState() //Get the last active database
    index = db.auth ? db.auth.findIndex(auth => auth.login == decode['email']) : -1;
    if (index>=0) {
      //create a JWT token with ID, email and roles
      groups = db.auth[index].groups || groups;
      if (myOptions.adminList.indexOf(decode['email'])>=0 
          && groups.indexOf('admin')<0) {
        groups.push('admin');
      }
    }
  }
  return groups; 
}

function containsValue(value,arr){
  var reg = new RegExp('\\b' + value + '\\b', 'i');
  return reg.test(arr); 
}

//Check if user has a role
function hasRole(role,req,decoded){
  let decode = decoded || decodeToken(req);
  if (role==null) return true;
  let index;
  let ret = false;
  var groups = roles(req,decoded);
  if (typeof role == "string") return containsValue(role,groups);
  if (Array.isArray(role)){
     role.forEach(function(el){
        if (containsValue(el,groups)) ret=true;
      }); 
  }
  return ret;
}

// Create a token from a payload 
function createToken(payload){
  const expiresIn = myOptions.expiresIn;
  return jwt.sign(payload, myOptions.secretKey, { expiresIn })
}

function decodeToken(req){
   let token = req.headers.authorization ? req.headers.authorization.split(' ') : null;
   if (token==null && req.query['_!token']){
     token=[];
     token[0]='Bearer';
     token[1]=req.query['_!token']; 
   }
   //When there is no token check if we have a session cookie
   if (token == null  && req.session.access_token) {
     if (hasRole(myOptions.allowAccessToken,req,jwt.decode(req.session.access_token))){
       token=[];
       token[0]='Bearer';
       token[1]=req.session.access_token; 
     }
   }
   if (token === null || token[0] !== 'Bearer') {
      return 401;
    }
    try {
       let decoded=jwt.decode(token[1]);
       if (!decoded) return null;
       if (myOptions.jwtValidation=="azure-aad" || decoded['iss']){
          decoded['email']=decoded['preferred_username'];
        /* This does not work yet, more testing
        if (myOptions.logLevel>1) console.log("Validate Azure Token",aad.verify(token[1], { audience:  myOptions.audience ?  myOptions.audience :'https://graph.windows.net'}, 
           (err, decode) => {
            console.log("decoded",decode,err);
            return decode;
           })
        );
        */
        //For now we just decode and date checking
        let d = (new Date()).getTime()/1000; //Date.now()/1000; //Time is in ms 
        let nbf = Number(decoded['nbf'])-600;
        let exp = Number(decoded['exp'])+300;
        
        if (myOptions.logLevel>2)
          console.log("Azure Decode",nbf,d,exp,d<=exp,d>=nbf && d<=exp);
          
         if (!(d>=nbf && d<=exp)) 
          return 403;
       
        return decoded;
       } else {
        return  jwt.verify(token[1], myOptions.secretKey, 
          (err, decode) => decode !== undefined ?  decode : null);
        }
    } catch (err) {
      console.log("decodeToken error",err);
      return 403;
    }
}

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,myOptions.secretKey)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text){
  var decipher = crypto.decipher(algorithm,myOptions.secretKey);
  var dec = decipher.update(text,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
}

function hash(text){
  var hmac = crypto.createHmac('sha256',myOptions.secretKey);
  return hmac.update(text).digest('hex');
}

function getFromKeyVault(req,key,defaultValue=null){
  let decode = req==null ? {} :decodeToken(req);
  let index;
  let ret = defaultValue;
  if (decode && isNaN(decode)){
     const db = app.db.getState() //Get the last active database
     index = db.keyvault ? db.keyvault.findIndex(keyvault => keyvault.id == key) : -1;
     if (index>=0){
       if (myOptions.encryptSystem){
          ret = decrypt(db.keyvault[index].key);
       } else {
         ret = db.keyvault[index].key;
       } 
     }
  }
  return ret;
}

function authId(req){
  let decode = decodeToken(req);
  let index;
  let ret = null;
  if (decode && isNaN(decode)){
     const db = app.db.getState() //Get the last active database
    index = db.auth ? db.auth.findIndex(auth => auth.login == decode['email']) : -1;
    if (index>=0) ret = db.auth[index]['id'];
  }  
  return ret;
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

//Check if this is a plugin file and not url 
function isPLUGIN(s) {
  return !isURL(s) && /\.plugin.js$/.test(s)
}

function isPUBLIC(s){
  let f = path.join(process.cwd(), myOptions.watchedDir,'/public');
  return !isURL(s) && s.indexOf(f)==0;
}

function pluginList(filepath,callback){
   var ret =[];
   var filesEncountered = 0,
   filesProcessed = 0;
   var processedFile = () =>{
      filesProcessed++;
      if (filesProcessed == filesEncountered) {
        ret.sort(function(a, b) {
          let x = a.split('/');x=x[x.length-1]; 
          let y = b.split('/');b=b[b.length-1]; 
          if (x > y) return -1;
          if (x < y) return 1;
          return 0;
        });
        callback(ret);
      }
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
                if (myOptions.logLevel>1) console.log("Processing",filepath);
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
                      if (myOptions.logLevel>1) console.log("Processing",filepath);
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
      string = string.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1') //Strip comments
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

//Create the api-proxy server, with memory and persistent to file based json-server
function createServer(server,corePlugins,plugins){
  const routes = myOptions.routes ? JSON.parse(fs.readFileSync(myOptions.routes, 'UTF-8')) : null;//Load the routes from json
  const router = jsonServer.router(path.join(process.cwd(),myOptions.dataDir,myOptions.dbName)) //Load the database

  server.db = router.db   //Add a reference to our router database to the server
  if (routes) server.use(jsonServer.rewriter(routes)) //Set the custom routes
  server.use(session({ 
    secret: myOptions.secretKey, 
    resave: true,
    saveUninitialized: false,
    unset: 'destroy',
    genid: function(req) {
      return uuidv4() // use UUIDs for session IDs
    },
    cookie: { maxAge: 6000*60*8 }}));
  server.use(function (req, res, next) {
   //Check if token was passsed as Query
   if (req.query['_!token']!=null){
     req.session.access_token=req.query['_!token'];
   }  
   next()
  })
  server.use(bodyParser.urlencoded({extended: true}))
  server.use(bodyParser.json())
  //DDOS Protection
  if (strToBool(myOptions.ddosEnabled)){
    const ddos = require("ddos");
    var dd =new ddos(myOptions)
    server.use(dd.middleware);
  }
  server.use(expressValidator());
  
          
  //Create the json-server
  server.use(jsonServer.defaults({logger:myOptions.logLevel>1}));
  
  //Allow CORS control for all
  if (myOptions.allowOrigin){
    server.use(function(req, res, next) {
      res.set("Access-Control-Allow-Origin", myOptions.allowOrigin);
      res.set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
      res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
  }

  
  // We should check auth before we start accessing api services
  server.all('/auth', (req, res) => {
    const db = server.db.getState() //Get the last active database
    const {email, password,signup,type } = req.body
    
    // Check if the user exists in database
    function isAuthenticated({email, password}){
      var hashPwd = hash(password);
      return db.auth ? db.auth.findIndex(auth => auth.login == email && 
          (auth.hash == hashPwd || (auth.api && auth.api == hashPwd)) ) : -2;
    }
    
    //Signup a user, add it to db
    function createUser(decode){
       let index = db.auth ? db.auth.findIndex(auth => auth.login == email) : -2;
       if (index>=0) return -2; //Cannot user already exists
       let id =uuidv4();
       var now = Date.now();
       //User will have no valid login if only type is passed (external SSO like azure)
       db.auth.push( {id:id,login:email,hash:(password ? hash(password) : type),
                      groups:['default'],createdBy:id,updatedBy:id,
                      createdAt:now,updatedAt:now});
       db.users.push({id:id,email:email,name:decode['name'],createdBy:id,updatedBy:id,
                      createdAt:now,updatedAt:now});
       index = db.auth ? db.auth.findIndex(auth => auth.login == email) : -2;
       if (myOptions.logLevel>1) console.log("Added user",email);
       server.db.write();
       return index;
    }
    
    if (req.method == 'DELETE') {
        const status=200;
        let message = "Logout";
        req.session.access_token=null;
        req.session.client_token=null;
        res.status(200).json({status, message})
        return;
    } else if (req.method == 'GET') {
      let tokenState = verifyToken(req);
      if (tokenState!=0) { //Invalid token so we return error
        const status=tokenState;
        let message = "Error in authorization format";
        if (tokenState==403) {
          message = 'Error access_token is revoked'
        }
        req.session.access_token=null;
        res.status(status).json({status, message})
      } else {
        const status=200;
        let message = "Authenticated";
        res.status(200).json({status, message})
      }
      return //No Next
      
    } else { //This is post
      var decode = decodeToken(req);
      let index;
      if (decode && email && !password && decode!=401 && 
          decode.email==email){
        index = db.auth ? db.auth.findIndex(auth => auth.login == email) : -2;
        if (index<0 && signup && myOptions.signup) index=createUser(decode);
      } else { //Normal login
        index = isAuthenticated({email,password});
        if (index<0 && signup && myOptions.signup) index=createUser(decode);
      }
      if (index<0){
        const status = 401
        const message = 'Incorrect email or password'
        req.session.access_token=null;
        req.session.client_token=null;
        res.status(status).json({status, message})
        return 
      }
      //create a JWT token with ID, email and roles
      const groups = db.auth[index].groups || ['default'];
      if (myOptions.adminList.indexOf(email)>=0 
          && groups.indexOf('admin')<0) 
        groups.push('admin');
      const id = db.auth[index].id;
      const access_token = createToken({id,email, groups })
      req.session.access_token = access_token;
      req.session.client_token = req.headers.ClientAuthorization;
      res.status(200).json({access_token})
    }
    return //No Next
  })
  
  //Check fo public plugins
  plugins.forEach(function(file){
    if (isPUBLIC(file)){
      let plugin = require(file);
      if (plugin.length) server.use(plugin);
      if (myOptions.logLevel>1) console.log('Adding public plugin',file);
    }
  });
    
  //Set updated and created at
  server.use((req, res, next) => {
    if (req.method === 'POST') {
      if (!req.body.id) req.body.id=uuidv4();
      req.body.createdAt = Date.now();
      req.body.createdBy = authId(req);
    }
    if (req.method === 'UPDATE' || req.method === 'POST' || req.method === 'PUT') {
      req.body.updatedAt = Date.now()
      req.body.updatedBy = authId(req) ;
    }
    next()
  })
  
  //DB is always returning list of table
  server.all('/db',(req, res) => {
    const db = server.db.getState() //Get the last active database
    let ret = {};
    //router.stack
    app._router.stack.forEach(function(r) { 
      if (r.route && r.route.path){
        ret[r.route.path.substring(1)]=[];
      } else if (r.regexp){
        var s =r.regexp.toString().replace(/\\/g,'').replace('?(?=','').split('/');
        if (s[1]=='^' && s[2]){
          ret[s[2]]=[];
        }
      }    
    });
    Object.keys(db).forEach(function(key) {
       ret[key]=[];
    });
    return res.status(200).json(ret);
  })
    
  //From here on private stuff

  //Validate if the token is valid when not accessing auth
  if (strToBool(myOptions.authEnabled)) 
   server.use(/^(?!\/auth).*$/,  (req, res, next) => { 
     if (req.originalUrl=='/__rules'){
       //Skip     
      } else {
        let tokenState = verifyToken(req);
        if (tokenState!=0) { //Invalid token so we return error
          const status=tokenState;
          let message = "Error in authorization format";
          if (tokenState==403) {
            message = 'Error access_token is revoked'
          }
          return res.status(status).json({status, message})
        }
      }
      next()
  })
  
  //Load the core plugins
  corePlugins.forEach(function(file){
      let plugin = require(file);
      if (plugin.length) server.use(plugin);
      if (myOptions.logLevel>1) console.log('Adding core plugin',file);
  }); 
  
  //TODO: Add Get Auth and Delete Auth --> they need role admin
  
  //Private plugins
  plugins.forEach(function(file){
    if (!isPUBLIC(file)){
      let plugin = require(file);
      if (plugin.length) server.use(plugin);
      if (myOptions.logLevel>1) console.log('Adding private plugin',file);
    }
  });
  
  server.use(router);
  return server;
}

function build(restart,callback){
  if (myOptions.logLevel>2) {
    console.log('Working Dir',path.join(process.cwd(), myOptions.watchedDir));
    console.log('Data Dir',path.join(process.cwd(), myOptions.dataDir));
  }
  pluginList(path.join(__dirname,'./core'),function(corePlugins){
    pluginList(path.join(process.cwd(), myOptions.watchedDir),function(plugins){
     concatJson({ //DB
        src:  path.join(process.cwd(), myOptions.watchedDir),
        dest: path.join(process.cwd(),myOptions.dataDir,myOptions.dbName),
        isJsonFile: isJSONDB,
        reuseDB: !restart && myOptions.reuseDB
      }, function(err,json){
        if (err || !json) console.log("Concat of json data had error",err); 
        callback(err,json,corePlugins,plugins);
      }
    )})
  })  
}

//Start the server and check if files have changed
function start(rebuild=0,callback=null,startOptions={}){
  build(rebuild>0,function(err,json,corePlugins,plugins){
    if (app) {
      if (myOptions.greenLockEnabled) 
        return; //Greenlock cannot be restarted
      let obj
      try {
        obj = jph.parse(fs.readFileSync(path.join(process.cwd(),myOptions.dataDir,myOptions.dbName)))
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
      
      if (startOptions.recreateTables){
        let tables;
        try {
          tables = jsonic(startOptions.recreateTables);
          if (!Array.isArray(tables))
            tables=[];//Error Got object
        } catch(ex){
           tables = startOptions.recreateTables.split(',')
        }
        let db = app.db.getState();
        let changed=false;
        tables.forEach(function (table){
          if (obj[table]) {
            db[table]=obj[table];
            changed=true;
          }
        })
        if (changed){
          app.db.write();  
          console.log(chalk.gray(` ${startOptions.recreateTables} has changed, reloading  ${myOptions.dbName} ...`))
        } else {
          console.log(chalk.green(`  Database not changed ${startOptions.recreateTables} :)`))
          if (rebuild<=1) return;
        }
      } else {
        const isDatabaseDifferent = !_.isEqual(obj, app.db.getState())
        if (isDatabaseDifferent) {
          console.log(chalk.gray(`  ${myOptions.dbName} has changed, reloading...`))
        } else {
          console.log(chalk.green(`  Database not changed :)`))
          if (rebuild<=1) return;
        }
      }
    }
    // clean the cache
    Object.keys(require.cache).forEach((id) => {
      if (id.indexOf(path.join(process.cwd(), myOptions.watchedDir))>=0 ||
          id.indexOf('ngx-do-proxy/core')>=0) {
        console.log('Reloading', id);
        delete require.cache[id];
      }
    });

    app = jsonServer.create() //Create the app server

    //Check if we should create a greenlock wrapper
    if (myOptions.greenLockEnabled) {
        rootServer=require('greenlock-express').create(Object.assign({
            // Let's Encrypt v2 is ACME draft 11
            version: 'draft-11'

            // Note: If at first you don't succeed, switch to staging to debug
            // https://acme-staging-v02.api.letsencrypt.org/directory
          , server: 'https://acme-v02.api.letsencrypt.org/directory'

            // Where the certs will be saved, MUST have write access
          , configDir: require('path').join(require('os').homedir(), 'acme', 'etc')

          , app: app

            // Join the community to get notified of important updates
          , communityMember: false

            // Contribute telemetry data to the project
          , telemetry: false

          //, debug: true

          },myOptions.greenLock));
      rootServer=rootServer.listen(80, 443,function(){
        createServer(app,corePlugins,plugins);
        console.log('ngx-do-proxy, Started secure on port: 443' , chalk.green(443))
        callback && callback();
      });
    } else {
      rootServer && rootServer.destroy()
      const port = process.env.PORT || myOptions.port;
      rootServer=app.listen(port, () => {
        createServer(app,corePlugins,plugins);
        console.log('ngx-do-proxy, Started on port:' , chalk.green(port));
        callback && callback();
      })
      enableDestroy(rootServer)
    }
  })
}

//Watch function for changed files
function watch(){
  //Watch for changes in json files
  gaze(path.join(process.cwd(), myOptions.watchedDir) + '/**/*.json', (err, watcher) => {
    // On changed/added/deleted
    watcher.on('all', (event, filepath) => {
      if (myOptions.logLevel>1)
        console.log(filepath + ' was ' + event);
      //If the file is a JSON (database,validation) restart the database
      if (isJSON(filepath)) {
        start(1); //Reload data
      }
    });

  });
}

module.exports = {
  start : function(options,callback){    
    myOptions = Object.assign(myOptions,options,argv);
    if (myOptions.generateKey){
      
      var h = crypto.createHash('sha256');
      var key = h.update(myOptions.generateKey).digest('hex');
      var store = hash(key);
      console.log("Key Generation completed, [key]=for API login, [store]=for in DB table")
      console.log("raw=",myOptions.generateKey)
      console.log("key=",key);
      console.log("store=",store);
      return;
    }
    if (myOptions.logLevel==0) console.log = () => {}
    else if (myOptions.logFile) {
      console.log("Using external log file",myOptions.logFile);
      //Create new log file
      
      var log_file = rfs(path.join(process.cwd(),myOptions.dataDir,myOptions.logFile), Object.assign({
            size:    myOptions.logSize || '10M', // rotate every 10 MegaBytes written
            interval: myOptions.logInterval || '1d',  // rotate daily
            //maxFiles: myOptions.logMaxFiles || 5, //Max 5 Files
            rotate: myOptions.logMaxFiles || 5, //Max 5 Files in unix rotation mode
        },myOptions.logCompress ? {compress:myOptions.logCompress}:{}));

      console.log = function() { //Append to logfile without locking
        let s = util.format.apply(null,arguments)+ '\n'
        log_file.write(s);
        process.stdout.write(s);
      }
    }
    if (myOptions.logLevel>0) console.log("ngx-do-proxy "+require('./package.json').version);
    
    myOptions.greenLockEnabled=(strToBool(myOptions.greenLock.agreeTos) 
        && myOptions.greenLock.approveDomains.length>0 
        && myOptions.greenLock.email);
    if (!myOptions.greenLockEnabled && strToBool(myOptions.watch)) watch();
    start(strToBool(myOptions.rebuild) ? 1 : 0,callback);
  },
  stop: function(){
    server && server.destroy();
    server=null;
  },
  restart: start,
  watch: watch,
  static: function(url){return require('express').static(url)},
  decodeToken:decodeToken,
  hasRole:hasRole,
  keyVault: getFromKeyVault,
  encrypt: encrypt,
  decrypt: decrypt,
  strToBool: strToBool,
  get server(){return rootServer},
  get app(){return app},
  get plugin(){return app._router},//require('express').Router()},
  get options(){return myOptions},
  get db(){return rootServer.db},
  containsValue: containsValue,
  roles: roles
}

