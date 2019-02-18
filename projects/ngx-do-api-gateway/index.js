const ngx_do_proxy = require('./ngx-do-api-gateway');

ngx_do_proxy.start({
  dataDir:'../../data',
  logFile:'ngx-do-api-gateway.log'
});

