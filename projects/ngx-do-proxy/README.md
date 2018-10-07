# Mock API Server
This packages is there to run a mock json base API/DB server with authentication, authorization, ddos protection and auto rebuild of database base on the different data files. **Don't use it for production services.**

To start the server use ```node api-proxy.js``` or ```npm start --silent -- ``` and for example to override the port configuration variable add ```--port=3001```

# Deploying it on zeit.co
If you need hosting of this proxy zeit.co offer 3 free instances you can use as follows.

Install now globally

```
  sudo npm install now -g
```

Publish the db server to zeit
```
now --public
now alias [url from now] [alias]
```

Removing from zeit

```
now rm [url from now or alias-doit]```

