
const proxy = require('../../ngx-do-proxy')
const plugin = proxy.app;

// Add a simple route for static content served from 'public'
plugin.use("/",proxy.static("../../dist/ngx-do-demo"));