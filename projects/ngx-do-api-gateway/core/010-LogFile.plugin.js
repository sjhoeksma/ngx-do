const proxy = require('../ngx-do-api-gateway')
const plugin = proxy.app;
const path = require('path')

if (proxy.options.logFile) 
 plugin.use('/logFile', (req,res,next)=>{
    //Only admin can update or delete
    var admin = proxy.hasRole('admin',req);
    if (!admin) {
        const status=403;
        let message = "logFile only by Admin";
        return res.status(status).json({status, message})
    } 
    next();
  }, 
  require('express').static(path.join(process.cwd(),proxy.options.dataDir,proxy.options.logFile)));
