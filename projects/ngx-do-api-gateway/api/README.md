# API-Proxy folder structure

* **public**: The public folder should contain services which require no valid authorization 
* **private**: The private folder should contain services which need a valid authorization before accessing
* **system**: The system folder contains services for internal usage only
* **demo**: A private folder contains services,plugins for internal demo usage only
* Directories and files starting with **_** will be skipped

Files ending at **.db.json** will be loaded as json objects and made available as data through the API services. Changing a .db.json file will regenerate the entire database, resulting in losing all manual entered data.

Files ending at **.plugin.js** will be loaded as javascript extensions and can for example be used to add or validate the API Service calls. For more information see [express-validator](https://github.com/express-validator/express-validator) 

# Internal DB
The API-Proxy has the ability of a Persistent MemoryDB, You can find more information in the swagger interface which is 
available at [http://localhost:3000/swagger](http://localhost:3000/swagger)

# Plugin APIs

## Rebuild-db
This plugin when enabled in setting *'rebuild-db'* and if the user has the role **admin** on a **post** request cause the database to be rebuild from the json files and it will restart the proxy server. **Be warned this will remove all data**

## Demo-data
This is a proxy implementation towards [json based demo data](https://jsonplaceholder.typicode.com) and supports 

```
demo-data/posts     -> 100 posts
demo-data/comments  -> 500 comments
demo-data/albums    -> 100 albums
demo-data/photos    -> 5000 photos
demo-data/todos     -> 200 todos
demo-data/users     -> 10 users
```
