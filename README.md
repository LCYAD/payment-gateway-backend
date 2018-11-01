# Payment Gateway (Backend)
This is a backend api server which accepts different request to perform credit card or other types of online payment and will call the relative server based on the information provided.

Note:  The current implementation does not connect the server to any third party API gateway but instead mock the transaction as if the transaction has taken place.

# The POST API Gateway - Create Payment Transaction
The 2 POST request API gateway are used to create Transaction and are as follows:
```
http://{api_endpoint}/api/payment/A
```
and
```
http://{api_endpoint}/api/payment/B
```

* Gateway A is used if the credit card is amex or if the currency of the other credit card are USD, AUD, EUR, JPY, CNY.

* Gateway B is used for all other credit card exclude amex that uses HKD as their currency of transcation.

For the POST request API gateway, a JSON body will have to be passed in the following format.

```
{
	"order": {
		"name": "LEE",
		"phone_num": "444444444",
		"currency": "USD",
		"price": 10
	},
	"credit_card": {
		"type": "amex",
		"card_number": "4444444444444444",
		"ccv": "555",
		"holder_name": "Lee"
	}
}
```

The above fields are mandatory and if the some fields are missed, like follow:

```
{
	"order": {
		"name": "LEE",
		"phone_num": "444444444",
		"currency": "USD",
		"price": 10
	},
	"credit_card": {
		"type": "amex",
		"card_number": "4444444444444444"
	}
}
``` 
 
the following response will occur.
```
{
    "meta": 400,
    "message": "Bad Request",
    "res_payload": "Bad Input Format.  Missing: credit_card.ccv, credit_card.holder_name"
}
```

When the request body is valid, the API will return a 200 response with a transaction ID which you can use the GET Request API endpoint to get the result of the transaction.

```
{
    "meta": 200,
    "message": "Success",
    "res_payload": "5bdad988165ee90013fa66fe"
}
```

# The GET API Gateway - Retrieve Transaction Result
The GET API Gateway is used to get the transaction result and the endpoint is as follows:
```
http://{api_endpoint}/api/getID/{transactionID}
```
The transaction ID is provided when you are creating a new payment transcation and it should be the length should be 24 letters or digits combined.

Sample Response:
```
{
    "meta": 200,
    "message": "Success",
    "res_payload": {
        "price": 10,
        "_id": "5bdad6af8f330500147c0da4",
        "status": "Success",
        "name": "LEE",
        "phone_num": "444444444",
        "currency": "USD",
        "created_at": "2018-11-01T10:34:23.336Z",
        "updated_at": "2018-11-01T10:34:23.349Z",
        "__v": 0
    }
}
```
Invalid Transaction ID response:
```
{
    "meta": 400,
    "message": "Bad Request",
    "res_payload": "Invalid ID Format"
}
```

# API Response Meta Code
Response meta code is as follows:
* 200: Success
* 400: 'Bad Request',
* 404: 'Not Found',
* 500: 'Internal Error',
* 601: 'Response Error',
* 801: 'Record not Found',
* 811: 'Timeout'


# API Design
The following is a sample design of the API:

<img src="https://res.cloudinary.com/drqqvhupz/image/upload/v1541071468/Coding%20Related/Payment_gateway_POST_API.png">

* When the user generate the POST request, an Transaction Record with the status Pending will be created on the MongoDB and Redis Cache and the ID of the transaction record will be the transaction ID that is returned to the user.
* A task will when be pushed to the message queue in which a group of workers will take the job and perform the transaction accordingly.  The status of the transaction will be updated on MongoDB and Redis Cache accordingly after the transaction either completes or fail.


#### For the GET Request logic:
* The Cache will first be searched (which has a TTL of 24 hours) and if the information is not found, then the DB will be searched and if the transaction is found, the transaction will be reinserted back to the Redis Cache.  In the case if the status continues to be Pending on the transaction, due to problems with the service worker, then the API will time out the user after 3 retries.

# Logging
Beside the usual terminal logging using bunyan, a Redis Logging is also setup to insert any important logs that might need to stored permanently (either in the cloud or local).  A worker can be created to perform daily, hourly, or weekly logs storage.

# Installation
The whole API is wrapped in docker-compose so you will need to download docker at your local setup.

Then git clone this repository in your local machine, and add the following .env in the /config folder.

```
REDIS_HOST_DEV=127.0.0.1
REDIS_PORT_DEV=6379

REDIS_HOST_PR=127.0.0.1
REDIS_PORT_PRO=6379
```

and run the following code:

Then just run the 2 commands below:
```
docker-compose build
docker-compose up
```

and the API service should be accessible on localhost:8080

# Adding new Payment Gateway
To add new API routes, all you need to do is add new payment gate class (js file) with the relevant logic to

```
/lib/payment_gateway/implementation
```
then add that export that class to the index.js inside the payment gateway folder.

You will also need to add the type (replacing the 'mock') in the route when you call the spawn task function:

<img src="https://res.cloudinary.com/drqqvhupz/image/upload/v1541073058/Coding%20Related/Screenshot_2018-11-01_at_7.49.13_PM.png">

The service worker will load the necessary payment gateway class based on your type in the task.

# Testing
The API service uses Jest for testing but the unit test has yet to be added (very low code coverage)

# Linting
Using Eslint extending air-bnb base

# Deployment
Not yet Deployed to server

# Things that is needed to improve
1. More testing
2. CICD
3. Implementing some third party API payment gateway.
4. Some Readme.io API documentation.