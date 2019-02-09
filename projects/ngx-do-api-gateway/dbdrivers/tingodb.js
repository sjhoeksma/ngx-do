const express = require('express');
const rewrite = require('express-urlrewrite')

const fs = require('fs');
const engine = require("tingodb")({});

// load config

/*
if (cfg.app.engine=="mongodb") {
	engine = require("mongodb");
	module.exports.getDB = function () {
		if (!db) db = new engine.Db(cfg.mongo.db,
			new engine.Server(cfg.mongo.host, cfg.mongo.port, cfg.mongo.opts),
				{native_parser: false, safe:true});
		return db;
	}
} else {
	engine = require("tingodb")({});
	module.exports.getDB = function () {
		if (!db) db = new engine.Db(cfg.tingo.path, {});
		return db;
	}
}
*/


//Fake not sql connection
var nonSql = {
  create : function(db){
    return express(); //Just return an express server
  },
  router : function(server){
    const routes = myOptions.routes ? JSON.parse(fs.readFileSync(myOptions.routes, 'UTF-8')) : null;//Load the routes from json
    
    const router = express.Router();
    router.get('/__rules', (req, res) => {
      res.json(routes)
    });
    
    Object.keys(routes).forEach(key => {
      router.use(rewrite(key, routes[key]))
    })

    return router
  }
}

let myOptions;
// Depending on engine, this can be a different class
module.exports={
  create : function(options){
    myOptions = options;
    let db = new engine.Db(myOptions.dataDir, {});
    return nonSql.create(db)
  },
  router : function(server){
     return nonSql.router(server);
  }
};

