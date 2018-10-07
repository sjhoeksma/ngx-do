# API-Proxy folder structure

* **public**: The public folder should contain services which require no valid authorization 
* **private**: The private folder should contain services which need a valid authorization before accessing
* **system**: The system folder contains services for internal usage only
* _ : Directories and files starting with _ will be skipped

Files ending at .db.json will be loaded as json objects and made available as data through the API services. Changing a .db.json file will regenerate the entire database, resulting in losing all manual entered data.

Files ending at .val.json will be loaded as json objects and used to validate the API Service calls. For more information see [express-validator](https://github.com/express-validator/express-validator) 