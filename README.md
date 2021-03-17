# Fetch Rewards Coding Exercise - Backend Software Engineering
This repo includes an Express.js server offering a REST API with Node.js that accepts HTTP request and returns responses based on conditions outlined later in this readme. 

## Project Premise
* There is a `user` that can have `points` in their account from various `payers`.
* Payers submit `transactions` to add or subtract points from a user.
  * Transactions are stored in memory on the backend.
  * The total points per payer cannot go below 0.
* The user can `spend` points.
  * The user's total points can't go below 0.
  * When spending points, the oldest points are spent first based on their transaction's timestamp, regardless of payer.

## Getting Started
1) You must have [Node.js](https://nodejs.org/) version v10.0.0 installed.
  Verify version by running the command below in your terminal.
    ```
    node --version
    ```
2) Clone repo
    ```
    git clone https://github.com/scottgall/fetch-rewards-backend-takehome.git
    ```
3) Go to the project's root directory
    ```
    cd /my/path/to/fetch-rewards-backend-takehome
    ```
4) Install dependencies
    ```
    npm install
    ```
5) Start the server!
    ```
    npm start
    ```
    Your terminal should read:
    ```
    Server running on port: http://localhost:5000
    ```
6) Verify the app is running by visiting http://localhost:5000 in your browser. You should see the following greeting: \
    ![homepage greeting](/assets/images/greeting.jpg)

## Making API calls
**NOTE** Because this app doesn't use any durable data store, the app  will start from a clean slate whenever the sever is booted up, which means:
* The user will have no points
* There will be no payer transactions

We will be using **Postman** to make calls to the API.  
* Go to the [Postman](https://www.postman.com/) site.
* Create an account or log in.
* From your acount's home screen, create or use an existing `Workspace` by clicking on `Workspace` in the top left menu bar.
* Once you're in a workspace, click on `Create a request` on the right under `Getting started`.
* Now your interface should look like the image below.
>![Postman 1](/assets/images/postman-1.jpg)
* Let's start by adding some transactions

## POST Route "/points" - Add Payer Transaction
***REQUEST BODY FORMAT*** 
```
{"payer": <str>, "points": <int>, "timestamp": <ISO8601>}
```
* Click the dropdown that says `GET` and select `POST`.
* Enter the server port with the `/points` endpoint.
>![Postman 2](/assets/images/postman-2.jpg)
* Under the URL, select `Body` and  check the `raw` radio button and select `JSON` from the dropdown.
* Enter a valid request body in the section below, which you can copy and paste from [points.json](points.json).
>![Postman 3](/assets/images/postman-3.jpg)
* Click `Send` and you should receive a `Status: 200 OK` response in the body section below.
>![Postman 4](/assets/images/postman-4.jpg)

#### POST route "/points" Errors
* A `Status: 422 Unprocessable Entity` error response will occur if a request body is sent with the wrong format:
  * Negative points that would make `payer` points go below zero.
  * Adding 0 points
  * Missing parameters
  * Additional parameters
  * Paramets with wrong type (e.g. timestamp not in ISO 8601 format)
* Example error responses:
  * Extra param and incorrect timestamp format.
  >![Postman 5](/assets/images/postman-5.jpg)
  * Negative points would make `payer` points go below zero.
  >![Postman 6](/assets/images/postman-6.jpg)

**NOTE:** When `payer` adds a negative amount of `points` and the payer has enough points to cover the negative amount, the transaction is not  added to the transaction list.  Instead, the negative points are subtracted from other transactions from the same `payer` from  newest  to oldest. If a transaction is completely negated from the negative points, it is removed from the transaction list.

### POST route "/points/spend" - Spend User Points
***REQUEST BODY FORMAT***
```
{"points": <str>}
```
* Make sure the request type is set to `POST`.
* Enter the server port with the `/points/spend` endpoint.
* Under the URL, select `Body` and  check the `raw` radio button and select `JSON` from the dropdown.
* Enter a valid request body in the section below.
* Click  `Send` and if the user has enough points, you should receive a `Status: 200 OK` response in the body section below along with a list showing how many points were spend from each `payer`.
>![Postman 7](/assets/images/postman-7.jpg)
* The response above is the result of sending sending `{"points": 5000}` to `"/points/spend'` after the following transactions have been added by payers:
  ```
  {"payer": "DANNON", "points": 1000, "timestamp": "2020-11-02T14:00:00Z"}
  {"payer": "UNILEVER", "points": 200, "timestamp": "2020-10-31T11:00:00Z"}
  {"payer": "DANNON", "points": -200, "timestamp": "2020-10-31T15:00:00Z"}
  {"payer": "MILLER COORS", "points": 10000, "timestamp": "2020-11-01T14:00:00Z"}
  {"payer": "DANNON", "points": 300, "timestamp": "2020-10-31T10:00:00Z"}
  ```

#### POST route "/points/spend" Errors
* A `Status: 422 Unprocessable Entity` error response will occur if a request body is sent with the wrong format:
  * User doesn't have enough points to spend
  * User spends 0 points
  * Missing parameters
  * Additional parameters
  * Paramets with wrong type (e.g. points in string format)

### GET route "/points" - Get Points Available Per Payer
* This route gives the user their remaining available `points` per `payer`.
>![Postman 8](/assets/images/postman-8.jpg)



