# Project2_server

* System requirements
Install `npm` on XOS `brew install npm`
Install `node` on XOS `brew install node`


* Install all the dependency packages: 
In side the `Project2_server` directory do `npm install` 

* Install new packages: 
In side the `Project2_server` directory do `npm install -save <package_name>`

* Place the config files: 
Put the config.json and aws-config.json file inside the `config` directory

* run server:
node app.js

* register a new user:
send a request to http://localhost:5000/auth/register
the body is a json file like:
{
	"email": "yuhao@gmail.com",
	"password":"123456", 
	"fullname":"YuhaoZhang"
}

* login:
send a request to http://localhost:5000/auth/login
the body is a json file like:
{
	"email": "yuhao@gmail.com",
	"password":"123456"
}
