const ngx_do_proxy = require('./ngx-do-api-gateway');

ngx_do_proxy.start({
  logFile:'ngx-do-api-gateway.log',
});

