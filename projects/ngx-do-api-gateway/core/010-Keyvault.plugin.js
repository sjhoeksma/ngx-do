const proxy = require('../ngx-do-api-gateway')
const plugin = proxy.app;

//We want to validate if user is requesting a keyvault he is allowed
plugin.use("/keyvault",(req,res,next)=>{
  //Only admin can update or delete
  var admin = proxy.hasRole('admin',req);
  if (req.method!="GET" && !admin) {
      const status=403;
      let message = "Update keyvault only by Admin";
      return res.status(status).json({status, message})
  } else if (req.method=="GET" && !admin){
    //We need to add the groups of the user
    req.query = Object.assign(req.query,{roles :proxy.roles(req)});
  } else {
    if (!req.body.roles) req.body.roles = ["default"]; //Just make sure we have default roles
  }
  next();
}) 