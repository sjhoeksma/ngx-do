const proxy = require('../ngx-do-proxy');
const http_proxy = require('express-http-proxy');
const plugin = proxy.app;
//Add your custom code here


if (proxy.strToBool(proxy.options['demo-data'])) 
  plugin.use('/demo-data',http_proxy("https://jsonplaceholder.typicode.com"));
