const proxy = require('../ngx-do-proxy');
const plugin = proxy.app;
//Add your custom code here


// Domestic animals page
if (proxy.strToBool(proxy.options['rebuild-db'])) plugin.use('/rebuild-db', function(req, res,next) {
  if (req.method=="POST" && proxy.hasRole('admin',req)) {
    const {recreateTables} = req.body;
    let status = 200;
    let message = "Server restarted";
    res.status(status).json({status,message,recreateTables});
    proxy.restart(2,null,{recreateTables:recreateTables}); //Restart the proxy and rebuild the databases, when DB is not change plugins will be reloaded
    return;
  }
  let status = 403;
  let message = "Unauthorized access, to rebuild-db"
  return res.status(status).json({status,message});
})

