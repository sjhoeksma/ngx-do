const proxy = require('../ngx-do-proxy')
const plugin = proxy.app;
 
//CRUD will deliver the crud data from AUTH table
plugin.use("/CRUD",(req,res,next)=>{
  let id= req.url.substr(1);
  let decode = proxy.decodeToken(req);
  if (decode && isNaN(decode)){  
     const db = plugin.db.getState() //Get the last active database
     let admin = proxy.hasRole('admin',req),index;
     if (id && admin){
       index = db.auth ? db.auth.findIndex(auth => auth.id == id) : -1; 
     } else {
      index = db.auth ? db.auth.findIndex(auth => auth.login == decode['email']) : -1;
     }
     if (index>=0 && req.method=="GET") { //READ
       let status = 200;
       let rec = db.auth[index];
       let message = {id:rec.id,crud:rec.crud || [],tables:proxy.options.crudTables};
       res.status(status).json(message) 
      return; 
     } else if (index>=0 && (req.method=="PUT" || req.method=="POST")) { //Save
       let status = 200;
       let rec = db.auth[index];
       rec['crud']=req.body.crud;
       rec['updatedAt']=req.body.updatedAt;
       rec['updatedBy']=req.body.updatedBy;
       db.auth[index]=rec;
       proxy.server.db.write();
       let message = {id:rec.id,crud:rec.crud || [],tables:myOptions.crudTables};
       res.status(status).json(message) 
       return;
     }
  }
  let status = 403;
  let message = "Error in CRUD request";
  return res.status(status).json({status,message})
}) 

//Main CRUD plugin to load when there are crudTables enables
if (proxy.options.crudTables) plugin.use((req,res,next)=>{
  let path = req.url.split('/');
  let table = path[1];
  let admin = proxy.hasRole(proxy.options.crudBypass || 'admin',req),index;
  if (!admin && proxy.options.crudTables.indexOf(table)>=0){
    //Load the crud assigned to me
    let decode = proxy.decodeToken(req);
    if (decode && isNaN(decode)){ 
      const db = plugin.db.getState() //Get the last active database
      let email =  decode['email'];
      index = db.auth ? db.auth.findIndex(auth => auth.login == email) : -1;
      if (index>=0){ //Add Filter just my own records, or the once if have the rights
        let allowed = [db.auth[index].id];
        let myGroups = db.auth[index].groups || ['default'];
        //Check is user is allowed to used api
        if (proxy.options.crudByApi){ //We have a crud for table of api
          let apiAllowed=-1;
          proxy.options.crudByApi.forEach(function(crud){
              if (crud.table==table && apiAllowed==-1) apiAllowed=0
              if ((crud.user==email && crud.table==table) || proxy.containsValue(crud.user,myGroups)) {
                if ((req.method=="GET" && crud.CRUD.indexOf('r')>=0)|| 
                    (req.method=="PUT" && crud.CRUD.indexOf('u')>=0) || 
                    (req.method=="POST" && crud.CRUD.indexOf('c')>=0) ||
                    (req.method=="DELETE" && crud.CRUD.indexOf('d')>=0)) apiAllowed=1
              } 
            })
          if (apiAllowed==0){
             if (proxy.options.logLevel>2) console.log("CRUD api rejected",req.method,req.url);
            let status = 403;
            let message = "API request refused by crudByApi";
            return res.status(status).json({status,message})
          }
        }

        //check if the user is allowed to do action based on the table crud
        if (proxy.options.crudByTable){
          let tableAllowed = false;
          proxy.options.crudByTable.forEach(function(crud){
              if ((crud.user==email && crud.table==table) || proxy.containsValue(crud.user,myGroups)) {
                if ((req.method=="GET" && crud.CRUD.indexOf('r')>=0)|| 
                    (req.method=="PUT" && crud.CRUD.indexOf('u')>=0) || 
                    (req.method=="POST" && crud.CRUD.indexOf('c')>=0) ||
                    (req.method=="DELETE" && crud.CRUD.indexOf('d')>=0)) tableAllowed=true
              } 
            })
          if (tableAllowed) {
            if (proxy.options.logLevel>2) console.log("CRUD table",req.method,req.url);
            next();
            return;
          }
        }


        //Check if we are allowed to access the database on user crud resulting in Adding filter createdby       
        //Loop through the auth to see if there are rights given to me
        db.auth.forEach(function(rec){
          if (rec.crud) {
            rec.crud.forEach(function(crud){
              if ((crud.user==email && crud.table==table) || proxy.containsValue(crud.user,myGroups)) {
                if (req.method=="GET" && crud.CRUD.indexOf('r')>=0) allowed.push(rec.id)
                else if (req.method=="PUT" && crud.CRUD.indexOf('u')>=0) allowed.push(rec.id)
                else if (req.method=="POST" && crud.CRUD.indexOf('c')>=0) allowed.push(rec.id)
                else if (req.method=="DELETE" && crud.CRUD.indexOf('d')>=0) allowed.push(rec.id)
              } 
            })
          }
        })

        //Check if we are seatching for singular
        if (path.length>2){
           req.query = Object.assign(req.query,{createdBy_like:allowed,id:path[2]});
           req.signular=true;
           path.splice(2,1);
           req.originalUrl=req.url=path.join('/');  
        } else {
           req.query = Object.assign(req.query,{createdBy_like:allowed});
        }
        if (proxy.options.logLevel>2) console.log("CRUD",req.method,req.url+'?'+
                Object.keys(req.query).map(function(key) {return key + '=' + req.query[key];}).join('&'));
      }
    } else {
      let status = 403;
      let message = "Error in CRUD request";
      res.status(status).json({status,message})
      return; //CRUD will always exist
    }
  }
  next(); 
}) 
    
//Fix for crud to use singular, we catch the send
plugin.use((req, res, next) => {
  const _send = res.send
  res.send = function (body) {
    var singular= require('url').parse(req.url, true).query['_singular'];
    if (req.signular || singular=="1") {
      try {
        const json = JSON.parse(body)
        if (Array.isArray(json)) {
          if (json.length === 1) {
            return _send.call(this, JSON.stringify(json[0]))
          } else if (json.length === 0) {
            return res.status(404).send('{}')
          }
        }
      } catch (e) {}
    }
    return _send.call(this, body)
  }
  next()
});