const fs = require('fs');
const proxy = require('../ngx-do-api-gateway');
const util = require('util');
const plugin = proxy.app;
const path = require('path')
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
var extend = function () {
	// Variables
	var extended = {};
	var deep = false;
	var i = 0;

	// Check if a deep merge
	if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
	    deep = arguments[0];
	    i++;
	}

	// Merge the object into the extended object
	var merge = function (obj) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				// If property is an object, merge properties
				if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
					extended[prop] = extend(extended[prop], obj[prop]);
				} else {
					extended[prop] = obj[prop];
				}
			}
		}
	};

	// Loop through each object and conduct a merge
	for (; i < arguments.length; i++) {
		merge(arguments[i]);
	}
	return extended;
};

//Check if this is a json file and not url 
function isSWAGGER(s) {
  return !proxy.isURL(s) && /\.sw.json$/.test(s)
}

function parseSwagger(filepath,contentString){
  if (!contentString || contentString==="") return {} 
  var string = contentString.replace(/^({\s*})*|({\s*})*$/g, "")
  string = string.replace(/}\s*({\s*})*\s*{/g, ",")
  string = string.replace(/}\s*{/g, ",")
  string = string.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1') //Strip comments
  string = string.replace(/\r?\n/g, "") //Allow multiple lines
  try {
    return jsonic(string);
  } catch (err) {
    console.log("Error parsing swagger",filepath,err);
    return {}
  }
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
            if (content) files.push(parseSwagger(filepath,content));
            if (count==0){
              var schema = Object.assign({},swaggerBase);
              files.forEach(obj=>{
                  schema = extend(true,schema,obj);
              });
              plugin.use(proxy.options.swagger, swaggerUi.serve, swaggerUi.setup(schema));
              if (proxy.options.logLevel>1) console.log("Swagger active on",proxy.options.swagger);  
              const opts = {
                schema: schema,
                validateRequest: true,
                validateResponse: true,
                /*
                requestValidationFn: (req, data, errors,res,next) => {
                  const message=`failed request validation: ${req.method} ${req.originalUrl}\n ${util.inspect(errors)}`;
                  const status=400;
                  res.status(status).json({status, errors});
                  return true;
                },
                responseValidationFn: (req, data, errors,res,next,encoding) => {
                  console.log(`failed response validation: ${req.method} ${req.originalUrl}\n ${util.inspect(errors)}`)
                },
                */
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
