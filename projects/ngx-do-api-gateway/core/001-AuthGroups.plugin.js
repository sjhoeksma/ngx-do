const proxy = require('../ngx-do-api-gateway')
const plugin = proxy.app;

//We want to validate if user is requesting a keyvault he is allowed
plugin.use("/authgroups",(req,res,next)=>{
  //Only admin can update or delete
  var admin = proxy.hasRole('admin',req);
  if (!admin) {
      const status=403;
      let message = "AuthGroups requires Admin";
      return res.status(status).json({status, message})
  } else if (req.method=="GET" ){
    const db = plugin.db.getState();
    let rc = [];
    db.auth.forEach(rec=>{
      rc.push({id:rec.id,user:rec.login,groups:rec.groups});
    })
    const status=200;
    return res.status(status).json(rc);
  } else if (req.method=="POST" || req.method=="PUT"){
    const {id, user,groups} = req.body;
    if (id && user){
      const db = plugin.db.getState();
      let index = db.auth.findIndex(auth => auth.id == id);
      if (index>=0){
        db.auth[index].groups=groups || ['default'];
        plugin.db.write();
        const status=200;
        return res.status(status).json({id,user,groups});
      }
    }
    const status=304;
    return res.status(status).json({id,user,groups});
  } else {
    const status=403;
    let message = "AuthGroups unsupported method";
    return res.status(status).json({status, message})
  }
}) 