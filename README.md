# Readme

* API hosted on separate instance from console
* Routes for MVP scope
  - POST `/v0/projects`
  - GET `/v0/projects`
  - PUT `/v0/projects`
* [Detailed REST Specification](https://www.notion.so/ondecentral/Main-Database-Schema-3eeacfc3647846a483d5c53d057daebf)

## Context

Initial Design: https://1drv.ms/u/s!ArXiVZwDHyizrUCxRvPMAm5FbW3S?e=camrQa


## How to setup MongoDB

### For your local dev environment

#### Pre-requisites

* Install Signal for mobile and your development machine, use Signal disappearing messages for sending any API keys or private keys or any confidential data
* Ensure you have MongoDB installed on your local machine
* Create a mongo config file and store it in the default location specified for your operating system [Reference](https://www.mongodb.com/docs/manual/reference/configuration-options/)
* Ask a team member for the latest `.env` file


#### Starting the API server

Ensure mongo DB is running

`npm i`  

`npm run dev`  
  

#### Troubleshooting

Check if mongo is still running

```zsh
ps aux | grep -v grep | grep mongod
```

Check if there is a process running on port 27017

```zsh
lsof -nP -iTCP -sTCP:LISTEN | grep 27017
```

Should return

```
mongod    39576 nameofuser   10u  IPv4 0x52608ac185b58e55      0t0  TCP 127.0.0.1:27017 (LISTEN)
```

## MongoDB

### See local debug log output

```zsh
cd /usr/local/var/log/mongodb
tail -f mongo.log
```

### Reminders

Can be ran as a deamon or a process. If running it as a process it may not show up when 

```
Name              Status User File
mongodb-community none        
nginx             none        
postgresql@14     none  
```

## Testing with PostMan ondecentral-api document locally

### Troubleshooting
The example requests as they exist in the PostMan document will not work.
Try the following format instead:

```zsh
curl -s -X POST 'localhost:3000/register' -H "Content-Type: application/json" -d '{"name":"JC","email":"jc@test.com","password":"12qwaszx"}'
```

- ensure that there are no line breaks, unless using the "\" escape character
- ensure that the json data surrounded with double quotes is protected with single quotes around the object

After registering, you must login to attain authorization for further testing:
```zsh
curl -s -X POST 'localhost:3000/login' -H "Content-Type: application/json" -d '{"email":"jc@test.com","password":"12qwaszx"}'
```

After logging in, you must use the values from the "token" and "_id" keys provided in the response when testing other routes, replacing the ${jwt} and ${userID} with those values, respectively. I recommend storing those items somewhere in this readme for easy copy/pasting while testing, but do not save them to the file.
### More Commands for testing

#### Get requests
```zsh
curl -s -X GET 'localhost:3000/sections/' -H "Content-Type: application/json" -d '{"user._id":"${userID}","token":"${jwt}"}'
```
```
Expected Output: {"docs":[{"_id":"${sectionID}","sectionType":"spreadsheet","title":"newTitle","sheetContent":"{}","createdBy":"${userID}
","__v":0}],"totalDocs":1,"limit":5000,"hasPrevPage":false,"hasNextPage":false,"page":1,"totalPages":1,"pagingCounter":1,"prevPage":null,"nextPage":null}
```

```zsh
curl -s -X GET 'localhost:3000/sections/${sectionID}' -H "Content-Type: application/json" -d '{"section._id":"${sectionID}","user._id":"${userID}
","token":"${jwt}"}'
```
```
Expected Output: {"docs":[{"_id":"${sectionID}","sectionType":"spreadsheet","title":"newTitle","sheetContent":"{}","createdBy":"${userID}
","__v":0},{"_id":"${sectionID}","sectionType":"spreadsheet","title":"newTitle","createdBy":"${userID}
","__v":0}],"totalDocs":2,"limit":5000,"hasPrevPage":false,"hasNextPage":false,"page":1,"totalPages":1,"pagingCounter":1,"prevPage":null,"nextPage":null}
```

```zsh
curl -s -X GET 'localhost:3000/documents/' -H "Content-Type: application/json" -d '{"user._id":"${userID}
","token":"${jwt}"}'
```
```
Expected Output: {"docs":[{"_id":"${documentID}","title":"newTitle","sections":[{"_id":"${sectionID}"}],"createdBy":"${userID}
","__v":0},{"_id":"${documentID}","sections":["${sectionID}"],"title":"newTitle","createdBy":"${userID}
","__v":0}],"totalDocs":2,"limit":5000,"hasPrevPage":false,"hasNextPage":false,"page":1,"totalPages":1,"pagingCounter":1,"prevPage":null,"nextPage":null}
```

```zsh
curl -s -X GET 'localhost:3000/documents/${documentID}' -H "Content-Type: application/json" -d '{"document._id":"${documentID}","user._id":"${userID}
","token":"${jwt}"}'
```
```
Expected Output: {"docs":[{"_id":"${documentID}","title":"newTitle","sections":[{"_id":"${sectionID}"}],"createdBy":"${userID}
","__v":0},{"_id":"${documentID}","sections":["${sectionID}"],"title":"newTitle","createdBy":"${userID}
","__v":0}],"totalDocs":2,"limit":5000,"hasPrevPage":false,"hasNextPage":false,"page":1,"totalPages":1,"pagingCounter":1,"prevPage":null,"nextPage":null}
```

```zsh
curl -s -X GET 'http://localhost:3000/subscription/plans' -H "Content-Type: application/json"
```
```
Expected Output: {"objects":[{"type":"SUBSCRIPTION_PLAN","id":"","updatedAt":"","version":"","isDeleted":,"presentAtAllLocations":,"subscriptionPlanData":{"name":"","phases":[{"uid":"","cadence":"","periods":,"recurringPriceMoney":{"amount":"","currency":""},"ordinal":""},{"uid":"","cadence":"","recurringPriceMoney":{"amount":"","currency":""},"ordinal":""}]}}]}
```

#### POST requests

This is one method on how to seed the DB

```zsh
curl -s -X POST 'http://localhost:3000/subscription/plans/create' -H "Content-Type: application/json" -d '{ "ref": "K327ZWLHVT7HHURNRSDLEOWV","name": "Pro Membership","type": "MEMEBRSHIP","price": 5"frequency": "MONTHLY"}'
```



```zsh
curl -s -X POST 'http://localhost:3000/section/' -H "Content-Type: application/json" -d '{"sectionType":"spreadsheet","title":"newTitle","sheetContent":"{}","user._id":"${userID}
","token":"${jwt}"}'
```

```
Expected Output: {"_id":"${sectionID}","sectionType":"spreadsheet","title":"newTitle","sheetContent":"{}","createdBy":"${userID}
","__v":0}
```


```zsh
curl -s -X POST 'localhost:3000/documents/' -H "Content-Type: application/json" -d '{"title":"newTitle","sections":[{"_id":"${sectionID}"}],"user._id":"${userID}","token":"${jwt}"}'
```

```
Expected Output: {"sections":["${sectionID}"],"_id":"${documentID}","title":"newTitle","createdBy":"${userID}","__v":0}
```




#### PATCH requests

```zsh
curl -s -X PATCH 'localhost:3000/sections/${sectionID}' -H "Content-Type: application/json" -d '{"title":"newestTitle","section._id":"${sectionID}","user._id":"${userID}","token":"${jwt}"}'
```

```
Expected Output: {"_id":"${sectionID}","sectionType":"spreadsheet","title":"newestTitle","sheetContent":"{}","createdBy":"${userID}
9","__v":0}
```

```zsh
curl -s -X PATCH 'localhost:3000/documents/${documentID}' -H "Content-Type: application/json" -d '{"title":"newestTitle","document._id":"${documentID}","user._id":"${userID}","token":"${jwt}"}'
```

```
Expected Output: {"sections":["${sectionID}"],"_id":"${documentID}","title":"newestTitle","createdBy":"${userID}","__v":0}
```

#### Delete requests

```zsh
curl -s -X DELETE 'localhost:3000/sections/${sectionID}' -H "Content-Type: application/json" -d '{"section._id":"${sectionID}","user._id":"${userID}","token":"${jwt}"}'
```
Expected Output: {"msg":"DELETED"}

```zsh
curl -s -X DELETE 'localhost:3000/documents/${documentID}' -H "Content-Type: application/json" -d '{"document._id":"${documentID}","user._id":"${userID}","token":"${jwt}"}'
```
Expected Output: {"msg":"DELETED"}