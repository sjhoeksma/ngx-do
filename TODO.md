# TODO
My work list on activities to work on.

## Bugs & Enhancements
1. Add all other CDK components to demo project 
1. Add empty base project you could use with ng create ngx-do-app
1. Make function to add/Remove AppMenu  
1. Create widget for document and demo ing of widget
1. Add loading spinner on login and loading modules
1. Lets encrypt for Proxy: https://git.coolaj86.com/coolaj86/greenlock-express.js
1. Fix problem if proxy not available
1. Audience for jwttoken azure should be web side 
1. Encrypt doProxy auth data with jwt key
1. Add option to register a function which will be called be fore a restart (plugins)
1. Session of ngx-proxy should be stored in db (now single node)
1. Avatar as function
1. Implement audit trail on all crud elements
1. Types in stead of []
1. Add is_null to JSON_SERVER
1. Do not redirect to login if token is not valid on login of masl
1. Create trafic light dash, not spinning
1. Add option to use real database
1. Add plugin allowing Admin to import export data
1. Create page allowing Admin to assign roles and reset passwords of users
1. Create page for admin to assign role to a user
1. Extends Keyvault API to add options to inidcated encrypted data when not encrypted, use example using res.read
1. Implement a proper in merory SQL
1. AddMonitoring of App: use example form insight: https://github.com/angulartics/angulartics2 / https://codeburst.io/using-google-analytics-with-angular-25c93bffaa18 https://geeklearning.io/monitor-your-angular-app-with-application-insights/
1. ApiManager plugin on /api based on swagger
1. Run basic auth when not authorized using 
1. Spinner to widgets, also add to main page of demo so you can use overall
1. User info is loaded 3 times on startup, also it loads before auth
1. Implement in memory db: http://www.tingodb.com/
1. Lege user request op task table maar user heeft geen data geeft 500 erro


## Rebuild of package structure
```
ngx-do = Main Library Packages
ngx-do-msal = The Azure auth library and is registering it self to ngx-do
ngx-do-pages = The default pages
ngx-do-widgets = All approved widgets
ngx-do-ai = Contains the Dialog flow integration, register function into core 
ngx-do-survey = Contains the survey+editor register function
ngx-do-wip = All work in progress - should not be used for production
ngx-do-api-gateway = The current ngx-do-proxy
ngx-do-demo = The demo program
ngx-do-app = Empty framework of app to be used when creating app
```


## Widgets
* BoxCard - Simple box card with options for zoom and close
* Schedule - Create scheduler tool, allowing to create  tasks
* Kabanboard - Simple way to prioritize work
* Sparkline - 
* Cloudability - As api or widget
* DemoWdiget - widget for documentation and demo of widget

## Documentation
* Select a documentation engine
* Document all classes at top level


