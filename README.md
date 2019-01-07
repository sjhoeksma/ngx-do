# ngx-do - An ADMIN PANEL for deploying cloud services.

Based on [CK-Admin](https://github.com/codetok/cdk-admin)

This project contains the library, proxy and demo, make sure you run `npm run build` to create library first before you run the demo `ng serve`. The because the demo project uses REST services, like security and user management, you also requires start the proxy service by using `npm run proxy`. 

## Build Library

Run `npm run build` to build the library, or `npm run publish` to push the library to npm.  

## Development Demo

Run `ng serve` or `npm run publish_demo` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Run Proxy 

We provide a proxy service base on JSONServer, with implemented security controls. To run the proxy use `npm run proxy` to publish the proxy to npm use `npm run publish_proxy`

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build. If you need to changed the base directory used --base-href /myUrl/

To test your the created website you can use `python -m SimpleHTTPServer 8000` in the build directory to run the web site. 

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running a webserver on your build

If you have install phyton on your system you can validate a build by using
`python -m SimpleHTTPServer 8000`

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Links as Reference
* [CDK Admin V2](https://github.com/codetok/cdk-admin)
* [Material ICONS](https://material.io/tools/icons/?icon=local_laundry_service&style=baseline)
* [Dialog Flow API - Demo](https://angularfirebase.com/lessons/chatbot-in-angular-with-dialogflow-api-ai/)
* [Azure Chatbot](https://dev.botframework.com/)
* [SurveyJS](https://surveyjs.io/)
* [Verify JWT token Azure](https://github.com/dei79/node-azure-ad-jwt)
* [Angular Components](https://github.com/brillout/awesome-angular-components)
* [Azure Api](https://tsmatz.wordpress.com/2017/06/22/web-api-and-custom-scope-with-azure-ad-v2-endpoint/)
* [Angular Builder](https://github.com/alan-agius4/ng-mono-repo-starter)
* [Node Red](https://github.com/node-red/node-red)
* [proxy support](https://www.npmjs.com/package/express-http-proxy)
* [JWT Token validation](https://jwt.io/)
* [Timeline](https://codepen.io/abisz/pen/qaEOEm)
* [Azure Pipeline](https://itnext.io/easy-way-to-deploy-a-angular-5-application-to-azure-web-app-using-vsts-pipelines-4a288b9deae1)
* [Azure Test](https://medium.com/@flu.lund/automated-angular-unit-testing-on-visual-studio-team-services-22c03497265c)
* [Continues Integration](https://travis-ci.org/)
* [Configurable Angular Modules](https://medium.com/@michelestieven/angular-writing-configurable-modules-69e6ea23ea42)
* [NodeJS Request](https://www.thepolyglotdeveloper.com/2017/10/consume-remote-api-data-nodejs-application/)
* [Mongo DB Docs](https://github.com/ramnes/awesome-mongodb)
* [Express-Mug](https://www.npmjs.com/package/express-mung)
* [ngx-datatable](http://swimlane.github.io/ngx-datatable)
* [CI&CD](https://medium.com/@edzob/ci-and-cd-in-the-wild-b5ca8f71fa28)
* [Infra As Code](https://www.visualstudiogeeks.com/blog/DevOps/Use-VSTS-ReleaseManagement-to-Deploy-and-Test-in-AzureDevTestLabs)
* [Compliancy](https://azure.microsoft.com/en-us/blog/payment-processing-blueprint-for-pci-dss-compliant-environments/)
* https://electric-cloud.com/ 
* [Secure DevOps](http://salmanbaset.blogspot.com/2016/08/can-cloud-help-developers-securely-secdevops.html)
* [Restart of Express](https://blog.cloudboost.io/reloading-the-express-server-without-nodemon-e7fa69294a96)
