# API-Proxy folder structure

* **public**: The public folder should contain services which require no valid authorization 
* **private**: The private folder should contain services which need a valid authorization before accessing
* **system**: The system folder contains services for internal usage only
* **demo**: A private folder contains services,plugins for internal demo usage only
* Directories and files starting with **_** will be skipped

Files ending at **.db.json** will be loaded as json objects and made available as data through the API services. Changing a .db.json file will regenerate the entire database, resulting in losing all manual entered data.

Files ending at **.plugin.js** will be loaded as javascript extensions and can for example be used to add or validate the API Service calls. For more information see [express-validator](https://github.com/express-validator/express-validator) 

# Internal DB
The API-Proxy has the ability of a Persistent MemoryDB, Below you find the information by table
To any record which is created or updated the following information will be added. 

```JSON
{
 "id" : "UUID", //The UUID of the record, when not set or 0 it will be created
 "createdAt": 1347185460001, //Timestamp when record was created
 "updatedAt" : 1347185460001, //Timestamp when record was updated
 "updatedBy" : "UUID", //UUID of Auth creating the record
 "createdBy" : "UUID", //UUID of Auth updated the record
}
```

## Auth (System)
This is the internal authentication table and is not directly accessible by REST calls 

```JSON
{ 
 "id": "223-334-2234", // UUID of the user authentication   
 "login"  : "backend@do.proxy", //The id used to login
 "hash" : "2a97516c354b68848cdbd8f54a226a0a55b21ed138e207ad6c5cbb9c00aa5aea", //Password Hash
 "groups": ["admin"] //Groups this user is part of
}
```

## KeyVault (System)
When user is authenticated the application can access the keyvault by REST api to read keys the user has rights to. Admin users can only create or update keys.
```JSON
{
  "id": "mykey", //The id of the key
  "key": '5eb276d06e51ddf4ce8a450592c2666a38a', //The actual key 
  "groups": ["default"] //The groups that can read the key (when empty default is assumed)
}
```


## Users (System)
Detailed user info table, it can be edited by the user. Id is linked to the Auth table and cannot be changed. 

```JSON
{ 
   "id": "223-334-2234",  //UUID linked to the Auth table
   "email": "admin@demo.com", //email address, when not set system assumes auth.login
   "name": "Mister Admin", //Name of the user
   "avatar_url": "/assets/do/avatars/user1-128x128.jpg", //URL to the avatar of the user
   "orgGroup": "it", //Optional: Within demo, this is used to route request to a specific group
   ... //All other field are just for information 
}
```

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
