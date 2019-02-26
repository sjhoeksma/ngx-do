const fs = require('fs');
const proxy = require('../ngx-do-api-gateway');
const util = require('util');
const plugin = proxy.app;
const path = require('path')
const deepmerge = require('deepmerge');
const jsonic = require('jsonic')
const swaggerUi = require('swagger-ui-express');
const swaggerValidator = require('./lib/swagger-validator.js');

const swaggerBase = {
  "swagger": "2.0",
  "info": {
    "version":proxy.options.version,
    "title":proxy.options.name,
    "description": proxy.options.description,
    "license": {
      "name": proxy.options.license
    }
  },
  /*
  "securityDefinitions":{
    "auth-token":{
      type: "apiKey",
      name: "bearer",
      in: "query"
    }
  },
  */
  "tags": [],
  "paths":{},
  "definitions":{},
  "schemes": [
    "http","https"
  ],
  "consumes": [
    "application/json"
  ],
  "produces": [
    "application/json"
  ]
}

//Check if this is a json file and not url 
function isSWAGGER(s) {
  return !proxy.isURL(s) && /\.sw.json$/.test(s)
}

module.exports = {
  asyncPlugin:function(){
    if (proxy.options.swagger){
      proxy.asyncPlugin(false); //register async plugin
      proxy.options.restartMode=2; //Restart on every json file changed
      proxy.fileList(__dirname,isSWAGGER,function(coreList){ //Load Swagger files from core directory
        proxy.fileList(path.join(process.cwd(), proxy.options.watchedDir),isSWAGGER,function(list){
          list = coreList.concat(list);
          var count = list.length;
          var files =[];
          var processFile=function(filepath,content){
            count--;
            if (content) files.push(proxy.jsonParse(content));
            if (count==0){
              var schema = Object.assign({},swaggerBase);
              files.forEach(obj=>{
                  schema = deepmerge(schema,obj);
              });
              plugin.use(proxy.options.swagger, swaggerUi.serve, swaggerUi.setup(schema));
              if (proxy.options.logLevel>1) console.log("Swagger active on",proxy.options.swagger);  
              const opts = {
                schema: schema,
                validateRequest: proxy.options.swaggerValidateRequest==undefined ? true : proxy.options.swaggerValidateRequest,
                validateResponse: proxy.options.swaggerValidateResponse==undefined ? false : proxy.options.swaggerValidateResponse,
                
                requestValidationFn: (req, data, errors,res,next) => {
                  const message=`failed request validation: ${req.method} ${req.originalUrl}\n ${util.inspect(errors)}`;
                  const status=400;
                  res.status(status).json({status, errors});
                  return true;
                },
                
                responseValidationFn: (req, data, errors,res,next,encoding) => {
                  console.log(`failed response validation: ${req.method} ${req.originalUrl}\n ${util.inspect(errors)}`)
                },
                
              };
              plugin.use(swaggerValidator(opts));
              proxy.asyncPlugin(true); //Tell we are ready
            }
          }

          list.forEach(filepath=>fs.readFile(filepath, { encoding: "utf8" }, (err, content) => {
            if (err) return processedFile(null,null) 
            processFile(filepath,content)
          }));
        })
      })
    }
  }
}
